package setting

type LoggerSetting struct {
	Log_level     string `mapstructure:"log_level"`
	File_log_name string `mapstructure:"file_log_name"`
	Max_backups   int    `mapstructure:"max_backups"`
	Max_age       int    `mapstructure:"max_age"`
	Max_size      int    `mapstructure:"max_size"`
	Compress      bool   `mapstructure:"compress"`
}

type ConfigDB struct {
	Server   DBSetting       `mapstructure:"server"`
	Postgres PostgresSetting `mapstructure:"postgres"`
	Logger   LoggerSetting   `mapstructure:"logger"`
}

type DBSetting struct {
	Port int    `mapstructure:"port"`
	Mode string `mapstructure:"mode"`
}

type PostgresSetting struct {
	Host           string `mapstructure:"host"`
	Port           int    `mapstructure:"port"`
	Username       string `mapstructure:"username"`
	Password       string `mapstructure:"password"`
	Dbname         string `mapstructure:"dbname"`
	SSLMode        string `mapstructure:"sslmode"`
	MaxIdleCon     int    `mapstructure:"maxIdleCon"`
	MaxOpenCon     int    `mapstructure:"maxOpenCon"`
	ConMaxLifetime int    `mapstructure:"conMaxLifetime"`
}
