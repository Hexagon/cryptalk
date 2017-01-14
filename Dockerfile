FROM node:alpine
VOLUME /usr/src/app/public
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
EXPOSE 8080
CMD [ "npm", "start" ]
