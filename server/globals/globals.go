package globals

import (
	"github.com/go-pg/pg/v10"
	"log"
	"os"
)

var FrontendUrl string
var ClientUrl string
var MerchantUrl string
var Port string
var DBOpts *pg.Options

func init() {
	switch os.Getenv("ENV") {
	case "staging":
		FrontendUrl = "http://localhost:3000"
		ClientUrl = "https://jumga-client.netlify.app"
		MerchantUrl = "https://jumga-merchant.netlify.app"

		Port = os.Getenv("PORT")
		if Port == "" {
			log.Fatalln("error: $PORT not set for staging environment")
		}
		Port = ":" + Port

		dbUrl := os.Getenv("DATABASE_URL")
		if dbUrl == "" {
			log.Fatalln("error: $DATABASE_URL not set for staging environment")
		}

		var err error = nil
		DBOpts, err = pg.ParseURL(dbUrl)
		if err != nil {
			log.Fatalf("error: could not parse database url '%s'\n", dbUrl)
		}

	default:
		FrontendUrl = "http://localhost:3000"
		ClientUrl = "http://localhost:3000"
		MerchantUrl = "http://localhost:8080"
		Port = ":8000"
		DBOpts = &pg.Options{
			User:     "postgres",
			Password: "password",
			Database: "postgres",
			Addr:     "db:5432",
		}
	}
}
