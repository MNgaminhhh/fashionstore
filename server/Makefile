ifeq ($(wildcard .env),.env)
	include .env
	export $(shell for /F "tokens=1 delims==" %%i in (.env) do echo %%i)
endif


APP_NAME := $(APP_NAME)
dev:
	go run ./cmd/$(APP_NAME)

upse:
	@echo GOOSE_MIGRATION_DIR=$(GOOSE_MIGRATION_DIR)
	@echo GOOSE_DBSTRING=$(GOOSE_DBSTRING)
	@set GOOSE_DRIVER=postgres&& set GOOSE_DBSTRING=$(GOOSE_DBSTRING)&& goose -dir=$(GOOSE_MIGRATION_DIR) up

downse:
	@set GOOSE_DRIVER=postgres&& set GOOSE_DBSTRING=$(GOOSE_DBSTRING)&& goose -dir=$(GOOSE_MIGRATION_DIR) down

resetse:
	@set GOOSE_DRIVER=postgres&& set GOOSE_DBSTRING=$(GOOSE_DBSTRING)&& goose -dir=$(GOOSE_MIGRATION_DIR) reset

.PHONY: run downse upse resetse migrate
