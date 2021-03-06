# Node image
FROM node:alpine as builder

COPY .gitconfig ~/.gitconfig

# Set workdir
WORKDIR /usr/app/datafy

ENV PORT 5000

# Copy package.json
COPY package.json .

# Copy tsconfig.json
COPY tsconfig.json .

# Install modules
RUN npm install --legacy-peer-deps && npm install typescript -g

RUN npm install pm2 -g

COPY . .

RUN apk add --no-cache git

# Run build
RUN npm run build

EXPOSE 5000

CMD [ "pm2-runtime", "./dist/index.js" ]