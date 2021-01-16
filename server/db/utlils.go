package db

import (
	"github.com/google/uuid"
	"github.com/jinzhu/now"
	"strconv"
	"time"
)

type MerchantDashboard struct {
	ProductCount             int       `json:"product_count"`
	SalesCount               int       `json:"sales_count"`
	AverageRating            float32   `json:"average_rating"`
	QuantityShipped          int       `json:"quantity_shipped"`
	AwaitingShipping         int       `json:"awaiting_shipping"`
	AveragePrice             float64   `json:"average_price"`
	SalesThisWeek            int       `json:"sales_past_week"`
	ShippedThisWeek          int       `json:"shipped_this_week"`
	AwaitingShippingThisWeek int       `json:"awaiting_shipping_this_week"`
	TopProducts              []Product `json:"top_products"`
}

func generateTransactionId() string {
	nano := time.Now().UnixNano()
	nanoStr := strconv.FormatInt(nano, 10)
	uid := uuid.New().String()[:5]
	return "jg_" + nanoStr + uid
}

func calculateAvgRating(m *User) float32 {
	var products []Product
	_ = DB.Model(&products).ColumnExpr("DISTINCT rating").Where("product.store_id = ?", m.StoreID).Select()
	count := float32(len(products))
	var total float32 = 0
	for _, product := range products {
		total += product.Rating
	}
	return total / count
}

func calculateAvgPrice(m *User) float64 {
	var products []Product
	_ = DB.Model(&products).ColumnExpr("DISTINCT price").Where("product.store_id = ?", m.StoreID).Select()
	count := float64(len(products))
	var total float64 = 0
	for _, product := range products {
		total += product.Price
	}
	return total / count
}

func getTopProducts() []Product {
	var products []Product
	_ = DB.Model(&products).Relation("DisplayImage").Relation("Category").Order("id ASC").Limit(3).Select()
	if len(products) == 0 {
		return make([]Product, 0)
	}
	return products
}

func GetMerchantDashboard(m *User) MerchantDashboard {
	productCount, _ := DB.Model(&Product{}).Where(`store_id = ?`, m.StoreID).Count()
	salesCount, _ := DB.Model(&Transaction{}).Where(`store_id = ? AND status = 'success'`, m.StoreID).Count()
	avgRating := calculateAvgRating(m)
	quantityShipped, _ := DB.Model(&Transaction{}).Relation("Order").Where(`"transaction"."order_status" = 'shipped' AND "transaction"."store_id" = ?`, m.StoreID).Count()
	awaitingShipping, _ := DB.Model(&Transaction{}).Relation("Order").Where(`"transaction"."order_status" = 'awaiting delivery' AND "transaction"."store_id" = ?`, m.StoreID).Count()
	avgPrice := calculateAvgPrice(m)

	weekBegan := now.BeginningOfWeek()
	weekEnding := now.EndOfWeek()
	beganStamp := weekBegan.Format("2006-01-02")
	endStamp := weekEnding.Format("2006-01-02")

	salesInPastWeek, _ := DB.Model(&Transaction{}).Where(`store_id = ? AND status = 'success' AND date_resolved between ? and ?`, m.StoreID, beganStamp, endStamp).Count()
	shippedThisWeek, _ := DB.Model(&Transaction{}).Relation("Order").Where(`"transaction"."order_status" = 'shipped' AND "transaction"."store_id" = ? AND date_resolved between ? and ?`, m.StoreID, beganStamp, endStamp).Count()
	awaitingShippingThisWeek, _ := DB.Model(&Transaction{}).Relation("Order").Where(`"transaction"."order_status" = 'awaiting delivery' AND "transaction"."store_id" = ? AND date_initiated between ? and ? `, m.StoreID, beganStamp, endStamp).Count()

	top3Products := getTopProducts()

	return MerchantDashboard{
		ProductCount:             productCount,
		SalesCount:               salesCount,
		AverageRating:            avgRating,
		QuantityShipped:          quantityShipped,
		AwaitingShipping:         awaitingShipping,
		AveragePrice:             avgPrice,
		SalesThisWeek:            salesInPastWeek,
		ShippedThisWeek:          shippedThisWeek,
		AwaitingShippingThisWeek: awaitingShippingThisWeek,
		TopProducts:              top3Products,
	}
}
