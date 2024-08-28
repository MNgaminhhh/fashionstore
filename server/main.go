package main

import (
	"fmt"
	"log"
	"net/http"
)

type Response struct {
    Message string `json:"message"`
}

func test(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "test")
}

func main() {
    http.HandleFunc("/", test)

    fmt.Println("Server is running on port 8005...")
    log.Fatal(http.ListenAndServe(":8005", nil))
}
