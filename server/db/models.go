package db

import (
	"fmt"
	"github.com/google/uuid"
	"log"

	"golang.org/x/crypto/bcrypt"
)

type Store struct {
	tableName          struct{} `pg:"stores"`
	ID                 int64    `json:"-"`
	SubAccountId       string   `pg:"sub_account_id" json:"sub_account_id"`
	FlutterwaveStoreId int32    `pg:"flutterwave_store_id" json:"flutterwave_store_id"`
	Rating             float32  `pg:"rating" json:"rating"`
	BusinessName       string   `pg:"business_name" json:"business_name"`
	BusinessMobile     string   `pg:"business_mobile" json:"business_mobile"`
	BusinessEmail      string   `pg:"business_email" json:"business_email"`
	Approved           bool     `pg:"approved" json:"approved"`
	AccountBank        string   `pg:"account_bank" json:"account_bank"`
	AccountNumber      string   `pg:"account_number" json:"account_number"`
	Country            string   `pg:"country" json:"country"`
}

func (s Store) String() string {
	return fmt.Sprintf("<Store %d>", s.ID)
}

func (s *Store) Insert() error {
	_, err := DB.Model(s).Insert()
	if err != nil {
		return err
	}
	return nil
}

func (s *Store) GetByID(id int64) error {
	err := DB.Model(s).Where("id = ?", id).Select()
	return err
}

func (s *Store) GetContact() *User {
	user := &User{}
	_ = DB.Model(user).Where("\"user\".\"store_id\" = ?", s.ID).Select()
	return user
}

func (s *Store) Update() error {
	_, err := DB.Model(s).WherePK().Update()
	return err
}

type User struct {
	tableName   struct{} `pg:"users"`
	UUID        string   `pg:"id,pk" json:"uuid"`
	Email       string   `pg:"email,unique" json:"email" validate:"required,email"`
	AccountType string   `pg:"account_type" json:"account_type" validate:"oneof=merchant user"`
	StoreID     int64    `json:"-"`
	Store       *Store   `pg:"rel:has-one" json:"store"`
	Name        string   `pg:"name" json:"name" validate:"required"`
	Country     string   `pg:"country" json:"country" validate:"required"`
	Mobile      string   `pg:"mobile" json:"mobile"`
	Password    string   `pg:"password" json:"-"`
}

func (u User) String() string {
	return fmt.Sprintf("<User %s>", u.UUID)
}

func (u *User) Insert() error {
	u.UUID = uuid.New().String()
	if u.Store != nil {
		_ = u.Store.Insert()
		u.StoreID = u.Store.ID
		_, err := DB.Model(u).Insert()
		if err != nil {
			return err
		}
		return nil
	} else {
		_, err := DB.Model(u).Insert()
		if err != nil {
			return err
		}
		return nil
	}
}

func (u *User) GetById(uid string) error {
	err := DB.Model(u).Relation("Store").Where("\"user\".\"id\" = ?", uid).Select()
	return err
}

func (u *User) GetByEmail(email string) error {
	err := DB.Model(u).Where("email = ?", email).Select()
	return err
}

func (u *User) GetFromClaims(claims map[string]interface{}) error {
	uid := claims["uid"].(string)
	err := DB.Model(u).Where("id = ?", uid).Select()
	return err
}

func (u *User) SetPassword(pwd string) {
	pwdBytes := []byte(pwd)
	hashed, err := bcrypt.GenerateFromPassword(pwdBytes, bcrypt.DefaultCost)
	if err != nil {
		log.Panicln(err)
	}
	u.Password = string(hashed)
}

func (u *User) CheckPassword(pwd string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(pwd))
	return err == nil
}

type Transaction struct {
	tableName  struct{} `pg:"transactions"`
	ID         string   `pg:"id,pk"`
	Status     string   `pg:"status"`
	Type       string   `pg:"type"`
	CustomerID string
	Customer   *User  `pg:"rel:has-one"`
	Currency   string `pg:"currency"`
	Amount     string `pg:"amount"`
	StoreID    int64
	Store      *Store `pg:"rel:has-one"`
}

func (t *Transaction) Insert() error {
	t.ID = generateTransactionId()
	_, err := DB.Model(t).Insert()
	if err != nil {
		return err
	}
	return nil
}

func (t *Transaction) GetByID(id string) error {
	err := DB.Model(t).Where("id = ?", id).Select()
	return err
}

func (t *Transaction) Update() error {
	_, err := DB.Model(t).WherePK().Update()
	return err
}
