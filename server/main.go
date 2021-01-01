package main

import (
	"log"
	"net/http"
	"os"

	"github.com/oluwafenyi/jumga/server/db"
	"github.com/oluwafenyi/jumga/server/routes"
)

func init() {
	log.SetOutput(os.Stdout)
}

func main() {
	routes.Router.Mount("/", routes.GeneralRoutes())
	routes.Router.Mount("/auth", routes.AuthRoutes())
	routes.Router.Mount("/v1/user", routes.UserRoutes())
	routes.Router.Mount("/v1/merchant", routes.MerchantRoutes())

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	port = ":" + port
	log.Printf("server listening on port %s\n", port)
	err := http.ListenAndServe(port, routes.Router)
	if err != nil {
		db.DB.Close()
		log.Fatalln(err)
	}
}
