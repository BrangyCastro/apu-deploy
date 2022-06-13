FROM node:14.18.1

WORKDIR /app

COPY . /app

ENV HOST=localhost
ENV USERNAME=root
ENV PASSWORD=Yolo19960@
ENV TYPE=mysql
ENV PORT=3306
ENV DATABASE=uleam_apu_db

RUN npm install --legacy-peer-deps

EXPOSE 8000

CMD [ "npm", "run", "prod" ]