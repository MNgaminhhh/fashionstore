package global

import (
	"backend/pkg/logger"
	"backend/pkg/setting"
	"database/sql"
)

var (
	Config setting.ConfigDB
	Logger *logger.LoggerZap
	Mdb    *sql.DB
)
