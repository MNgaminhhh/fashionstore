package initialize

import (
	"backend/global"
	"fmt"

	"go.uber.org/zap"
)

func Run() {
	LoadConfig()
	m := global.Config.Postgres
	fmt.Println("Config Postgres ...loading...", m.Username, m.Password)
	InitLogger()
	global.Logger.Info("Config logger, ok!", zap.String("ok", "success"))
	InitPostgres()
	e := InitRouter()

	e.Logger.Fatal(e.Start(":8080"))
}
