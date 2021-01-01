package routes

import (
	"encoding/json"
	"errors"
	"github.com/go-chi/jwtauth"
	"golang.org/x/net/context"
	"net/http"
	"strconv"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"

	"github.com/oluwafenyi/jumga/server/db"
	"github.com/oluwafenyi/jumga/server/flutterwave"
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
		Store: &db.Store{
			Rating:         0.,
			BusinessMobile: m.BusinessMobile,
			BusinessName:   m.BusinessName,
			BusinessEmail:  m.BusinessEmail,
			Approved:       false,
		},
	}

	user.SetPassword(m.Password)

	err := user.Insert()
	if err != nil {
		return nil, err
	}
	return user, nil
}

func signUpMerchant(w http.ResponseWriter, r *http.Request) {
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
}

func processApproval(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	merchant, ok := ctx.Value("merchant").(*db.User)

	store, _ := getStore(merchant.StoreID)

	if !ok {
		ErrorResponse(http.StatusUnprocessableEntity, "cannot process request", w)
		return
	}

	if store.Approved {
		ErrorResponse(http.StatusBadRequest, "store is already approved", w)
		return
	}

	transaction := db.Transaction{
		Status:    "processing",
		Customer:  store.BusinessName,
		Recipient: "jumga",
	}

	_ = transaction.Insert()

	refNum := strconv.FormatInt(transaction.ID, 10)

	form := &flutterwave.PaymentInitiationForm{
		Reference:      refNum,
		Amount:         "20",
		Currency:       "USD",
		RedirectUrl:    "http://localhost:3000/payment/redirect/",
		PaymentOptions: "card,account,banktransfer,ussd",
		Meta: map[string]string{
			"customer_id": merchant.UUID,
		},
		Customer: flutterwave.Customer{
			Name:        store.BusinessName,
			Email:       store.BusinessEmail,
			PhoneNumber: store.BusinessMobile,
		},
		Customizations: flutterwave.Customizations{
			Title:       "Jumga Approval Payment",
			Description: "",
			Logo:        "",
		},
	}

	link, err := flutterwave.InitiatePayment(form)
	if err != nil {
		ErrorResponse(400, "an error occurred while setting up the transaction", w)
		return
	}
	SuccessResponse(http.StatusCreated, map[string]interface{}{"payment_link": link}, w)
}

func MerchantRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.GetHead)

	r.Route("/", func(r chi.Router) {
		r.Post("/", signUpMerchant)
		r.Route("/", func(r chi.Router) {
			r.Use(jwtauth.Verifier(tokenAuth))
			r.Use(jwtauth.Authenticator)
			r.Use(MerchantCtx)

			r.Post("/process-approval", processApproval)
		})
	})
	return r
}

func MerchantCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, claims, _ := jwtauth.FromContext(r.Context())
		user := getUserFromClaims(claims)
		if user.AccountType != "merchant" {
			ErrorResponse(http.StatusForbidden, "user not permitted to view this resource", w)
			return
		}
		ctx := context.WithValue(r.Context(), "merchant", user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
