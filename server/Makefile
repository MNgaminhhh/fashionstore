GOOSE_DBSTRING = postgres://postgres:123456@localhost:5432/mtshop?sslmode=disable
GOOSE_MIGRATION_DIR ?= sql/schema

APP_NAME := server

dev:
	go run ./cmd/$(APP_NAME)

upse:
	@set GOOSE_DRIVER=postgres&& set GOOSE_DBSTRING=$(GOOSE_DBSTRING)&& goose -dir=$(GOOSE_MIGRATION_DIR) up

downse:
	@set GOOSE_DRIVER=postgres&& set GOOSE_DBSTRING=$(GOOSE_DBSTRING)&& goose -dir=$(GOOSE_MIGRATION_DIR) down

resetse:
	@set GOOSE_DRIVER=postgres&& set GOOSE_DBSTRING=$(GOOSE_DBSTRING)&& goose -dir=$(GOOSE_MIGRATION_DIR) reset

migrate:
	@set GOOSE_DRIVER=postgres && set GOOSE_DBSTRING=$(GOOSE_DBSTRING) && goose -dir=$(GOOSE_MIGRATION_DIR) up-to-date

.PHONY: run downse upse resetse migrate
