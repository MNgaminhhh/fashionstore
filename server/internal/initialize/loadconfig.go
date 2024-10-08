package initialize

import (
	"backend/global"
	"fmt"
	"github.com/spf13/viper"
)

func LoadConfig() {
	viper := viper.New()
	viper.AddConfigPath("./config/")
	viper.SetConfigName("local")
	viper.SetConfigType("yaml")

	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("ERROR loadconfig: %w \n", err))
	}

	fmt.Println("Server Port::", viper.GetInt("server.port"))
	fmt.Println("Server Port::", viper.GetString("security.jwt.key"))

	if err := viper.Unmarshal(&global.Config); err != nil {
		fmt.Printf("Unable to decode configuration %v", err)
	}
}
