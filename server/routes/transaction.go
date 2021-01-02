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

func postSuccessfulTransactionAction(t *db.Transaction, storeId int64) {
	switch t.Type {
	case "approval":
		store := &db.Store{}
		_ = store.GetByID(storeId)
		store.Approved = true
		err := store.Update()
		if err != nil {
			log.Printf("error: failed to update store %d to approved status", store.ID)
		}

		// todo: create subAccount

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
		ErrorResponse(http.StatusBadRequest, "unable to verify transaction", w)
		return
	}

	data := statusResponse["data"].(map[string]interface{})
	status := data["status"].(string)
	txRef := data["tx_ref"].(string)
	currency := data["currency"].(string)
	chargedAmount := data["charged_amount"].(float64)
	meta := data["meta"].(map[string]interface{})
	storeIdStr := meta["customer_id"].(string)
	storeId, _ := strconv.ParseInt(storeIdStr, 10, 64)

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
