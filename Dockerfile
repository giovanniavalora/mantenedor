# pull official base image
FROM node:13.12.0

# set work directory
RUN mkdir -p /src/mantenedor/
WORKDIR /src/mantenedor

# copy project
COPY . /src/mantenedor/
RUN npm install && npm cache clean --force
RUN npm run build
EXPOSE 3000
# RUN npm run dev
ENV HOST 0.0.0.0


# FROM node:13.12.0
# RUN mkdir -p /src/mantenedor/
# WORKDIR /src/mantenedor
# COPY package*.json ./
# RUN npm install && npm cache clean --force
# COPY . .
# RUN npm build
# ENV HOST 0.0.0.0