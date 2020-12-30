package db

import (
	"fmt"
)

// User ...
type User struct {
	tableName struct{} `pg:"users"`
	UUID      string   `pg:"id,pk,default:gen_random_uuid()"`
	Username  string   `pg:"username"`
	Email     string   `pg:"email"`
	// Password bycrypt hash
	// Admin
}

func (u User) String() string {
	return fmt.Sprintf("<User %s>", u.UUID)
}

// Insert ...
func (u *User) Insert() error {
	_, err := DB.Model(u).Insert()
	return err
}

// Publication ...
type Publication struct {
	ID      int64
	Title   string
	Content string
	Views   int64
	Writer  User
	// Pub Date
	// Main Image
}

func (p Publication) String() string {
	return fmt.Sprintf("<Publication %d>", p.ID)
}

// Images
