package db

import (
	"github.com/go-pg/migrations/v8"
	"github.com/go-pg/pg/v10"
	"github.com/oluwafenyi/jumga/server/globals"
	"log"
)

var DB *pg.DB

func init() {
	DB = pg.Connect(globals.DBOpts)

	collection := migrations.NewCollection()
	_, _, _ = collection.Run(DB, "init")
	collection.DisableSQLAutodiscover(true)
	err := collection.DiscoverSQLMigrations("/usr/app/db/migrations")
	if err != nil {
		log.Println(err)
	}
	oldVersion, newVersion, err := collection.Run(DB, "up")
	if err != nil {
		log.Fatalf("db: migration error - %s\n", err)
	}
	if newVersion != oldVersion {
		log.Printf("db: migrated from version %d to %d\n", oldVersion, newVersion)
	} else {
		log.Printf("db: version is %d\n", oldVersion)
	}
}
