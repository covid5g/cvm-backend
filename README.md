# cvm-backend

Backend project for #HackTheVirus hackathon, 2020-04-{14-16}

## System Requirements
- nodejs 13
- mysql 8
- yarn

## Installation
- clone this repo
- execute `yarn install`
- execute `yarn sv:run` to start up the backend

## Configuration
- for database credentials, edit `.env` file
- for routes, see `config/routes.ts`
- for webservice configuration, see `webservice.config.ts` file

## Directory structure
- `/bin` -> contains project executable
- `/build` -> contains transpiled code (TS -> JS)
- `/config` -> contains complex configuration for webservice
- `/devops` -> contains devops tools and scripts (currently only Nginx config)
- `/dist` -> contains packaged project (into a single executable file) 
- `/src` -> source code of current app
    - `action/` -> endpoints
    - `core/` -> core functionality
    - `model/` -> entity models
    - `service/` -> shared services across web app
    - `util/` -> various tools, helpers etc
    - `Application.ts` -> thy mighty kernel.
- `.env` -> environment variables (sensitive credentials)

## TL;DR Tech Details
- web server framework: Hapi
- typescript programming language
- authentication required for all except login and register

## Tech details
This project is a web service / backend application that leverages common best practices and top notch industry standards.

Entanglement is a wrapper around Hapi web server. Why Hapi? Because it's a web server framework developed for Node.js 
environment and provides various basic and secure features, such as routing, input validation, authentication and more.

Entanglement is wrote in TypeScript, which is a superset of JavaScript. It was made by Microsoft in 2014 to improve 
static typing in JavaScript (which is lacking) and to better refactor, debug and prevent various bugs and quirks.
Because it is a superset of JS, it closely follows ES standards and tries to implement those features in advance.
For this project, we leverage TypeScript 3.8 features that matches with ES 2020 specification.

One of other significant library is `mysql`, with it's wrapper called `promise-mysql`. Promises are a language feature 
that solves the callback hell induced, so we can fetch user data from database in a single line (instead of 10 or more).

To provide better DX (developer experience), we've implemented a Container, which holds instantiated services. It is a 
better and cleaner way to have global objects in your application, from a single central point. A better solution were 
to be Dependency Injection pattern, but it's too much for only 2 services.
