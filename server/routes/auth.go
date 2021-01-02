package routes

import (
	"encoding/json"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/oluwafenyi/jumga/server/db"
	"net/http"
)

type LoginValidator struct {
	Email    string `validate:"required,email"`
	Password string `validate:"required"`
}

func AuthRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.GetHead)

	r.Post("/token", func(w http.ResponseWriter, r *http.Request) {
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
			SuccessResponse(http.StatusOK, map[string]interface{}{"access_token": tokenString, "type": "bearer"}, w)
			return
		}
		ErrorResponse(http.StatusBadRequest, "invalid login credentials", w)
	})
	return r
}
