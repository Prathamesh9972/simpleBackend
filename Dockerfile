FROM node:18

WORKDIR /app

COPY package*.json ./

# Install all dependencies
RUN npm install

# Install nodemon globally so it works
RUN npm install -g nodemon

COPY . .

EXPOSE 3000

# Start app with nodemon
CMD ["nodemon", "server.js"]
