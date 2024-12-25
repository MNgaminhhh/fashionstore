package main

import (
	"backend/internal/initialize"
	"log"
	"path/filepath"

	"github.com/joho/godotenv"
)

func main() {
	fileEnv := filepath.Join("./", ".env")
	err := godotenv.Load(fileEnv)
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	log.Println("Starting server...")
	initialize.Run()
}
