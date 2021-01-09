package db

import (
	"github.com/go-pg/pg/v10"
	"github.com/oluwafenyi/jumga/server/globals"
)

var DB *pg.DB

func init() {
	DB = pg.Connect(globals.DBOpts)
}
