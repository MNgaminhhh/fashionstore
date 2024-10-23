package main

import (
	"backend/internal/initialize"
	"github.com/joho/godotenv"
	"log"
	"path/filepath"
)

func main() {
	fileEnv := filepath.Join("./", "config.env")
	err := godotenv.Load(fileEnv)
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	log.Println("Starting server...")
	initialize.Run()
}
