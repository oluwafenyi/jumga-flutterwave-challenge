package db

import (
	"encoding/json"
	"github.com/go-pg/pg/v10"
	"github.com/oluwafenyi/jumga/server/globals"
	"log"
	"os"
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
		(*Image)(nil),
		(*ProductCategory)(nil),
		(*Product)(nil),
		(*Order)(nil),
	}
	for _, model := range models {
		err := DB.Model(model).CreateTable(globals.CreateTableOpts)
		if err != nil {
			log.Printf("error: %s\n", err)
			return err
		}
		_, ok := model.(*ProductCategory)
		if ok {
			var categories []ProductCategory
			err := os.Chdir("/usr/app/data")
			f, err := os.Open("categories.json")
			if err != nil {
				log.Fatalln("error:", err)
			}
			err = json.NewDecoder(f).Decode(&categories)

			for _, category := range categories {
				_ = category.Insert()
			}

			_ = f.Close()
			_ = os.Chdir("/usr/app")
		}
	}
	return nil
}
