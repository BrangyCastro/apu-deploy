FROM node:14

WORKDIR /app

COPY . /app

ENV REACT_APP_REST=/api/v3

RUN npm install

RUN npm i -g serve

RUN npm run build

EXPOSE 5000

CMD ["serve", "-s", "build"]