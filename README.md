# Frontline volunteer app server

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e8c2c86f24df476cae7476c86a92bd0d)](https://app.codacy.com/manual/Kailash-Sankar/frontline_server?utm_source=github.com&utm_medium=referral&utm_content=Kailash-Sankar/frontline_server&utm_campaign=Badge_Grade_Dashboard)

## To setup locally

- Clone the repo
- npm install
- setup mongodb locally, there are examples in bin/queries.js
- cp .env.sample to .env and update mongo db connection string
- npm start ( or use nodemon bin/www)
- app server will run on port 3080 by default.

## docker setup

    cp .env.sample to .env.docker and update mongo db connection string
    docker build  -t frontline_server:latest .
    docker run -d --restart=always --name=frontline_server -p 0.0.0.0:3080:80 frontline_server:latest

## alfred config

it's a hacked up cli util to avoid typing large docker commands one by one.
https://github.com/Kailash-Sankar/alfred

- clone repo
- setup alfred
- add config

        frontline_server: {
            path: `/<path_to_repo>/`,
            name: 'frontline_server',
            bind: '0.0.0.0:3080:80',
            type: 'standard',
        },

  - alfred --serve frontline_server --dryrun
  - alfred --serve frontline_server

- for mongodb, created a mounted volume first
- docker volume create mongodbdata
- add below config to alfred


        mongodb: {
            image: 'mongo',
            version: '4.2.1',
            name: 'mongodb',
            bind: '27017-27019:27017-27019',
            type: 'db_hub',
            volume: 'mongodbdata:/data/db'
        }

- alfred --serve mongodb --dryrun
- alfred --serve mongodb

Created with boilterplate: https://github.com/maitraysuthar/rest-api-nodejs-mongodb
