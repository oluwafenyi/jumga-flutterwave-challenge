package routes

import (
	"encoding/json"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/oluwafenyi/jumga/server/db"
	"github.com/oluwafenyi/jumga/server/flutterwave"
	"log"
	"net/http"
	"strconv"
)

type ValidateTransactionValidator struct {
	TxRef         string `json:"tx_ref" validate:"required"`
	TransactionId string `json:"transaction_id" validate:"required"`
}

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
		SplitValue:            0.975,
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

func postSuccessfulTransactionAction(t *db.Transaction, storeId int64) {
	switch t.Type {
	case "approval":
		postApprovalTransaction(storeId)
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
	customerId := meta["customer_id"].(string)

	customer := db.User{}
	_ = customer.GetByID(customerId)

	storeId := customer.Store.ID

	if txRef != transaction.ID {
		ErrorResponse(http.StatusBadRequest, "unable to verify transaction", w)
		return
	}

	if status != "successful" {
		transaction.Status = "failed"
		_ = transaction.Update()
		ErrorResponse(http.StatusBadRequest, "transaction unsuccessful", w)
		return
	}

	if currency != transaction.Currency {
		ErrorResponse(http.StatusBadRequest, "unable to verify transaction", w)
		return
	}

	amount, _ := strconv.ParseFloat(transaction.Amount, 64)

	if chargedAmount < amount {
		ErrorResponse(http.StatusBadRequest, "unable to verify transaction", w)
		return
	}

	transaction.Status = "success"
	_ = transaction.Update()
	postSuccessfulTransactionAction(transaction, storeId)
	SuccessResponse(http.StatusOK, map[string]interface{}{"message": "successful transaction"}, w)
}

func TransactionRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.GetHead)

	r.Post("/verify", validateTransaction)
	return r
}
