# Datafy
A personal database of people, events and blogs. The REST API is used to:
- send notifications when birthdays are coming up on the current day
- to get all the events from the database synched with Google Calendar automatically
- to edit/publish blogs to my portfolio website.

# Contents
- [Datafy](#datafy)
- [Contents](#contents)
- [Structure](#structure)
  * [REST API](#rest-api)
  * [Diagram](#diagram)
  * [Endpoints](#endpoints)
  * [Notification Microservice](#notification-microservice)
  * [Calendar Microservice](#calendar-microservice)
  * [Kotlin Android app](#kotlin-android-app)
- [Tech Stack](#tech-stack)
  * [Languages](#languages)
  * [Database](#database)
  * [Others](#others)

# Getting Started
This project uses [yarn](https://yarnpkg.com). In order to run this project, you will need to have `yarn` installed.
Available commands:
- `yarn run dev`: used to run the project locally, in a dev environment
- `yarn run test:unit`: used to run all tests (integration and functional)
- `yarn run build`: used to build a production ready artifact

# Structure
## REST API
The REST API is written in *TypeScript*. It was developed in a Test-Driven-Development manner to make sure endpoints are working accordingly and good practices are endorsed. The REST API is concerned only with adding/removing/updating/getting information about people and events from the **Mongo Database**, while also managing the [blogs](https://github.com/DavidBuzatu-Marian/Blogs) repository used in my [portfolio](https://github.com/DavidBuzatu-Marian/DavidBuzatu_Portfolio_V2) website.

## Diagram
<img src="https://i.ibb.co/pPL4QL1/Datafy-Diagram.jpg" alt="Datafy-Diagram" border="0" height="280">

## Endpoints
1. Person
- CRUD operations
- GET 'person/info/birthdays': Getting list of persons with current date birthday
2. Event
- CRUD operations
- GET '/event/info/latest': Getting list of events added in the past hour
3. Blog
- PUT 'blog/save': used to create/update blog. This endpoint will used the submodule `Blogs` to create a new branch with the blog's title, saving the blogs information to a `.md` file and adding/commiting/pushing changes to git.
- PUT 'blog/post': used to update blog and merging submodule to main. This endpoint will update the blog's content and will merge its branch with main. The aforementioned portfolio website will fetch the github repository of blogs and will get the latest added blogs.

## Notification Microservice
The [Notification Microservice](https://github.com/DavidBuzatu-Marian/GoLang-Notification-Service) has been developed in GoLang and its sole purpose is to notify the user, once a day, about any birthday or event happening on that day.
It has not been developed in TDD manner because of my inexperience with GoLang. However, tests will be added in the future.

## Calendar Microservice
The [Calendar Microservice](https://github.com/DavidBuzatu-Marian/go_event_service) has been developed in GoLang and it is concerned with fetching the events added in the past hour and adding them to the Google Calendar of my account. This microservice does currently not contain tests.

## Kotlin Android app
The [Kotlin Android app](https://github.com/DavidBuzatu-Marian/Datafy-Kotlin-Android-App) has been created to have the flexibility and commodity of editing and publishing blogs from my phone. For more information about its purpose, structure and running steps please vitit the [repository](https://github.com/DavidBuzatu-Marian/Datafy-Kotlin-Android-App)

# Tech Stack
## Languages
* TypeScript - Used to write the REST API part of the project
* GoLang - Used to write the microservices.
* Kotlin - Used to build the android app

## Database
* MongoDB - Was chosen because of the easy set-up, cloud based host and benefits of the Document based queries.

## Others
* [Express](https://expressjs.com) - Used to set up the REST API endpoints
* [Supertest](https://www.npmjs.com/package/supertest) + [Jest](https://jestjs.io) - Used to create and run TypeScript tests
* [Beeep](https://github.com/gen2brain/beeep) - Used to sent Windows Notifications
* [Google Calendar API](https://developers.google.com/calendar) - Used to update personal calendar events
* [Shelljs](https://www.npmjs.com/package/shelljs - Used to execute shell commands for the blog creation and publication (e.g. it is used to call `awk` and `git` from the NodeJS REST API)
