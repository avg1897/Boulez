FROM node:18.18

# We have to install nodemon globally before moving into the working directory
RUN npm install -g nodemon

WORKDIR /usr/app

COPY ./package*.json /

RUN npm i

COPY . .

EXPOSE 3000