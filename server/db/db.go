package db

import (
	"log"
	"os"

	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
)

var DB *pg.DB

func init() {
	switch os.Getenv("ENV") {
	case "staging":
		dbUrl := os.Getenv("DATABASE_URL")
		opts, err := pg.ParseURL(dbUrl)
		if err != nil {
			log.Fatalf("error: could not parse database url '%s'", dbUrl)
		}
		DB = pg.Connect(opts)
	default:
		DB = pg.Connect(&pg.Options{
			User:     "postgres",
			Password: "password",
			Database: "postgres",
			Addr:     "db:5432",
		})
		break
	}

	err := createTables()
	if err != nil {
		DB.Close()
		log.Fatalln(err)
	}
}

func createTables() error {
	models := []interface{}{
		(*User)(nil),
		(*Store)(nil),
		(*Transaction)(nil),
	}
	for _, model := range models {
		switch os.Getenv("ENV") {
		case "staging":
			err := DB.Model(model).CreateTable(&orm.CreateTableOptions{
				Temp:        false,
				IfNotExists: true,
			})
			if err != nil {
				return err
			}
			break
		case "default":
			err := DB.Model(model).CreateTable(&orm.CreateTableOptions{
				Temp: true,
			})
			if err != nil {
				return err
			}
			break
		}
	}
	return nil
}
