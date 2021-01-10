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
	AccountBank           string `json:"account_bank" validate:"required,max=3"`
	AccountNumber         string `json:"account_number" validate:"required,max=32"`
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

func (m MerchantValidator) BankDetailsExist() bool {
	store := new(db.Store)
	_ = db.DB.Model(store).Where(`account_bank = ? and account_number = ?`, m.GetAccountBank(), m.GetAccountNumber()).Select()
	if store.ID != 0 {
		return true
	}
	return false
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
	BankDetailsExist() bool
}

func BankDetailsStructLevelValidation(sl validator.StructLevel) {
	v := sl.Current().Interface().(BankDetailsGetter)
	bank := v.GetAccountBank()
	number := v.GetAccountNumber()

	if v.BankDetailsExist() {
		sl.ReportError(bank, "account_bank", "AccountBank", "account_details", "user with these account details already exists")
		sl.ReportError(number, "account_number", "AccountNumber", "account_details", "user with these account details already exists")
		return
	}

	resp, err := flutterwave.ValidateBankAccountDetails(bank, number)

	if err != nil || resp.StatusCode != 200 {
		sl.ReportError(bank, "account_bank", "AccountBank", "account_details", "account with these details does not exist")
		sl.ReportError(number, "account_number", "AccountNumber", "account_details", "account with these details does not exist")
		return
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
				errors["account_details"] = append(errors[name], err.Param())
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
