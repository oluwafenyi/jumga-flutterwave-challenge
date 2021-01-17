package routes

import (
	"errors"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/jwtauth"
	"github.com/oluwafenyi/jumga/server/globals"
	"golang.org/x/net/context"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/oluwafenyi/jumga/server/db"
	"github.com/oluwafenyi/jumga/server/flutterwave"
)

func createMerchantUser(m MerchantValidator) (*db.User, error) {
	exists := db.User{}
	_ = exists.GetByEmail(m.BusinessEmail)

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
		Address:     m.Address,
		Store: &db.Store{
			Rating:         0.,
			BusinessMobile: m.BusinessMobile,
			BusinessName:   m.BusinessName,
			BusinessEmail:  m.BusinessEmail,
			Approved:       false,
			AccountBank:    m.AccountBank,
			AccountNumber:  m.AccountNumber,
			Country:        m.Country,
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
	input := MerchantValidator{}
	err := decodeInput(&input, r)

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

func getMerchantDashboard(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	merchant, ok := ctx.Value("merchant").(*db.User)

	if !ok {
		ErrorResponse(http.StatusUnprocessableEntity, "cannot process request", w)
		return
	}

	dashboard := db.GetMerchantDashboard(merchant)
	log.Println(dashboard)
	SuccessResponse(http.StatusOK, map[string]interface{}{"data": dashboard}, w)
}

func processApproval(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	merchant, ok := ctx.Value("merchant").(*db.User)

	if !ok {
		ErrorResponse(http.StatusUnprocessableEntity, "cannot process request", w)
		return
	}

	store := merchant.Store

	if store.Approved {
		ErrorResponse(http.StatusBadRequest, "store is already approved", w)
		return
	}

	transaction := db.Transaction{
		Status:        "processing",
		CustomerID:    merchant.UUID,
		Type:          "approval",
		Currency:      "USD",
		Amount:        "20",
		DateInitiated: time.Now(),
	}

	_ = transaction.Insert()

	form := &flutterwave.PaymentInitiationForm{
		Reference:      transaction.ID,
		Amount:         "20",
		Currency:       "USD",
		RedirectUrl:    globals.MerchantUrl + "/",
		PaymentOptions: "card,account,banktransfer,ussd",
		Meta: map[string]string{
			"customer_id": merchant.UUID,
			"store_id":    strconv.FormatInt(merchant.StoreID, 10),
		},
		Customer: flutterwave.Customer{
			Name:        store.BusinessName,
			Email:       store.BusinessEmail,
			PhoneNumber: store.BusinessMobile,
		},
		Customizations: flutterwave.Customizations{
			Title:       "Jumga Approval Payment",
			Description: "This payment finalises the merchant registration process for Jumga",
			Logo:        "",
		},
	}

	link, err := flutterwave.InitiatePayment(form)
	if err != nil {
		ErrorResponse(400, "an error occurred while setting up the transaction", w)
		transaction.Status = "failed"
		_ = transaction.Update()
		return
	}
	SuccessResponse(http.StatusCreated, map[string]interface{}{"payment_link": link}, w)
}

func getDispatchRider(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	merchant, ok := ctx.Value("merchant").(*db.User)
	if !ok {
		ErrorResponse(http.StatusUnprocessableEntity, "cannot process request", w)
		return
	}
	rider := merchant.Store.DispatchRider
	SuccessResponse(http.StatusOK, map[string]interface{}{"data": rider}, w)
}

func updateDispatchRider(w http.ResponseWriter, r *http.Request) {
	input := db.DispatchRider{}
	err := decodeInput(&input, r)

	if err != nil {
		ErrorResponse(http.StatusUnprocessableEntity, "invalid post data", w)
		return
	}
	if ok, errs := validateInput(input); !ok {
		ValidationErrorResponse(errs, w)
		return
	}
	ctx := r.Context()
	merchant, ok := ctx.Value("merchant").(*db.User)
	if !ok {
		ErrorResponse(http.StatusUnprocessableEntity, "cannot process request", w)
		return
	}
	store := merchant.Store
	if !store.Approved {
		ErrorResponse(http.StatusBadRequest, "store has not been approved yet", w)
		return
	}

	_ = input.Insert()
	store.DispatchRiderID = input.ID
	_ = store.Update()

	var subAcc map[string]interface{}
	subAcc, err = flutterwave.CreateSubAccount(&flutterwave.SubAccount{
		AccountBank:           input.AccountBank,
		AccountNumber:         input.AccountNumber,
		BusinessName:          fmt.Sprintf("%s - %s (Dispatch Rider)", store.BusinessName, input.Name),
		Country:               input.Country,
		SplitValue:            0.25,
		BusinessMobile:        input.Mobile,
		BusinessEmail:         input.Email,
		BusinessContact:       input.Name,
		BusinessContactMobile: input.Mobile,
		SplitType:             "percentage",
		Meta: map[string]interface{}{
			"dispatchrider_id": input.ID,
		},
	})
	data := subAcc["data"].(map[string]interface{})
	subAccId := data["subaccount_id"].(string)
	flwStoreId := data["id"].(float64)
	input.SubAccountID = subAccId
	input.FlutterwaveAccountID = int32(flwStoreId)
	_ = input.Update()

	SuccessResponse(http.StatusOK, map[string]interface{}{"data": input}, w)
}

func deleteDispatchRider(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	merchant, ok := ctx.Value("merchant").(*db.User)
	if !ok {
		ErrorResponse(http.StatusUnprocessableEntity, "cannot process request", w)
		return
	}
	store := merchant.Store
	if !store.Approved {
		ErrorResponse(http.StatusBadRequest, "store has not been approved yet", w)
		return
	}

	rider := store.DispatchRider
	if rider == nil {
		ErrorResponse(http.StatusBadRequest, "rider does not exist for this store", w)
		return
	}

	ok = flutterwave.DeleteSubAccount(rider.FlutterwaveAccountID)
	if !ok {
		ErrorResponse(http.StatusInternalServerError, "an error occurred while trying to delete the dispatch rider account", w)
		return
	}
	_ = rider.Delete()

	SuccessResponse(http.StatusNoContent, map[string]interface{}{"message": "rider deleted"}, w)
}

func updateMerchantLogo(w http.ResponseWriter, r *http.Request) {
	var input db.Image
	err := decodeInput(&input, r)

	if err != nil {
		ErrorResponse(http.StatusUnprocessableEntity, "invalid post data", w)
		return
	}
	if ok, errs := validateInput(input); !ok {
		ValidationErrorResponse(errs, w)
		return
	}

	ctx := r.Context()
	merchant, ok := ctx.Value("merchant").(*db.User)
	if !ok {
		ErrorResponse(http.StatusUnprocessableEntity, "cannot process request", w)
		return
	}
	store := merchant.Store
	if store.Logo == nil {
		_ = input.Insert()
		store.LogoID = input.ID
		_ = store.Update()
	} else {
		store.Logo.Link = input.Link
		_ = store.Logo.Update()
	}
	SuccessResponse(http.StatusOK, map[string]interface{}{"message": "logo updated"}, w)
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

			r.Get("/dashboard", getMerchantDashboard)
			r.Post("/process-approval", processApproval)
			r.Get("/dispatch", getDispatchRider)
			r.Put("/dispatch", updateDispatchRider)
			r.Delete("/dispatch", deleteDispatchRider)
			r.Put("/logo", updateMerchantLogo)
		})
	})
	return r
}

func MerchantCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, claims, _ := jwtauth.FromContext(r.Context())
		user := &db.User{}
		_ = user.GetFromClaims(claims)
		if user.AccountType != "merchant" {
			ErrorResponse(http.StatusForbidden, "user not permitted to view this resource", w)
			return
		}
		ctx := context.WithValue(r.Context(), "merchant", user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
