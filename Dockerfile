FROM node:22-alpine
RUN node -v

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3007

RUN chmod +x entrypoint.sh
CMD ["sh", "./entrypoint.sh"]