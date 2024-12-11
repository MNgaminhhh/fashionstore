package initialize

import (
	"backend/global"
	"backend/pkg/logger"
)

func InitLogger() {
	global.Logger = logger.NewLogger(global.Config.Logger)
}
