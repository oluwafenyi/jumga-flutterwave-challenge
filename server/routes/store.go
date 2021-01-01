package routes

import "github.com/oluwafenyi/jumga/server/db"

func getStore(id int64) (*db.Store, error) {
	store := new(db.Store)
	err := db.DB.Model(store).Where("id = ?", id).Select()
	if err != nil {
		return nil, err
	}
	return store, nil
}
