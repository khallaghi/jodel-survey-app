# Jodel Survey App

A simple REST API for a survey application.   
You can create user in the application and make public surveys. Surveys are consists of 
one question and multiple choices and everyone can vote to one of the choices pretty much like 
Twitter polls.   


## Run The Application

There are two simple ways to run the application:
* Using `npm` on local machine 
* Using docker and deploy it where ever you want

### Prerequisite
You only need `node`, `npm` and `docker` installed on your machine. 

### Using `npm`
Just run `npm install` and `npm start` and you are good to go. 

The list of supported commands:
```bash
npm test # test using Jest
npm run coverage # test and open the coverage report in the browser
npm run dev # run the API in development mode
npm run prod # run the API in production mode
npm run docs # generate the API docs
```

### Using `docker`
In the root of the project just hit 
```bash
docker compose up -d
``` 
This command first build the [`Dockerfile`](Dockerfile) in the root of the project and run it.
note that it will run the application with a default sqlite database.   
For a more robust and production ready version you can use the template in the [`docker-compose-with-mysql.yaml`](docker-compose-with-mysql.yaml)  

You can also run this using the bellow command:   
```bash
docker compose -f docker-compose-with-mysql.yaml up -d 
```
Both of the above command will run the application on the port `8080` of your local machine.
Now you can use `curl` or postman to use the provided APIs. 

### Deploy
To deploy in a real production environment setup this environment variable in your docker compose file 
just like `docker-compose-with-mysql.yaml`

List of important keys:
* `IP=0.0.0.0` 
* `PORT=8080` 
* `API_ROOT=/v1` 
* `DB_DIALECT=mysql`
* `DB_NAME=jodel`
* `DB_HOST=mysql:3306`
* `DB_USER=root`  

The full list of configuration is available in [`src/config.js`](src/config.js)  

## API Doc
Check out the complete API doc page in markdown: [API Doc](DOCS.md)  
To see the API docs in your browser with bit more css just run:
```bash
npm run docs
```

## Test 
To run tests just run:
```bash
npm test
```
To see test coverage run:
```bash
npm run coverage
```
You can see the results as a table in terminal or navigate to [`coverage/lcov-report/index.html`](coverage/lcov-report/index.html) 
to see the results with added css and stuff. 


## Directory structure
### Overview


```
src/
├─ api/
│  ├─ user/
│  │  ├─ controller.js
│  │  ├─ index.js
│  │  ├─ index.test.js
│  │  ├─ validators.js
│  │  └─ model.test.js
|  |-- survey/
│  └─ index.js
├─ services/
│  ├─ express/
│  ├─ winston/
|  |- jwt
│  └─ my-service/
├─ app.js
├─ config.js
└─ index.js
```

### src/api/

Here is where the API endpoints are defined. Each API has its own folder.
* `controller` which dedicated to controllers of the api and basically the business logic of the end points lies here
* `model` which the main entity and it's operations with data available here. I also wrote a wrapper function for each main 
needed operation so the architecture would not force by the `Sequelize` framework and have the freedom if we want to use other
ORMs like `mongoose`. It is important that the main architecture of the software would not derive by the frameworks since 
these pieces of software might change a lot or deprecated at all. 
* `validator` These are basically the express middlewares which handle input validation
* `index.js` The file that the main endpoint defined alongside of their documentation
* `*.test.js` The test files

### services/

Here you can find `helpers`, `libraries` and other types of modules which you want to use in your APIs.
