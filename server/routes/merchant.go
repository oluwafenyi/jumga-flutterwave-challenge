package routes

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"

	"github.com/oluwafenyi/jumga/server/db"
)

type MerchantValidator struct {
	db.User
	AccountBank           string `json:"account_bank" validate:"required"`
	AccountNumber         string `json:"account_number" validate:"required"`
	BusinessName          string `json:"business_name" validate:"required"`
	Country               string `json:"country" validate:"required"`
	BusinessMobile        string `json:"business_mobile" validate:"required"`
	BusinessEmail         string `json:"business_email" validate:"required,email"`
	BusinessContact       string `json:"business_contact" validate:"required"`
	BusinessContactMobile string `json:"business_contact_mobile" validate:"required"`
}

func MerchantRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.GetHead)

	r.Route("/", func(r chi.Router) {
		r.Post("/", func(w http.ResponseWriter, r *http.Request) {
			var input MerchantValidator

			err := json.NewDecoder(r.Body).Decode(&input)
			if err != nil {
				ErrorResponse(http.StatusUnprocessableEntity, "invalid post data", w)
				return
			}
			if ok, errors := validateInput(input); !ok {
				ValidationErrorResponse(errors, w)
			}
		})
	})
	return r
}
