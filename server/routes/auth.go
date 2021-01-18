package routes

import (
	"encoding/json"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/jwtauth"
	"github.com/oluwafenyi/jumga/server/db"
	"net/http"
)

type LoginValidator struct {
	Email    string `validate:"required,email"`
	Password string `validate:"required"`
}

func getAccessToken(w http.ResponseWriter, r *http.Request) {
	var input LoginValidator

	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		ErrorResponse(http.StatusUnprocessableEntity, "invalid post data", w)
		return
	}

	if ok, errs := validateInput(input); !ok {
		ValidationErrorResponse(errs, w)
		return
	}

	user := &db.User{}
	_ = user.GetByEmail(input.Email)

	ok := user.CheckPassword(input.Password)
	if ok {
		_, tokenString, _ := tokenAuth.Encode(map[string]interface{}{"uid": user.UUID})
		if user.Store != nil {
			SuccessResponse(http.StatusOK, map[string]interface{}{"access_token": tokenString, "type": "bearer", "account_type": user.AccountType, "approved": user.Store.Approved, "store_id": user.StoreID, "rider": user.Store.DispatchRider != nil}, w)
			return
		}
		SuccessResponse(http.StatusOK, map[string]interface{}{"access_token": tokenString, "type": "bearer", "account_type": user.AccountType}, w)
		return
	}
	ErrorResponse(http.StatusBadRequest, "invalid login credentials", w)
}

func getAuthMerchant(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	merchant, ok := ctx.Value("merchant").(*db.User)
	if !ok {
		ErrorResponse(http.StatusUnprocessableEntity, "cannot process request", w)
		return
	}
	SuccessResponse(http.StatusOK, map[string]interface{}{"data": merchant}, w)
}

func getAuthUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user, ok := ctx.Value("user").(*db.User)
	if !ok {
		ErrorResponse(http.StatusUnprocessableEntity, "cannot process request", w)
		return
	}
	SuccessResponse(http.StatusOK, map[string]interface{}{"data": user}, w)
}

func AuthRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.GetHead)

	r.Post("/token", getAccessToken)

	r.Group(func(r chi.Router) {
		r.Use(jwtauth.Verifier(tokenAuth))
		r.Use(jwtauth.Authenticator)
		r.Use(MerchantCtx)

		r.Get("/merchant", getAuthMerchant)
	})

	r.Group(func(r chi.Router) {
		r.Use(jwtauth.Verifier(tokenAuth))
		r.Use(jwtauth.Authenticator)
		r.Use(UserCtx)

		r.Get("/user", getAuthUser)
	})

	return r
}
