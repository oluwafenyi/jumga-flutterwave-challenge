package routes

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/oluwafenyi/jumga/server/db"
)

func createUser(u UserValidator) (*db.User, error) {
	exists := db.User{}
	_ = exists.GetByEmail(u.Email)

	if exists.UUID != "" {
		err := errors.New("user with that email already exists")
		return nil, err
	}

	user := &db.User{
		Email:       u.Email,
		AccountType: "user",
		Name:        u.Name,
		Country:     u.Country,
		Mobile:      u.Mobile,
		Address:     u.Address,
	}

	user.SetPassword(u.Password)

	err := user.Insert()
	if err != nil {
		return nil, err
	}
	return user, nil
}

func signUpUser(w http.ResponseWriter, r *http.Request) {
	input := UserValidator{}
	err := decodeInput(&input, r)

	if err != nil {
		ErrorResponse(http.StatusUnprocessableEntity, "invalid post data", w)
		return
	}
	if ok, errs := validateInput(input); !ok {
		ValidationErrorResponse(errs, w)
		return
	}
	user, err := createUser(input)
	if err != nil {
		ErrorResponse(http.StatusBadRequest, err.Error(), w)
		return
	}
	data := map[string]interface{}{
		"data": user,
	}
	SuccessResponse(http.StatusCreated, data, w)
}

func UserRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.GetHead)

	r.Route("/", func(r chi.Router) {
		r.Get("/", func(w http.ResponseWriter, r *http.Request) {
			var users []db.User
			err := db.DB.Model(&users).Select()
			if err != nil {
				log.Panicln(err)
			}
			if users != nil {
				json.NewEncoder(w).Encode(users)
			} else {
				json.NewEncoder(w).Encode(make([]interface{}, 0))
			}
		})

		r.Post("/", signUpUser)
	})
	return r
}
