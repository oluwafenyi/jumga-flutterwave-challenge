package db

import (
	"errors"
	"fmt"
	"github.com/google/uuid"
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type DispatchRider struct {
	tableName            struct{} `pg:"dispatchriders"`
	ID                   int64    `json:"id"`
	SubAccountID         string   `pg:"sub_account_id,type:varchar(255)" json:"-"`
	FlutterwaveAccountID int32    `pg:"flutterwave_account_id" json:"-"`
	Name                 string   `pg:"name,type:varchar(255)" json:"name" validate:"required"`
	Mobile               string   `pg:"mobile,type:varchar(32)" json:"mobile" validate:"required"`
	Email                string   `pg:"email,type:varchar(320)" json:"email" validate:"required"`
	AccountBank          string   `pg:"account_bank,type:varchar(8)" json:"-" validate:"required,max=3"`
	AccountNumber        string   `pg:"account_number,type:varchar(32)" json:"-" validate:"required,max=32"`
	Country              string   `pg:"country,type:varchar(4)" json:"country" validate:"required,max=2"`
}

func (d DispatchRider) String() string {
	return fmt.Sprintf("<Dispatch Rider %d>", d.ID)
}

func GetRiderByStoreID(id int64) (*DispatchRider, error) {
	store := new(Store)
	err := store.GetByID(id)
	if store.ID == 0 {
		return nil, errors.New("no store with that id found")
	}
	return store.DispatchRider, err
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
	SubAccountID         string         `pg:"sub_account_id,type:varchar(255)" json:"-"`
	FlutterwaveAccountID int32          `pg:"flutterwave_account_id" json:"-"`
	Rating               float32        `pg:"rating" json:"rating"`
	BusinessName         string         `pg:"business_name,type:varchar(255)" json:"business_name" validate:"required,max=255"`
	BusinessMobile       string         `pg:"business_mobile,type:varchar(32)" json:"business_mobile" validate:"required,max=32"`
	BusinessEmail        string         `pg:"business_email,type:varchar(320)" json:"business_email" validate:"required,email"`
	Approved             bool           `pg:"approved" json:"approved"`
	AccountBank          string         `pg:"account_bank,type:varchar(8)" json:"-"`
	AccountNumber        string         `pg:"account_number,type:varchar(32)" json:"-"`
	Country              string         `pg:"country,type:varchar(4)" json:"country" validate:"required,max=2"`
	LogoID               int64          `json:"-"`
	Logo                 *Image         `pg:"rel:has-one" json:"logo"`
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
	err := DB.Model(s).Relation("DispatchRider").Where("\"store\".\"id\" = ?", id).Select()
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
	AccountType string   `pg:"account_type,type:varchar(16)" json:"account_type" validate:"oneof=merchant user,required"`
	StoreID     int64    `json:"-"`
	Store       *Store   `pg:"rel:has-one" json:"store"`
	Name        string   `pg:"name" json:"name" validate:"required"`
	Country     string   `pg:"country,type:varchar(4)" json:"country" validate:"required,max=4"`
	Address     string   `pg:",type:varchar(500)" json:"address" validate:"required"`
	Mobile      string   `pg:"mobile,type:varchar(32)" json:"mobile" validate:"required"`
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
	}
	_, err := DB.Model(u).Insert()
	return err
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
	tableName     struct{} `pg:"transactions"`
	ID            string   `pg:"id,pk"`
	Status        string   `pg:"status,type:varchar(16)"`
	Type          string   `pg:"type,type:varchar(16)"`
	CustomerID    string
	Customer      *User  `pg:"rel:has-one"`
	Currency      string `pg:"currency,type:varchar(8)"`
	Amount        string `pg:"amount"`
	StoreID       int64
	Store         *Store    `pg:"rel:has-one"`
	DateInitiated time.Time `pg:"date_initiated"`
	DateResolved  time.Time `pg:"date_resolved"`
	OrderID       int64
	Order         *Order `pg:"rel:has-one"`
}

func (t *Transaction) Insert() error {
	t.ID = generateTransactionId()
	if t.Order != nil {
		_ = t.Order.Insert()
		t.OrderID = t.Order.ID
	}
	_, err := DB.Model(t).Insert()
	return err
}

func (t *Transaction) GetByID(id string) error {
	err := DB.Model(t).Relation("Order").Where("\"transaction\".\"id\" = ?", id).Select()
	return err
}

func (t *Transaction) Update() error {
	_, err := DB.Model(t).WherePK().Update()
	return err
}

//type ProductReview struct {
//
//}

// create at startup
type ProductCategory struct {
	ID   int32  `json:"id"`
	Name string `pg:",type:varchar(255)" json:"name"`
	Slug string `pg:",unique,type:varchar(16)" json:"slug"`
}

func (p ProductCategory) String() string {
	return fmt.Sprintf("<Product Category %s>", p.Slug)
}

func (p *ProductCategory) GetBySlug(slug string) error {
	err := DB.Model(p).Where("slug = ?", slug).Select()
	return err
}

func (p *ProductCategory) Insert() error {
	check := new(ProductCategory)
	_ = check.GetBySlug(p.Slug)

	if check.ID == 0 {
		_, err := DB.Model(p).Insert()
		return err
	}
	return nil
}

type Image struct {
	ID   int64  `json:"-"`
	Link string `pg:",type:varchar(320)" json:"link" validate:"required"`
}

func (i *Image) String() string {
	return fmt.Sprintf("<Image %d>", i.ID)
}

func (i *Image) Insert() error {
	_, err := DB.Model(i).Insert()
	return err
}

func (i *Image) Update() error {
	_, err := DB.Model(i).WherePK().Update()
	return err
}

type Product struct {
	tableName      struct{}         `pg:"products"`
	ID             int64            `json:"id"`
	Title          string           `pg:",type:varchar(255)" validate:"required,max=255" json:"title"`
	Stock          int32            `json:"stock" validate:"required"`
	Description    string           `json:"description" validate:"required"`
	Price          float64          `json:"price" validate:"required"`
	Discount       float32          `pg:"default:0" json:"discount_percentage" validate:"lte=100.0,gte=0"`
	DeliveryFee    float64          `json:"delivery_fee" validate:"required"`
	DisplayImageID int64            `json:"-"`
	DisplayImage   *Image           `pg:"rel:has-one" json:"display_image"`
	Rating         float32          `json:"rating"`
	CategoryID     int32            `json:"-"`
	Category       *ProductCategory `pg:"rel:has-one" json:"category"`
	StoreID        int64            `json:"-"`
	DateListed     time.Time        `json:"-"`
	Store          *Store           `pg:"rel:has-one" json:"store,omitempty"`
}

func (p *Product) String() string {
	return fmt.Sprintf("<Product %d>", p.ID)
}

func (p *Product) GetAll() ([]Product, error) {
	products := make([]Product, 0)
	err := DB.Model(&products).Relation("Category").Relation("DisplayImage").Relation("Store").Relation("Store.Logo").Select()
	return products, err
}

func (p *Product) GetByID(id int64) error {
	err := DB.Model(p).Relation("Category").Relation("DisplayImage").Relation("Store").Where("\"product\".\"id\" = ?", id).Select()
	return err
}

func (p *Product) Insert() error {
	_, err := DB.Model(p).Insert()
	return err
}

func (p *Product) Update() error {
	_, err := DB.Model(p).WherePK().Update()
	return err
}

func (p *Product) Delete() error {
	_, err := DB.Model(p).WherePK().Delete()
	return err
}

func GetProductsPage(start, limit int) ([]Product, bool) {
	var products []Product
	_ = DB.Model(&products).Relation("Category").Relation("DisplayImage").Order("id DESC").Offset(start).Limit(limit).Select()
	var next []Product
	_ = DB.Model(&next).Order("id DESC").Offset(limit + start + 1).Limit(1).Select()
	if len(products) == 0 {
		return make([]Product, 0), false
	}
	return products, len(next) > 0
}

type Order struct {
	ID               int64
	ProductID        int64    `json:"-"`
	Product          *Product `pg:"rel:has-one"`
	Status           string   `json:"status"`
	DeliveryLocation string   `json:"delivery_location"`
	DeliveryMobile   string   `json:"delivery_mobile"`
}

func (o Order) String() string {
	return fmt.Sprintf("<Order %d>", o.ID)
}

func (o *Order) Insert() error {
	_, err := DB.Model(o).Insert()
	return err
}

func (o *Order) Update() error {
	_, err := DB.Model(o).WherePK().Update()
	return err
}
