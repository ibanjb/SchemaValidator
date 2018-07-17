FROM node:9.11
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
COPY . /usr/src/app
CMD node /usr/src/app/dist/server.js
EXPOSE 3000

# COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# RUN npm install && npm install -g nodemon && npm install -g apidoc && mv node_modules ../
# RUN npm run build
# COPY . .
# EXPOSE 3000
# CMD node dist/server.js