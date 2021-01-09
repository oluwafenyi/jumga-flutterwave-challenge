package migrations

import (
	"encoding/json"
	"github.com/go-pg/migrations/v8"
	DB "github.com/oluwafenyi/jumga/server/db"
	"log"
	"os"
)

func getCategoriesFromDataFile() ([]DB.ProductCategory, error) {
	var categories []DB.ProductCategory
	err := os.Chdir("/usr/app/data")
	f, err := os.Open("categories.json")
	if err != nil {
		return nil, err
	}
	err = json.NewDecoder(f).Decode(&categories)
	if err != nil {
		return nil, err
	}
	_ = f.Close()
	_ = os.Chdir("/usr/app")
	return categories, nil
}

func init() {
	categories, err := getCategoriesFromDataFile()
	if err != nil {
		log.Println(err)
		return
	}
	migrations.MustRegisterTx(func(db migrations.DB) error {
		for _, category := range categories {
			_, _ = db.Model(category).Insert()
		}
		return nil
	}, func(db migrations.DB) error {
		for _, category := range categories {
			_, _ = db.Model(category).Delete()
		}
		return nil
	})
}
