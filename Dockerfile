FROM node:12.13.1

WORKDIR /user/app
COPY package*.json ./

RUN npm i -g gulp-cli
RUN npm install

COPY . ./

RUN gulp
RUN ls

EXPOSE 3000
CMD ["npm", "run production"]