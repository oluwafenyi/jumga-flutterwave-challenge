package routes

import (
	"github.com/go-playground/validator/v10"
	"github.com/oluwafenyi/jumga/server/db"
	"github.com/oluwafenyi/jumga/server/flutterwave"
	"log"
	"reflect"
	"strings"
)

type ValidateTransactionValidator struct {
	TxRef         string `json:"tx_ref" validate:"required"`
	TransactionId string `json:"transaction_id" validate:"required"`
}

type MerchantValidator struct {
	db.Store
	Address               string `json:"address" validate:"required"`
	BusinessContact       string `json:"business_contact" validate:"required,max=255"`
	BusinessContactMobile string `json:"business_contact_mobile" validate:"required,max=32"`
	Password              string `json:"password" validate:"required,min=6"`
	ConfirmPassword       string `json:"confirm_password" validate:"required,eqfield=Password"`
}

func (m MerchantValidator) GetAccountBank() string {
	return m.AccountBank
}

func (m MerchantValidator) GetAccountNumber() string {
	return m.AccountNumber
}

type UserValidator struct {
	db.User
	Password        string `json:"password" validate:"required,min=6"`
	ConfirmPassword string `json:"confirm_password" validate:"required,eqfield=Password"`
}

type ProductValidator struct {
	Category string `json:"category" validate:"required,oneof=electronics fashion foodstuff cosmetics fitfam"`
	db.Product
}

type OrderValidator struct {
	Product int64 `json:"product" validate:"required"`
}

type BankDetailsGetter interface {
	GetAccountBank() string
	GetAccountNumber() string
}

func BankDetailsStructLevelValidation(sl validator.StructLevel) {
	v := sl.Current().Interface().(BankDetailsGetter)
	bank := v.GetAccountBank()
	number := v.GetAccountNumber()
	resp, err := flutterwave.ValidateBankAccountDetails(bank, number)

	if err != nil {
		sl.ReportError(bank, "account_bank", "AccountBank", "account_details", "")
		sl.ReportError(number, "account_number", "AccountNumber", "account_details", "")
		return
	}

	if resp.StatusCode != 200 {
		sl.ReportError(bank, "account_bank", "AccountBank", "account_details", "")
		sl.ReportError(number, "account_number", "AccountNumber", "account_details", "")
	}

}

func ValidateLoginEmail(fl validator.FieldLevel) bool {
	email := fl.Field().String()
	user := &db.User{}
	err := user.GetByEmail(email)
	if err != nil {
		return false
	}
	if user.UUID == "" {
		return false
	}
	return true
}

func ValidateProductExists(fl validator.FieldLevel) bool {
	productID := fl.Field().Int()
	product := &db.Product{}
	err := product.GetByID(productID)
	if err != nil {
		return false
	}
	if product.ID == 0 {
		return false
	}
	return true
}

func validateInput(data interface{}) (bool, map[string][]string) {
	err := validate.Struct(data)

	if err != nil {
		if err, ok := err.(*validator.InvalidValidationError); ok {
			log.Panicln(err)
		}

		errors := make(map[string][]string)

		reflected := reflect.ValueOf(data)
		for _, err := range err.(validator.ValidationErrors) {
			field, _ := reflected.Type().FieldByName(err.StructField())
			var name string

			if name = field.Tag.Get("json"); name == "" {
				name = strings.ToLower(err.StructField())
			}

			switch err.Tag() {
			case "required":
				errors[name] = append(errors[name], name+" is required")
				break
			case "email":
				errors[name] = append(errors[name], name+" should be a valid email")
				break
			case "eqfield":
				errors[name] = append(errors[name], name+" should be equal to the "+err.Param())
				break
			case "account_details":
				errors["account_details"] = append(errors[name], "account does not exist")
			case "login-email":
				errors["email"] = append(errors[name], "user with email does not exist")
				break
			case "product-exists":
				errors["product"] = append(errors[name], "product with this id does not exist")
				break
			default:
				errors[name] = append(errors[name], name+" is invalid")
				break
			}
		}
		return false, errors
	}
	return true, nil
}
