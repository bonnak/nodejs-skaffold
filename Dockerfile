FROM node:12.16-alpine

RUN apk add --no-cache tini

WORKDIR /app
COPY package.json .
RUN npm install --only=prod && npm cache clean --force
COPY . .

ENTRYPOINT ["tini", "--"]
CMD ["npm", "start"]
