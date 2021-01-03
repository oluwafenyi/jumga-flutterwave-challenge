package db

import (
	"fmt"
	"github.com/google/uuid"
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type DispatchRider struct {
	tableName            struct{} `pg:"dispatchriders"`
	ID                   int64
	SubAccountID         string `pg:"sub_account_id,type:varchar(255)" json:"sub_account_id"`
	FlutterwaveAccountID int32  `pg:"flutterwave_account_id" json:"flutterwave_account_id"`
	Name                 string `pg:"name,type:varchar(255)" json:"name" validate:"required"`
	Mobile               string `pg:"mobile,type:varchar(32)" json:"mobile" validate:"required"`
	Email                string `pg:"email,type:varchar(320)" json:"email" validate:"required"`
	AccountBank          string `pg:"account_bank,type:varchar(8)" json:"account_bank" validate:"required,max=3"`
	AccountNumber        string `pg:"account_number,type:varchar(32)" json:"account_number" validate:"required,max=32"`
	Country              string `pg:"country,type:varchar(4)" json:"country" validate:"required,max=2"`
}

func (d DispatchRider) String() string {
	return fmt.Sprintf("<Dispatch Rider %d>", d.ID)
}

func (d *DispatchRider) Insert() error {
	_, err := DB.Model(d).Insert()
	return err
}

func (d *DispatchRider) Update() error {
	_, err := DB.Model(d).WherePK().Update()
	return err
}

func (d DispatchRider) GetAccountBank() string {
	return d.AccountBank
}

func (d DispatchRider) GetAccountNumber() string {
	return d.AccountNumber
}

type Store struct {
	tableName            struct{}       `pg:"stores"`
	ID                   int64          `json:"-"`
	SubAccountID         string         `pg:"sub_account_id,type:varchar(255)" json:"sub_account_id"`
	FlutterwaveAccountID int32          `pg:"flutterwave_account_id" json:"flutterwave_account_id"`
	Rating               float32        `pg:"rating" json:"rating"`
	BusinessName         string         `pg:"business_name,type:varchar(255)" json:"business_name" validate:"required,max=255"`
	BusinessMobile       string         `pg:"business_mobile,type:varchar(32)" json:"business_mobile" validate:"required,max=32"`
	BusinessEmail        string         `pg:"business_email,type:varchar(320)" json:"business_email" validate:"required,email"`
	Approved             bool           `pg:"approved" json:"approved"`
	AccountBank          string         `pg:"account_bank,type:varchar(8)" json:"account_bank" validate:"required,max=3"`
	AccountNumber        string         `pg:"account_number,type:varchar(32)" json:"account_number" validate:"required,max=32"`
	Country              string         `pg:"country,type:varchar(4)" json:"country" validate:"required,max=2"`
	DispatchRiderID      int64          `json:"-"`
	DispatchRider        *DispatchRider `pg:"rel:has-one" json:"dispatch_rider,omitempty"`
}

func (s Store) String() string {
	return fmt.Sprintf("<Store %d>", s.ID)
}

func (s *Store) Insert() error {
	_, err := DB.Model(s).Insert()
	return err
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
	Email       string   `pg:"email,unique,type:varchar(320)" json:"email" validate:"required,email,max=320"`
	AccountType string   `pg:"account_type,type:varchar(16)" json:"account_type" validate:"oneof=merchant user"`
	StoreID     int64    `json:"-"`
	Store       *Store   `pg:"rel:has-one" json:"store"`
	Name        string   `pg:"name" json:"name" validate:"required"`
	Country     string   `pg:"country,type:varchar(4)" json:"country" validate:"required,max=4"`
	Mobile      string   `pg:"mobile,type:varchar(32)" json:"mobile"`
	Password    []byte   `pg:"password" json:"-"`
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
		return err
	} else {
		_, err := DB.Model(u).Insert()
		return err
	}
}

func (u *User) GetByID(uid string) error {
	err := DB.Model(u).Relation("Store").Where("\"user\".\"id\" = ?", uid).Select()
	return err
}

func (u *User) GetByEmail(email string) error {
	err := DB.Model(u).Where("email = ?", email).Select()
	return err
}

func (u *User) GetFromClaims(claims map[string]interface{}) error {
	uid := claims["uid"].(string)
	err := u.GetByID(uid)
	return err
}

func (u *User) SetPassword(pwd string) {
	pwdBytes := []byte(pwd)
	hashed, err := bcrypt.GenerateFromPassword(pwdBytes, bcrypt.DefaultCost)
	if err != nil {
		log.Panicln(err)
	}
	u.Password = hashed
}

func (u *User) CheckPassword(pwd string) bool {
	err := bcrypt.CompareHashAndPassword(u.Password, []byte(pwd))
	return err == nil
}

type Transaction struct {
	tableName struct{} `pg:"transactions"`
	ID        string   `pg:"id,pk"`
	Status    string   `pg:"status,type:varchar(16)"`
	Type      string   `pg:"type,type:varchar(16)"`
	//Order
	Customer      string `pg:"customer,type:varchar(255)"`
	Currency      string `pg:"currency,type:varchar(8)"`
	Amount        string `pg:"amount"`
	StoreID       int64
	Store         *Store    `pg:"rel:has-one"`
	DateInitiated time.Time `pg:"date_initiated"`
	DateResolved  time.Time `pg:"date_resolved"`
}

func (t *Transaction) Insert() error {
	t.ID = generateTransactionId()
	_, err := DB.Model(t).Insert()
	return err
}

func (t *Transaction) GetByID(id string) error {
	err := DB.Model(t).Where("id = ?", id).Select()
	return err
}

func (t *Transaction) Update() error {
	_, err := DB.Model(t).WherePK().Update()
	return err
}
