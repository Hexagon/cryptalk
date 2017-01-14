FROM node:alpine
RUN mkdir -p /usr/src/app/public
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
EXPOSE 8080
RUN ["chmod", "+x", "/usr/src/app/docker-entrypoint.sh"]
ENTRYPOINT [ "/usr/src/app/docker-entrypoint.sh" ]
CMD [ "npm", "start"]