package routes

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/jwtauth"
	"github.com/go-playground/validator/v10"

	"github.com/oluwafenyi/jumga/server/flutterwave"
)

var Router *chi.Mux
var validate *validator.Validate
var tokenAuth *jwtauth.JWTAuth

func init() {
	Router = chi.NewRouter()
	Router.Use(middleware.RequestID)
	Router.Use(middleware.RealIP)
	Router.Use(middleware.Logger)
	Router.Use(middleware.Recoverer)
	Router.Use(middleware.AllowContentType("application/json"))
	Router.Use(HeadersMiddleware)

	validate = validator.New()
	_ = validate.RegisterValidation("login-email", ValidateLoginEmail)
	validate.RegisterStructValidation(MerchantValidatorStructLevelValidation, MerchantValidator{})

	tokenAuth = jwtauth.New("HS256", []byte("secret"), nil)
}

func handleWebHook(w http.ResponseWriter, r *http.Request) {

}

func GeneralRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.GetHead)

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		SuccessResponse(http.StatusOK, map[string]interface{}{"message": "OK!"}, w)
	})

	r.Post("/transaction-webhook", handleWebHook)

	r.Get("/banks/{countryCode}/", func(w http.ResponseWriter, r *http.Request) {
		countryCode := chi.URLParam(r, "countryCode")
		resp, err := flutterwave.Request("GET", "banks/"+countryCode, nil)
		if err != nil {
			ErrorResponse(http.StatusNotFound, "could not retrieve bank info for that country code", w)
			return
		}
		defer resp.Body.Close()

		bankResponse := make(map[string]interface{})
		err = json.NewDecoder(resp.Body).Decode(&bankResponse)
		if err != nil {
			ErrorResponse(http.StatusInternalServerError, "an error occurred", w)
			return
		}

		delete(bankResponse, "message")

		SuccessResponse(http.StatusOK, bankResponse, w)
	})
	return r
}
