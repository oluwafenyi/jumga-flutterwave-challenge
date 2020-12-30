package db

import (
	"log"

	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
)

// DB ...
var DB *pg.DB

func init() {
	DB = pg.Connect(&pg.Options{
		User:     "postgres",
		Password: "password",
		Database: "postgres",
		Addr:     "db:5432",
	})
	err := createTables()
	if err != nil {
		DB.Close()
		log.Fatalln(err)
	}
}

func createTables() error {
	models := []interface{}{
		(*User)(nil),
		(*Publication)(nil),
	}
	for _, model := range models {
		err := DB.Model(model).CreateTable(&orm.CreateTableOptions{
			Temp: true,
		})
		if err != nil {
			return err
		}
	}
	return nil
}
