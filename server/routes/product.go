package routes

import (
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/jwtauth"
	"github.com/oluwafenyi/jumga/server/db"
	"golang.org/x/net/context"
	"log"
	"net/http"
	"strconv"
)

func getProducts(w http.ResponseWriter, r *http.Request) {
	product := new(db.Product)
	products, _ := product.GetAll()
	SuccessResponse(http.StatusOK, map[string]interface{}{"data": products}, w)
}

func createProduct(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	merchant, ok := ctx.Value("merchant").(*db.User)
	if !ok {
		ErrorResponse(http.StatusUnprocessableEntity, "cannot process request", w)
		return
	}
	input := ProductValidator{}
	err := decodeInput(&input, r)
	if err != nil {
		log.Println(err)
		ErrorResponse(http.StatusUnprocessableEntity, "invalid post data", w)
		return
	}
	if ok, errs := validateInput(input); !ok {
		ValidationErrorResponse(errs, w)
		return
	}

	store := merchant.Store
	if store.DispatchRiderID == 0 {
		ErrorResponse(http.StatusForbidden, "store must assign a dispatch ride before listing products", w)
		return
	}

	category := db.ProductCategory{}
	_ = category.GetBySlug(input.Category)

	product := &db.Product{
		Title:       input.Title,
		Stock:       input.Stock,
		Description: input.Description,
		Price:       input.Price,
		Discount:    input.Discount,
		DeliveryFee: input.DeliveryFee,
		CategoryID:  category.ID,
		StoreID:     store.ID,
	}

	_ = product.Insert()
	SuccessResponse(http.StatusCreated, map[string]interface{}{"data": product}, w)
}

func getProduct(w http.ResponseWriter, r *http.Request) {
	productId, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	product := db.Product{}
	err = product.GetByID(productId)
	if err != nil {
		ErrorResponse(http.StatusNotFound, "resource not found", w)
		return
	}
	if product.ID == 0 {
		ErrorResponse(http.StatusNotFound, "resource not found", w)
		return
	}
	SuccessResponse(http.StatusOK, map[string]interface{}{"data": product}, w)
}

func setProductImage(w http.ResponseWriter, r *http.Request) {
	var input db.Image
	err := decodeInput(&input, r)
	if err != nil {
		ErrorResponse(http.StatusUnprocessableEntity, "cannot process request", w)
		return
	}
	if ok, errs := validateInput(input); !ok {
		ValidationErrorResponse(errs, w)
		return
	}
	ctxObj, ok := r.Context().Value("productContext").(*ProductContext)
	if !ok {
		ErrorResponse(http.StatusUnprocessableEntity, "cannot process request", w)
		return
	}
	if ctxObj.product.DisplayImage == nil {
		_ = input.Insert()
		ctxObj.product.DisplayImageID = input.ID
		_ = ctxObj.product.Update()
	} else {
		ctxObj.product.DisplayImage.Link = input.Link
		_ = ctxObj.product.DisplayImage.Update()
	}
	SuccessResponse(http.StatusOK, map[string]interface{}{"message": "image updated"}, w)
}

func deleteProduct(w http.ResponseWriter, r *http.Request) {
	ctxObj, ok := r.Context().Value("productContext").(*ProductContext)
	if !ok {
		ErrorResponse(http.StatusUnprocessableEntity, "cannot process request", w)
		return
	}
	_ = ctxObj.product.Delete()
	SuccessResponse(http.StatusNoContent, map[string]interface{}{"message": "product deleted"}, w)
}

func ProductRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.GetHead)

	r.Route("/", func(r chi.Router) {
		r.Get("/", getProducts)
		r.Route("/", func(r chi.Router) {
			r.Use(jwtauth.Verifier(tokenAuth))
			r.Use(jwtauth.Authenticator)
			r.Use(ProductCtx)
			r.Post("/", createProduct)
		})
		r.Route("/{id}", func(r chi.Router) {
			r.Group(func(r chi.Router) {
				r.Use(jwtauth.Verifier(tokenAuth))
				r.Use(jwtauth.Authenticator)
				r.Use(ProductOwnerCtx)

				r.Delete("/", deleteProduct)
				r.Put("/image", setProductImage)
			})

			r.Get("/", getProduct)
		})
	})
	return r
}

func ProductCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, claims, _ := jwtauth.FromContext(r.Context())
		user := &db.User{}
		_ = user.GetFromClaims(claims)
		if user.AccountType != "merchant" {
			ErrorResponse(http.StatusForbidden, "user not permitted to view this resource", w)
			return
		}
		if !user.Store.Approved {
			ErrorResponse(http.StatusForbidden, "merchant not approved", w)
			return
		}
		ctx := context.WithValue(r.Context(), "merchant", user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func ProductOwnerCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		productId, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
		if err != nil {
			ErrorResponse(http.StatusBadRequest, "invalid product id", w)
			return
		}
		product := &db.Product{}
		_ = product.GetByID(productId)

		if product.ID == 0 {
			ErrorResponse(http.StatusNotFound, "resource not found", w)
			return
		}

		_, claims, _ := jwtauth.FromContext(r.Context())
		user := &db.User{}
		_ = user.GetFromClaims(claims)
		if user.AccountType != "merchant" {
			ErrorResponse(http.StatusForbidden, "user not permitted to modify this resource", w)
			return
		}
		if !user.Store.Approved {
			ErrorResponse(http.StatusForbidden, "merchant not approved", w)
			return
		}

		if product.StoreID != user.StoreID {
			ErrorResponse(http.StatusForbidden, "user not permitted to modify this resource", w)
			return
		}

		ctx := context.WithValue(r.Context(), "productContext", &ProductContext{merchant: user, product: product})
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
