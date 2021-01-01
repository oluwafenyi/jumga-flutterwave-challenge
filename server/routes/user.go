package routes

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/oluwafenyi/jumga/server/db"
)

func getUserByEmail(email string) *db.User {
	user := new(db.User)
	_ = db.DB.Model(user).Where("email = ?", email).Select()
	return user
}

func getUserFromClaims(claims map[string]interface{}) *db.User {
	user := new(db.User)
	uid := claims["uid"].(string)
	_ = db.DB.Model(user).Where("id = ?", uid).Select()
	return user
}

// UserRoutes ...
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

		//r.Post("/", func(w http.ResponseWriter, r *http.Request) {
		//	user := db.User{Username: "oluwafenyi", Email: "o.enyioma@gmail.com"}
		//	err := user.Insert()
		//	if err != nil {
		//		log.Panicln(err)
		//	}
		//})
	})
	return r
}
