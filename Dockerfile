FROM node:18

WORKDIR /app

COPY client/package*.json ./

RUN npm install

COPY client .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

