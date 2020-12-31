package db

import (
	"fmt"
)

type MerchantDetails struct {
	tableName      struct{} `pg:"merchantdetails"`
	SubAccountId   int32    `pg:"sub_account_id,pk"`
	Rating         float32  `pg:"rating"`
	BusinessName   string   `pg:"business_name"`
	Country        string   `pg:"country"`
	BusinessMobile string   `pg:"business_mobile"`
	BusinessEmail  string   `pg:"business_email"`
}

type User struct {
	tableName         struct{} `pg:"users"`
	UUID              string   `pg:"id,pk,default:gen_random_uuid()" json:"uuid"`
	Email             string   `pg:"email" json:"email" validate:"required,email"`
	AccountType       string   `pg:"account_type" json:"account_type" validate:"oneof:merchant,user"`
	MerchantDetailsID int32
	MerchantDetails   *MerchantDetails `pg:"fk:sub_account_id" json:"merchant_details"`
	Name              string           `pg:"name" json:"name" validate:"required"`
	Country           string           `pg:"country" json:"country" validate:"required"`
	Mobile            string           `pg:"mobile" json:"mobile"`
}

func (u User) String() string {
	return fmt.Sprintf("<User %s>", u.UUID)
}

func (u *User) Insert() error {
	_, err := DB.Model(u).Insert()
	return err
}
