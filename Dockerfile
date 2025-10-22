FROM node:22-alpine
RUN node -v

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3007

CMD ["npm", "start"]