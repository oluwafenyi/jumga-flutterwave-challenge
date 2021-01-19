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

type OrderDetail struct {
	TransactionID     string    `json:"transaction_id"`
	OrderID           int64     `json:"order_id"`
	OrderStatus       string    `json:"order_status"`
	ProductTitle      string    `json:"product_title"`
	Quantity          int       `json:"quantity"`
	DeliveryLocation  string    `json:"delivery_location"`
	DeliveryMobile    string    `json:"delivery_mobile"`
	DateInitiated     time.Time `json:"date_initiated"`
	TransactionStatus string    `json:"transaction_status"`
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
	if count == 0 {
		return 0
	}
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
	if count == 0 {
		return 0
	}
	var total float64 = 0
	for _, product := range products {
		total += product.Price
	}
	return total / count
}

func getTopProducts(m *User) []Product {
	var products []Product
	_ = DB.Model(&products).Relation("DisplayImage").Relation("Category").Where(`"product"."store_id" = ?`, m.StoreID).Order("id ASC").Limit(3).Select()
	if len(products) == 0 {
		return make([]Product, 0)
	}
	return products
}

func GetMerchantDashboard(m *User) MerchantDashboard {
	productCount, _ := DB.Model(&Product{}).Where(`store_id = ?`, m.StoreID).Count()
	salesCount, _ := DB.Model(&Transaction{}).Where(`store_id = ? AND status = 'success'`, m.StoreID).Count()
	avgRating := calculateAvgRating(m)
	quantityShipped, _ := DB.Model(&Transaction{}).Relation("Order").Where(`"order"."status" = 'shipped' AND "transaction"."store_id" = ?`, m.StoreID).Count()
	awaitingShipping, _ := DB.Model(&Transaction{}).Relation("Order").Where(`"order"."status" = 'awaiting delivery' AND "transaction"."store_id" = ?`, m.StoreID).Count()
	avgPrice := calculateAvgPrice(m)

	weekBegan := now.BeginningOfWeek()
	weekEnding := now.EndOfWeek()
	beganStamp := weekBegan.Format("2006-01-02")
	endStamp := weekEnding.Format("2006-01-02")

	salesInPastWeek, _ := DB.Model(&Transaction{}).Where(`store_id = ? AND status = 'success' AND date_resolved between ? and ?`, m.StoreID, beganStamp, endStamp).Count()
	shippedThisWeek, _ := DB.Model(&Transaction{}).Relation("Order").Where(`"order"."status" = 'shipped' AND "transaction"."store_id" = ? AND date_resolved between ? and ?`, m.StoreID, beganStamp, endStamp).Count()
	awaitingShippingThisWeek, _ := DB.Model(&Transaction{}).Relation("Order").Where(`"order"."status" = 'awaiting delivery' AND "transaction"."store_id" = ? AND date_initiated between ? and ? `, m.StoreID, beganStamp, endStamp).Count()

	top3Products := getTopProducts(m)

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

func GetMerchantOrders(m *User) []OrderDetail {
	store := m.Store
	var transactions []Transaction
	_ = DB.Model(&transactions).Relation("Order").Relation("Order.Product").Where(`"transaction"."store_id" = ?`, store.ID).Order("date_initiated DESC").Select()
	var orders []OrderDetail
	for _, t := range transactions {
		orders = append(orders, OrderDetail{
			TransactionID:     t.ID,
			OrderID:           t.OrderID,
			OrderStatus:       t.Order.Status,
			ProductTitle:      t.Order.Product.Title,
			Quantity:          t.Order.Quantity,
			DeliveryLocation:  t.Order.DeliveryLocation,
			DeliveryMobile:    t.Order.DeliveryMobile,
			DateInitiated:     t.DateInitiated,
			TransactionStatus: t.Status,
		})
	}
	if len(orders) == 0 {
		return make([]OrderDetail, 0)
	}
	return orders
}
