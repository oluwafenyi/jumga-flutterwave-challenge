package globals

import (
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
	"log"
	"os"
)

var FrontendUrl string
var Port string
var DBOpts *pg.Options
var CreateTableOpts *orm.CreateTableOptions

func init() {
	switch os.Getenv("ENV") {
	case "staging":
		FrontendUrl = "http://localhost:3000"

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

		CreateTableOpts = &orm.CreateTableOptions{
			Temp:        false,
			IfNotExists: true,
		}
	default:
		FrontendUrl = "http://localhost:3000"
		Port = ":8000"
		DBOpts = &pg.Options{
			User:     "postgres",
			Password: "password",
			Database: "postgres",
			Addr:     "db:5432",
		}
		CreateTableOpts = &orm.CreateTableOptions{
			Temp: true,
		}
	}
}
