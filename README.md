# Datafy
A personal database of people and events. Get notified when birthdays are coming up and get all your events synched with Google Calendar automatically.

# Contents
- [Structure](#structure)
    - [REST API](#rest-api)
    - [Notification Microservice](#notification-microservice)
    - [Mongo Microservice](#mongo-microservice)
- [Tech Stack](#tech-stack)
    - [Languages](#languages)
    - [Database](#database)
    - [Others](#others)

# Structure
## REST API
The REST API is written in *TypeScript*. It was developed in a Test-Driven-Development manner to make sure endpoints are working accordingly and good practices are endorsed. The REST API is concerned only with adding/removing/updating/getting information about people and events from the **Mongo Database**.

## Notification Microservice
The [Notification Microservice](https://github.com/DavidBuzatu-Marian/GoLang-Notification-Service) had been developed in GoLang and it sole purpose is to notify the user once a day about any birthday or event happening on that day.
It has nos been developed in TDD manner because of my inexperience with GoLang. However, tests will be added soon.

## Mongo Microservice
The [Mongo Microservice](https://github.com/DavidBuzatu-Marian/GoLang-Mongo-Service) has been developed in GoLang with the intention of having a general service that provides connectivity to database and handles queries. It is used by the Notification Microservice to get the information about birthdays and events happening today. Moreover, it will be used by the **Google Calendar Microservice** to add events to my Google Calendar.

# Tech Stack
## Languages
* TypeScript - Used to write the REST API part of the project
* GoLang - Used to write the microservices used throughout.

## Database
* MongoDB - Was chosen because of the easy set-up, cloud based host and benefits of the Document based queries.

## Others
* [Express](https://expressjs.com) - Used to set up the REST API endpoints
* [Supertest](https://www.npmjs.com/package/supertest) + [Jest](https://jestjs.io) - Used to create and run TypeScript tests
* [Beeep](https://github.com/gen2brain/beeep) - Used to sent Windows Notifications
* [Mongo-Go-Driver](https://github.com/mongodb/mongo-go-driver) - Used to manage MongoDB connections through GoLang
