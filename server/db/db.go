package db

import (
	"github.com/go-pg/pg/v10"
	"github.com/oluwafenyi/jumga/server/globals"
	"log"
)

var DB *pg.DB

func init() {
	DB = pg.Connect(globals.DBOpts)

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
		(*DispatchRider)(nil),
	}
	for _, model := range models {
		err := DB.Model(model).CreateTable(globals.CreateTableOpts)
		if err != nil {
			log.Printf("error: %s\n", err)
			return err
		}
	}
	return nil
}
