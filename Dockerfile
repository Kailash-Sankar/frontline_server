FROM node:10.15.3 AS dep
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install pm2 -g
COPY . .

ENV PORT 80
ENV NODE_ENV production
EXPOSE 80
CMD ["pm2-runtime", "ecosystem.config.js"]
