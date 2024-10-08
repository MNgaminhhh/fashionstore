package main

import (
	"backend/internal/initialize"
	"log"
)

func main() {
	log.Println("Starting server...")
	//server.Start()
	initialize.Run()
}
