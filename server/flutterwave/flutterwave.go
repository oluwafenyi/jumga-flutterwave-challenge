package flutterwave

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
)

type SubAccount struct {
	AccountBank           string                 `json:"account_bank"`
	AccountNumber         string                 `json:"account_number"`
	BusinessName          string                 `json:"business_name"`
	Country               string                 `json:"country"`
	SplitValue            float64                `json:"split_value"`
	BusinessMobile        string                 `json:"business_mobile"`
	BusinessEmail         string                 `json:"business_email"`
	BusinessContact       string                 `json:"business_contact"`
	BusinessContactMobile string                 `json:"business_contact_mobile"`
	SplitType             string                 `json:"split_type"`
	Meta                  map[string]interface{} `json:"meta,omitempty"`
}

type Customer struct {
	Email       string `json:"email"`
	PhoneNumber string `json:"phonenumber"`
	Name        string `json:"name"`
}

type Customizations struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Logo        string `json:"logo"`
}

type SubAccountForm struct {
	ID                    string `json:"id"`
	TransactionSplitRatio int32  `json:"transaction_split_ratio,omitempty"`
	TransactionChargeType string `json:"transaction_charge_type,omitempty"`
	TransactionCharge     string `json:"transaction_charge,omitempty"`
}

type PaymentInitiationForm struct {
	Reference      string            `json:"tx_ref"`
	Amount         string            `json:"amount"`
	Currency       string            `json:"currency"`
	RedirectUrl    string            `json:"redirect_url"`
	PaymentOptions string            `json:"payment_options"`
	Meta           map[string]string `json:"meta"`
	Customer       `json:"customer"`
	Customizations `json:"customizations"`
	SubAccounts    []SubAccountForm `json:"subaccounts,omitempty"`
}

func Request(method string, path string, body io.Reader) (*http.Response, error) {
	client := &http.Client{}
	req, err := http.NewRequest(method, "https://api.flutterwave.com/v3/"+path, body)
	if err != nil {
		return nil, err
	}
	req.Header.Add("Authorization", "Bearer FLWSECK_TEST-2b200882a3871d5d4cb57e349ed5fe03-X")
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Accept", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != 200 {
		err = errors.New("flutterRequestError: resource does not exist")
		return nil, err
	}
	return resp, nil
}

func ValidateBankAccountDetails(accountBank string, accountNumber string) (*http.Response, error) {
	data, _ := json.Marshal(map[string]string{
		"account_number": accountNumber,
		"account_bank":   accountBank,
	})
	resp, err := Request("POST", "accounts/resolve", bytes.NewBuffer(data))
	return resp, err
}

func InitiatePayment(f *PaymentInitiationForm) (string, error) {
	reqBody, _ := json.Marshal(*f)
	resp, err := Request("POST", "payments", bytes.NewBuffer(reqBody))
	if err != nil {
		log.Printf("error: transaction %s could not be initiated\n", f.Reference)
		return "", errors.New("could not initiate transaction")
	}
	var respObj map[string]interface{}
	_ = json.NewDecoder(resp.Body).Decode(&respObj)
	data := respObj["data"].(map[string]interface{})
	link := data["link"].(string)
	return link, nil
}

func GetTransactionStatus(transactionId string) (map[string]interface{}, error) {
	path := fmt.Sprintf("transactions/%s/verify", transactionId)
	resp, err := Request("GET", path, nil)
	if err != nil || resp.StatusCode != 200 {
		log.Printf("error: problem verifying transaction %s\n", transactionId)
		return nil, err
	}
	var respObj map[string]interface{}
	_ = json.NewDecoder(resp.Body).Decode(&respObj)
	return respObj, nil
}

func CreateSubAccount(account *SubAccount) (map[string]interface{}, error) {
	data, _ := json.Marshal(account)
	resp, err := Request("POST", "subaccounts", bytes.NewBuffer(data))
	if err != nil {
		log.Printf("error: problem creating subaccount for <Store %s>", account.BusinessName)
		return nil, err
	}
	if resp.StatusCode != 200 {
		log.Printf("error: problem creating subaccount for <Store %s>", account.BusinessName)
		return nil, err
	}
	var respObj map[string]interface{}
	_ = json.NewDecoder(resp.Body).Decode(&respObj)
	return respObj, nil
}
