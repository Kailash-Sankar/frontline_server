# Frontline volunteer app server

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e8c2c86f24df476cae7476c86a92bd0d)](https://app.codacy.com/manual/Kailash-Sankar/frontline_server?utm_source=github.com&utm_medium=referral&utm_content=Kailash-Sankar/frontline_server&utm_campaign=Badge_Grade_Dashboard) [![Known Vulnerabilities](https://snyk.io/test/github/Kailash-Sankar/frontline_server/badge.svg?targetFile=package.json)](https://snyk.io/test/github/Kailash-Sankar/frontline_server?targetFile=package.json) ![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/kailashsankar/frontline_server)

## local setup

    git clone
    npm install

    # update env, follow instructions in example file
    # setup mongodb locally
    cp .env.sample to .env

    # for nodemon, otherwise npm start
    npm run dev

## from docker hub

    docker pull kailashsankar/frontline_server
    docker run -d --restart=always --network=pulse --name=frontline_server -p 0.0.0.0:3080:80 frontline_server:current

## local docker setup

    # move the .env file to a local path
    docker build  -t frontline_server:latest .
    docker run -d --restart=always --name=frontline_server -p 0.0.0.0:3080:80 -v /<path_to_env>/.env:/app/.env frontline_server:latest

    Note: automate some of the manual steps with alfred for dev environments
    it's a hacked up cli util to avoid typing large docker commands one by one,
    help guide is in the repo: https://github.com/Kailash-Sankar/alfred

## mongo db instructions

    https://github.com/Kailash-Sankar/study_notes/blob/master/docker.md

Created with boilterplate: [rest-api-nodejs-mongodb](https://github.com/maitraysuthar/rest-api-nodejs-mongodb)
