FROM node:14-alpine

RUN mkdir /developer-service
# Create app directory
WORKDIR /developer-service

COPY ./package*.json ./

RUN npm install

# Bundle app source
COPY . .
EXPOSE 3000

CMD [ "npm", "start" ]