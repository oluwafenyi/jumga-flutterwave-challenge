package routes

import "github.com/oluwafenyi/jumga/server/db"

type ValidateTransactionValidator struct {
	TxRef         string `json:"tx_ref" validate:"required"`
	TransactionId string `json:"transaction_id" validate:"required"`
}

type MerchantValidator struct {
	db.Store
	BusinessContact       string `json:"business_contact" validate:"required,max=255"`
	BusinessContactMobile string `json:"business_contact_mobile" validate:"required,max=32"`
	Password              string `json:"password" validate:"required,min=6"`
	ConfirmPassword       string `json:"confirm_password" validate:"required,eqfield=Password"`
}

type ProductValidator struct {
	Category string `json:"category" validate:"required,oneof=electronics fashion foodstuff cosmetics fitfam"`
	db.Product
}
