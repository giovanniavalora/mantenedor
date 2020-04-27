# pull official base image
FROM node:13.12.0

# set work directory
RUN mkdir -p /src/mantenedor/
WORKDIR /src/mantenedor

# copy project
COPY . /src/mantenedor/
RUN npm install
RUN npm run build
EXPOSE 3000
# RUN npm run dev
ENV HOST 0.0.0.0