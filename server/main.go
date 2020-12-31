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
	routes.Router.Mount("/v1/user", routes.UserRoutes())
	routes.Router.Mount("/v1/merchant", routes.MerchantRoutes())

	log.Println("server listening at port 8000")
	err := http.ListenAndServe(":8000", routes.Router)
	if err != nil {
		db.DB.Close()
		log.Fatalln(err)
	}
}