# pull official base image
FROM node:13.12.0

# set work directory
RUN mkdir -p /src/mantenedor/
WORKDIR /src/mantenedor

# install dependencies
# RUN apk update && apk upgrade

# copy project
COPY . /src/mantenedor/
RUN npm install
EXPOSE 3000
CMD npm run dev
ENV HOST 0.0.0.0