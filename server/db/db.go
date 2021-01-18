package db

import (
	"github.com/go-pg/pg/v10"
	"github.com/oluwafenyi/jumga/server/globals"
	"golang.org/x/net/context"
	"log"
	"time"
)

var DB *pg.DB

func init() {
	DB = pg.Connect(globals.DBOpts)

	ctx, _ := context.WithTimeout(DB.Context(), time.Duration(30*1000000000))
	err := DB.Ping(ctx)
	if err != nil {
		log.Fatalln("fatal: could not connect to the db within the time limit: ", err)
	}
}
