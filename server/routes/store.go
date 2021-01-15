package routes

import (
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/oluwafenyi/jumga/server/db"
	"net/http"
	"strconv"
)

func getStores(w http.ResponseWriter, r *http.Request) {
	pagination := r.Context().Value("pagination").(paginationParams)

	merchants, total, next := db.GetMerchantsPage(pagination.startAt, pagination.limit)

	stores := serializeStores(merchants)

	responseData := map[string]interface{}{"data": stores}
	responseData["startAt"] = pagination.startAt
	responseData["limit"] = pagination.limit
	responseData["total"] = total
	if next {
		responseData["next"] = r.URL.String() + fmt.Sprintf("?startAt=%d&limit=%d", pagination.startAt+pagination.limit+1, pagination.limit)
	}
	SuccessResponse(http.StatusOK, responseData, w)
}

func getStore(w http.ResponseWriter, r *http.Request) {
	storeID, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		ErrorResponse(http.StatusBadRequest, "invalid store id", w)
		return
	}
	merchant := db.User{}
	_ = merchant.GetByStoreID(storeID)

	if merchant.UUID == "" {
		ErrorResponse(http.StatusNotFound, "store not found", w)
		return
	}

	categories := db.GetDistinctStoreProductCategories(merchant.StoreID)
	store := serializeStore(merchant, categories)

	SuccessResponse(http.StatusOK, map[string]interface{}{"data": store}, w)
}

func getStoreProducts(w http.ResponseWriter, r *http.Request) {
	pagination := r.Context().Value("pagination").(paginationParams)
	storeID, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		ErrorResponse(http.StatusBadRequest, "invalid store id", w)
		return
	}

	category, ok := r.URL.Query()["category"]
	if !ok || len(category) < 1 {
		category = []string{"all"}
	}
	categorySlug := category[0]

	products, total, next := db.GetStoreProductsPage(pagination.startAt, pagination.limit, categorySlug, storeID)

	responseData := map[string]interface{}{"data": products}
	responseData["startAt"] = pagination.startAt
	responseData["limit"] = pagination.limit
	responseData["total"] = total
	if next {
		if categorySlug == "all" {
			responseData["next"] = r.URL.String() + fmt.Sprintf("?startAt=%d&limit=%d", pagination.startAt+pagination.limit+1, pagination.limit)
		} else {
			responseData["next"] = r.URL.String() + fmt.Sprintf("?category=%s&startAt=%d&limit=%d", categorySlug, pagination.startAt+pagination.limit+1, pagination.limit)
		}
	}
	SuccessResponse(http.StatusOK, responseData, w)
}

func StoreRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.GetHead)

	r.Route("/", func(r chi.Router) {
		r.With(paginate).Get("/", getStores)
		r.Get("/{id}", getStore)
		r.With(paginate).Get("/{id}/products", getStoreProducts)
	})
	return r
}