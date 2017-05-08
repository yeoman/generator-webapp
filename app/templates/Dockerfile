FROM sbehrends/docker-webapp
MAINTAINER Sergio Behrends

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install node dependencies
COPY package.json /usr/src/app/
RUN npm install

# Install bower dependencies
COPY bower.json /usr/src/app/
RUN bower install --allow-root

# Bundle app source
COPY . /usr/src/app

# Build app
RUN gulp build

# Serve app
EXPOSE 9000
CMD [ "gulp", "serve:dist" ]