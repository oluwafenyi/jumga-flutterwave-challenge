package routes

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"

	"github.com/oluwafenyi/jumga/server/db"
)

type MerchantValidator struct {
	AccountBank           string `json:"account_bank" validate:"required"`
	AccountNumber         string `json:"account_number" validate:"required"`
	BusinessName          string `json:"business_name" validate:"required"`
	Country               string `json:"country" validate:"required"`
	BusinessMobile        string `json:"business_mobile" validate:"required"`
	BusinessEmail         string `json:"business_email" validate:"required,email"`
	BusinessContact       string `json:"business_contact" validate:"required"`
	BusinessContactMobile string `json:"business_contact_mobile" validate:"required"`
	Password              string `json:"password" validate:"required"`
	ConfirmPassword       string `json:"confirm_password" validate:"required,eqfield=Password"`
}

func createFlutterwaveSubAccount() {

}

func createMerchantUser(m MerchantValidator) (*db.User, error) {
	var exists db.User
	_ = db.DB.Model(&exists).Where("email = ?", m.BusinessEmail).Select()

	if exists.UUID != "" {
		err := errors.New("user with that email already exists")
		return nil, err
	}

	user := &db.User{
		Email:       m.BusinessEmail,
		AccountType: "merchant",
		Name:        m.BusinessContact,
		Country:     m.Country,
		Mobile:      m.BusinessContactMobile,
		MerchantDetails: &db.MerchantDetails{
			Rating:         0.,
			BusinessMobile: m.BusinessMobile,
			BusinessName:   m.BusinessName,
			BusinessEmail:  m.BusinessEmail,
			Approved:       false,
		},
	}

	user.SetPassword(m.Password)

	newUser, err := user.Insert()
	if err != nil {
		return nil, err
	}
	return newUser, nil
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
			if ok, errs := validateInput(input); !ok {
				ValidationErrorResponse(errs, w)
				return
			}
			user, err := createMerchantUser(input)
			if err != nil {
				ErrorResponse(http.StatusBadRequest, err.Error(), w)
				return
			}
			data := map[string]interface{}{
				"data": user,
			}
			SuccessResponse(http.StatusCreated, data, w)
		})
	})
	return r
}
