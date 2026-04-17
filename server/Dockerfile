FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x migrate.sh

EXPOSE 4000

CMD ["sh", "-c", "bash migrate.sh && npm run dev"]
