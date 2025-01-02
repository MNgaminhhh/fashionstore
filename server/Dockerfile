FROM golang:alpine AS builder

WORKDIR /build

COPY . .

RUN go mod download

RUN go build -o mtshop.shop ./cmd/server

FROM scratch

COPY ./config /config
COPY .env .env

COPY --from=builder /build/mtshop.shop /

ENTRYPOINT [ "/mtshop.shop", "config/local.yaml" ]
