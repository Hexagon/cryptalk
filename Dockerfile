FROM keymetrics/pm2:16-alpine
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install --no-cache --production
EXPOSE 8080
CMD [ "pm2-runtime", "start", "pm2.json" ]
