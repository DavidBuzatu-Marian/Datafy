# Node image
FROM node:alpine as builder

# Set workdir
WORKDIR /usr/app/datafy

# Copy package.json
COPY package.json .

# Copy tsconfig.json
COPY tsconfig.json .

# Install modules
RUN npm install --legacy-peer-deps && npm install typescript -g && npm i @types/mongoose

COPY . .

# Run build
RUN npm run build


# Stage 2 - Remove TS dependencies
FROM node:alpine as remover

WORKDIR /usr/app/datafy

COPY --from=builder /usr/app/package*.json ./
COPY --from=builder /usr/app/dist ./

RUN npm install --only=production


# Stage 3 - Run project
FROM gcr.io/distroless/nodejs:14
WORKDIR /usr/app/datafy
COPY --from=remover /usr/app/datafy ./
USER 1000
CMD ["index.js"]