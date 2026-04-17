FROM node:20-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x migrate.sh

EXPOSE 4000

CMD ["sh", "-c", "sh migrate.sh && npm run dev"]
