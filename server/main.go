package main

import (
	"github.com/oluwafenyi/jumga/server/globals"
	"log"
	"net/http"
	"os"

	"github.com/oluwafenyi/jumga/server/db"
	_ "github.com/oluwafenyi/jumga/server/db/migrations"
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
	routes.Router.Mount("/v1/transaction", routes.TransactionRoutes())
	routes.Router.Mount("/v1/product", routes.ProductRoutes())

	log.Printf("server listening on port %s\n", globals.Port)
	err := http.ListenAndServe(globals.Port, routes.Router)
	if err != nil {
		db.DB.Close()
		log.Fatalln(err)
	}
}
