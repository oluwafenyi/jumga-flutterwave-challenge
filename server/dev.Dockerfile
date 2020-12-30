FROM golang:1.15.5-alpine

RUN apk update && apk add git make openssh-client curl

WORKDIR /usr/app/

RUN curl -fLo install.sh https://raw.githubusercontent.com/cosmtrek/air/master/install.sh \
    && chmod +x install.sh && sh install.sh && cp ./bin/air /bin/air

CMD air
