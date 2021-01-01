FROM golang:1.15.5-alpine

WORKDIR /usr/app/

COPY . .

RUN go build

EXPOSE 8000

CMD ["./server"]
