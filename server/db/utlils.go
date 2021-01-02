package db

import (
	"github.com/google/uuid"
	"strconv"
	"time"
)

func generateTransactionId() string {
	nano := time.Now().UnixNano()
	nanoStr := strconv.FormatInt(nano, 10)
	uid := uuid.New().String()[:5]
	return "jg_" + nanoStr + uid
}
