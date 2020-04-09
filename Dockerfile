FROM node:10.15.0-alpine AS dep
ENV NODE_ENV production

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install pm2 -g
COPY . .

ENV PORT 80
EXPOSE 80
CMD ["pm2-runtime", "ecosystem.config.js"]
