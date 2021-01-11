FROM node:lts

WORKDIR /usr/app/

ENV HOST 0.0.0.0

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]