FROM node:16

WORKDIR /project
COPY package*.json ./
COPY tsconfig.json ./

RUN npm i
COPY ./ ./
RUN npm run build

CMD ["node", "./dist/app.js"]