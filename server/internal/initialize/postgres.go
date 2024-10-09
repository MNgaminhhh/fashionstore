package initialize

import (
	"backend/global"
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"go.uber.org/zap"
	"time"
)

func checkError(err error, errString string) {
	if err != nil {
		global.Logger.Error(errString, zap.Error(err))
		panic(err)
	}
}

func InitPostgres() {
	p := global.Config.Postgres
	connString := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		p.Host, p.Port, p.Username, p.Password, p.Dbname, p.SSLMode)

	db, err := sql.Open("postgres", connString)
	checkError(err, "Error connect")

	SetupConn(db)
	global.Mdb = db
	global.Logger.Info("Initializing PostgreSQL Successfully")
}

func SetupConn(db *sql.DB) {
	p := global.Config.Postgres
	db.SetConnMaxIdleTime(time.Duration(p.ConMaxLifetime) * time.Second)
	db.SetMaxOpenConns(p.MaxOpenCon)
	db.SetMaxIdleConns(p.MaxIdleCon)
}
