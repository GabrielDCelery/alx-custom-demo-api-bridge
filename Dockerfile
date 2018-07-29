FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install npm packages
RUN npm install

# Bundle app source
COPY . .

# Create deployable build
RUN npm run build

# Remove redundant modules
RUN npm prune --production

EXPOSE 8080
CMD [ "npm", "start" ]