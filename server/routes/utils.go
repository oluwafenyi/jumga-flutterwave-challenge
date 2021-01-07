package routes

import (
	"encoding/json"
	"github.com/oluwafenyi/jumga/server/db"
	"log"
	"net/http"
)

type ProductContext struct {
	product  *db.Product
	merchant *db.User
}

func HeadersMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}

func decodeInput(input interface{}, r *http.Request) error {
	err := json.NewDecoder(r.Body).Decode(input)
	return err
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
