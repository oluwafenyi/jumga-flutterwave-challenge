package routes

import (
	"encoding/json"
	"github.com/go-playground/validator/v10"
	"github.com/oluwafenyi/jumga/server/db"
	"github.com/oluwafenyi/jumga/server/flutterwave"
	"log"
	"net/http"
	"reflect"
	"strings"
)

func MerchantValidatorStructLevelValidation(sl validator.StructLevel) {
	merchantValidator := sl.Current().Interface().(MerchantValidator)
	resp, err := flutterwave.ValidateBankAccountDetails(merchantValidator.AccountBank, merchantValidator.AccountNumber)

	if err != nil {
		sl.ReportError(merchantValidator.AccountBank, "account_bank", "AccountBank", "account_details", "")
		sl.ReportError(merchantValidator.AccountNumber, "account_number", "AccountNumber", "account_details", "")
		return
	}

	if resp.StatusCode != 200 {
		sl.ReportError(merchantValidator.AccountBank, "account_bank", "AccountBank", "account_details", "")
		sl.ReportError(merchantValidator.AccountNumber, "account_number", "AccountNumber", "account_details", "")
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
			default:
				errors[name] = append(errors[name], name+" is invalid")
				break
			}
		}
		return false, errors
	}
	return true, nil
}

func HeadersMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}

func SuccessResponse(code int, fields map[string]interface{}, w http.ResponseWriter) {
	fields["status"] = "success"
	w.WriteHeader(code)
	err := json.NewEncoder(w).Encode(fields)
	if err != nil {
		log.Println("error:", err)
		ErrorResponse(http.StatusInternalServerError, "an error has occurred", w)
	}
}

func ErrorResponse(code int, message string, w http.ResponseWriter) {
	fields := make(map[string]interface{})
	fields["status"] = "error"
	fields["message"] = message
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(fields)
}

func ValidationErrorResponse(fields map[string][]string, w http.ResponseWriter) {
	responseData := make(map[string]interface{})
	responseData["status"] = "error"
	responseData["message"] = "validation error"
	responseData["errors"] = fields
	w.WriteHeader(http.StatusBadRequest)
	err := json.NewEncoder(w).Encode(responseData)
	if err != nil {
		ErrorResponse(http.StatusInternalServerError, "an error occurred", w)
	}
}
