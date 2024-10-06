package server

import (
	"database/sql"
	"fmt"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"log"

	_ "github.com/lib/pq"
)

func Connect(username, password, dbName string) (*sql.DB, error) {
	connString := fmt.Sprintf("postgres://%s:%s@localhost:5433/%s?sslmode=disable", username, password, dbName)
	db, err := sql.Open("postgres", connString)
	if err != nil {
		return nil, err
	}
	return db, nil
}

func Start() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	db, err := Connect("postgres", "admin", "mtshop")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	SetupRoutes(e, db)

	e.Logger.Fatal(e.Start(":8080"))
}
