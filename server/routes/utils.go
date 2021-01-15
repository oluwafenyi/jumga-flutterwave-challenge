package routes

import (
	"encoding/json"
	"github.com/oluwafenyi/jumga/server/db"
	"golang.org/x/net/context"
	"log"
	"net/http"
	"strconv"
)

type ProductContext struct {
	product  *db.Product
	merchant *db.User
}

type paginationParams struct {
	startAt int
	limit   int
}

type StoreOut struct {
	ID              int64     `json:"id"`
	Rating          float32   `json:"rating"`
	BusinessName    string    `json:"business_name" validate:"required,max=255"`
	BusinessMobile  string    `json:"business_mobile" validate:"required,max=32"`
	BusinessEmail   string    `json:"business_email" validate:"required,email"`
	Country         string    `json:"country" validate:"required,max=2"`
	Logo            *db.Image `json:"logo"`
	BusinessContact string    `json:"business_contact"`
	Categories      []string  `json:"categories"`
}

func serializeStore(merchant db.User, categories []string) StoreOut {
	if len(categories) == 0 {
		categories = make([]string, 0)
	}
	return StoreOut{
		ID:              merchant.StoreID,
		Rating:          merchant.Store.Rating,
		BusinessName:    merchant.Store.BusinessName,
		BusinessMobile:  merchant.Store.BusinessMobile,
		BusinessEmail:   merchant.Store.BusinessEmail,
		Country:         merchant.Store.Country,
		Logo:            merchant.Store.Logo,
		BusinessContact: merchant.Name,
		Categories:      categories,
	}
}

func serializeStores(merchants []db.User) []StoreOut {
	var stores []StoreOut
	for _, merchant := range merchants {
		categories := db.GetDistinctStoreProductCategories(merchant.StoreID)
		stores = append(stores, serializeStore(merchant, categories))
	}
	if len(stores) == 0 {
		return make([]StoreOut, 0)
	}
	return stores
}

func paginate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		params := r.URL.Query()
		startAt, ok := params["startAt"]

		if !ok || len(startAt) < 1 {
			startAt = []string{"0"}
		}

		limit, ok := params["limit"]

		if !ok || len(startAt) < 1 {
			limit = []string{"50"}
		}

		iStartAt, err := strconv.Atoi(startAt[0])
		if err != nil {
			iStartAt = 0
		}

		iLimit, err := strconv.Atoi(limit[0])
		if err != nil {
			iLimit = 50
		}
		if iLimit > 50 {
			iLimit = 50
		}

		pParams := paginationParams{
			startAt: iStartAt,
			limit:   iLimit,
		}

		ctx := context.WithValue(r.Context(), "pagination", pParams)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
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
