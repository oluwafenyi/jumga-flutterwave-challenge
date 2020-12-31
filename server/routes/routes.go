package routes

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-playground/validator/v10"
)

var Router *chi.Mux
var validate *validator.Validate

func init() {
	Router = chi.NewRouter()
	Router.Use(middleware.RequestID)
	Router.Use(middleware.RealIP)
	Router.Use(middleware.Logger)
	Router.Use(middleware.Recoverer)
	Router.Use(middleware.AllowContentType("application/json"))
	Router.Use(HeadersMiddleware)

	validate = validator.New()
}

func flutterRequest(method string, path string, body io.Reader) (*http.Response, error) {
	client := &http.Client{}
	req, err := http.NewRequest(method, "https://api.flutterwave.com/v3/"+path, body)
	if err != nil {
		return nil, err
	}
	req.Header.Add("Authorization", "Bearer FLWSECK_TEST-2b200882a3871d5d4cb57e349ed5fe03-X")
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	fError := errors.New("flutterRequestError: resource does not exist")
	if resp.StatusCode != 200 {
		return nil, fError
	}
	return resp, nil
}

func GeneralRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.GetHead)

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		SuccessResponse(http.StatusOK, map[string]interface{}{"message": "OK!"}, w)
	})

	r.Get("/banks/{countryCode}/", func(w http.ResponseWriter, r *http.Request) {
		countryCode := chi.URLParam(r, "countryCode")
		resp, err := flutterRequest("GET", "banks/"+countryCode, nil)
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
