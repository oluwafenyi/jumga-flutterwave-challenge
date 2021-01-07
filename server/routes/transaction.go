package routes

import (
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/jwtauth"
	"github.com/oluwafenyi/jumga/server/db"
	"github.com/oluwafenyi/jumga/server/flutterwave"
	"github.com/oluwafenyi/jumga/server/globals"
	"golang.org/x/net/context"
	"log"
	"net/http"
	"strconv"
	"time"
)

func postApprovalTransaction(storeId int64) {
	store := &db.Store{}
	_ = store.GetByID(storeId)

	if store.Approved {
		log.Printf("<Store %d> approval already processed\n", store.ID)
		return
	}
	store.Approved = true
	err := store.Update()
	if err != nil {
		log.Printf("error: failed to update store %d to approved status", store.ID)
	}

	contact := store.GetContact()

	sub := &flutterwave.SubAccount{
		AccountBank:           store.AccountBank,
		AccountNumber:         store.AccountNumber,
		BusinessName:          store.BusinessName,
		Country:               store.Country,
		SplitValue:            0.025,
		BusinessMobile:        store.BusinessMobile,
		BusinessEmail:         store.BusinessEmail,
		BusinessContact:       contact.Name,
		BusinessContactMobile: contact.Mobile,
		SplitType:             "percentage",
		Meta: map[string]interface{}{
			"store_id": storeId,
		},
	}

	var subAcc map[string]interface{}
	subAcc, _ = flutterwave.CreateSubAccount(sub)
	data := subAcc["data"].(map[string]interface{})
	subAccId := data["subaccount_id"].(string)
	flwStoreId := data["id"].(float64)
	store.SubAccountID = subAccId
	store.FlutterwaveAccountID = int32(flwStoreId)
	_ = store.Update()
}

func postOrderTransaction(t *db.Transaction) {
	t.Order.Status = "awaiting delivery"
	err := t.Order.Update()
	if err != nil {
		log.Printf("failed to updated order %d status to 'awaiting delivery'\n")
	}
}

func postSuccessfulTransactionAction(t *db.Transaction, storeId int64) {
	switch t.Type {
	case "approval":
		postApprovalTransaction(storeId)
		break
	case "order":
		postOrderTransaction(t)
		break
	default:
		break
	}
}

func validateTransaction(w http.ResponseWriter, r *http.Request) {
	var input ValidateTransactionValidator

	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		ErrorResponse(http.StatusUnprocessableEntity, "invalid post data", w)
		return
	}
	if ok, errs := validateInput(input); !ok {
		ValidationErrorResponse(errs, w)
		return
	}

	transaction := &db.Transaction{}
	_ = transaction.GetByID(input.TxRef)
	if transaction.ID == "" {
		ErrorResponse(http.StatusBadRequest, "transaction reference does not exist", w)
		return
	}

	statusResponse, err := flutterwave.GetTransactionStatus(input.TransactionId)

	if err != nil {
		log.Printf("error: %s\n", err)
		ErrorResponse(http.StatusBadRequest, "unable to verify transaction", w)
		return
	}

	data := statusResponse["data"].(map[string]interface{})
	status := data["status"].(string)
	txRef := data["tx_ref"].(string)
	currency := data["currency"].(string)
	chargedAmount := data["charged_amount"].(float64)
	meta := data["meta"].(map[string]interface{})
	storeID := meta["store_id"].(string)

	sID, _ := strconv.ParseInt(storeID, 10, 64)

	if txRef != transaction.ID {
		ErrorResponse(http.StatusBadRequest, "unable to verify transaction", w)
		return
	}

	if status != "successful" {
		transaction.Status = "failed"
		transaction.DateResolved = time.Now()
		if transaction.Order != nil {
			transaction.Order.Status = "payment failed"
			_ = transaction.Order.Update()
		}
		_ = transaction.Update()
		ErrorResponse(http.StatusBadRequest, "transaction unsuccessful", w)
		return
	}

	if currency != transaction.Currency {
		transaction.Status = "failed"
		transaction.DateResolved = time.Now()
		if transaction.Order != nil {
			transaction.Order.Status = "payment failed"
			_ = transaction.Order.Update()
		}
		_ = transaction.Update()
		ErrorResponse(http.StatusBadRequest, "unable to verify transaction", w)
		return
	}

	amount, _ := strconv.ParseFloat(transaction.Amount, 64)

	if chargedAmount < amount {
		transaction.Status = "failed"
		transaction.DateResolved = time.Now()
		if transaction.Order != nil {
			transaction.Order.Status = "payment failed"
			_ = transaction.Order.Update()
		}
		_ = transaction.Update()
		ErrorResponse(http.StatusBadRequest, "unable to verify transaction", w)
		return
	}

	transaction.Status = "success"
	transaction.DateResolved = time.Now()
	_ = transaction.Update()
	postSuccessfulTransactionAction(transaction, sID)
	if transaction.Order != nil {
		SuccessResponse(http.StatusOK, map[string]interface{}{"message": "successful transaction", "orderID": transaction.OrderID}, w)
		return
	}
	SuccessResponse(http.StatusOK, map[string]interface{}{"message": "successful transaction"}, w)
}

func makeOrder(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user, ok := ctx.Value("user").(*db.User)
	if !ok {
		ErrorResponse(http.StatusUnprocessableEntity, "cannot process request", w)
		return
	}
	input := OrderValidator{}
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
	product := db.Product{}
	err = product.GetByID(input.Product)
	if err != nil {
		ErrorResponse(http.StatusBadRequest, "product does not exists", w)
		return
	}
	if product.ID == 0 {
		ErrorResponse(http.StatusBadRequest, "product does not exists", w)
		return
	}

	productPrice := product.Price - (product.Price * float64(product.Discount))
	merchantCut := fmt.Sprintf("%.2f", product.Price*0.975)
	dispatchCut := fmt.Sprintf("%.2f", product.DeliveryFee*0.75)
	totalPrice := productPrice + product.DeliveryFee
	priceStr := fmt.Sprintf("%.2f", totalPrice)

	transaction := db.Transaction{
		Status:        "processing",
		Type:          "order",
		CustomerID:    user.UUID,
		Currency:      "USD",
		Amount:        priceStr,
		StoreID:       product.StoreID,
		DateInitiated: time.Now(),
		Order: &db.Order{
			ProductID:        product.ID,
			Status:           "processing payment",
			DeliveryLocation: user.Address,
			DeliveryMobile:   user.Mobile,
		},
	}

	_ = transaction.Insert()

	dispatchRider, err := db.GetRiderByStoreID(product.StoreID)
	if err != nil {
		log.Println("warn: could not get rider")
		log.Println(dispatchRider)
		log.Fatalln(err)
	}

	form := &flutterwave.PaymentInitiationForm{
		Reference:      transaction.ID,
		Amount:         transaction.Amount,
		Currency:       "USD",
		RedirectUrl:    globals.FrontendUrl + "/payment/redirect/",
		PaymentOptions: "card,account,banktransfer,ussd",
		Meta: map[string]string{
			"customer_id": user.UUID,
			"store_id":    strconv.FormatInt(product.StoreID, 10),
			"product_id":  strconv.FormatInt(product.ID, 10),
		},
		Customer: flutterwave.Customer{
			Name:        user.Name,
			Email:       user.Email,
			PhoneNumber: user.Mobile,
		},
		Customizations: flutterwave.Customizations{
			Title:       "Jumga Product Payment",
			Description: "Payment for " + product.Title,
			Logo:        "",
		},
		SubAccounts: []flutterwave.SubAccountForm{
			{
				ID:                    dispatchRider.SubAccountID,
				TransactionChargeType: "flat_subaccount",
				TransactionCharge:     dispatchCut,
			},
			{
				ID:                    product.Store.SubAccountID,
				TransactionChargeType: "flat_subaccount",
				TransactionCharge:     merchantCut,
			},
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

func TransactionRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.GetHead)

	r.Post("/verify", validateTransaction)
	r.Group(func(r chi.Router) {
		r.Use(jwtauth.Verifier(tokenAuth))
		r.Use(jwtauth.Authenticator)
		r.Use(UserCtx)

		r.Post("/order", makeOrder)
	})
	return r
}

func UserCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, claims, _ := jwtauth.FromContext(r.Context())
		user := &db.User{}
		_ = user.GetFromClaims(claims)
		ctx := context.WithValue(r.Context(), "user", user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
