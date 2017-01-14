FROM node:alpine
RUN mkdir -p /usr/src/app/public
VOLUME /usr/src/app/public
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
EXPOSE 8080
CMD [ "npm", "start" ]
