package migrations

import (
	"github.com/go-pg/migrations/v8"
	"github.com/oluwafenyi/jumga/server/db"
	"log"
)

var collection = migrations.NewCollection()

func init() {
	_, _, _ = collection.Run(db.DB, "init")

	oldVersion, newVersion, err := collection.Run(db.DB, "up")

	if err != nil {
		log.Fatalf("db: migration error - %s\n", err)
	}
	if newVersion != oldVersion {
		log.Printf("db: migrated from version %d to %d\n", oldVersion, newVersion)
	} else {
		log.Printf("db: version is %d\n", oldVersion)
	}
}
