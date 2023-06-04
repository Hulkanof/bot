# ChatBot administration service

## REST API in Express and MongoDB with React frontend

For this project, I decided to use a framework called React, which is a powerful framework for web services. In addition to that, I decided to use TypeScript which is a stronly typed version
of JavaScript. It allowed me to have less issues with types during the project and less random issues in general due to JS doing not exactly what I wanted with variables and objects.

### Features

- Connexion handled using a MangoDB server and JWT tokens
- Bots are accessible from the website, discord and slack depending on their settings
- Different types of user privileges
  - Owners (level 2 admin privilige) can manage administrators and add new ones from their page
  - Admins can change the global configuration of Discord and Slack. They can also edit the configuration of each bot, and add new brains.
- All users have access to the bot panel, which allows them to start a discussion with a bot if it is allowed to
- If the Discord or the Slack configuration is done, it is possible to speak with the bot client (the entity that manage all bots) in order to start a discussion with a specific bot

### Routes

- User

  - **GET** `/api/v1/users` : Get all users
  - **GET** `/api/v1/user` : Get user data from JWT token
  - **POST** `/api/v1/user/create` : Create a new user account and return a JWT token
  - **POST** `/api/v1/user/login` : Login to an existing user account and return a JWT token
  - **POST** `/api/v1/user/:id/admin` : Change the admin status of a user
    -Bot
  - **GET** `/api/v1/bots` : Get information about all bots
  - **GET** `/api/v1/bots/:id` : Get information about a specific bot
  - **POST** `/api/v1/bots/create/:name` : Create a new bot
  - **POST** `/api/v1/bots/delete/:id` : Delete a bot
  - **PATCH** `/api/v1/bots/:id/name/:name` : Change the name of a bot
  - **GET** `/api/v1/bots/:id/brain` : Get the brain of a bot
  - **PUT** `/api/v1/bots/:id/brain/:brain` : Change the brain of a bot
  - **GET** `/api/v1/bots/:id/services` : Get the services of a bot
  - **PUT** `/api/v1/bots/:id/services` : Change the services of a bot
  - **GET** `/api/v1/bots/:id/chats` : Get the chats of a bot
  - **GET** `/api/v1/bots/:id/chats/:author` : Get the chats of a person with a bot
  - **GET** `/api/v1/bots/:id/chats/:author/:service` : Get the chats of a person with a bot on a specific service

- Brain

  - **GET** `/api/v1/brains` : Get all brains
  - **GET** `/api/v1/brains/:id` : Get a specific brain
  - **POST** `/api/v1/brains/create/:name` : Create a new brain
  - **DELETE** `/api/v1/brains/delete/:id` : Delete a brain
  - **PUT** `/api/v1/brains/modify/:id` : Change a brain

- Service
  - **GET** `/api/v1/services` : Get all services
  - **PUT** `/api/v1/services/:name` : Change the configuration of a service

## Installation

- Clone the repo
- Install dependencies

```bash
cd backend
npm install
npx prisma generate
cd ../frontend
npm install
cd ..
```

## Create mongoDB database

- Got to [MongoDB](https://www.mongodb.com/) and login to an existing account or create a new one
- Create a new project
- Build a database cluster: select a provider and a region, then choose the free tier
- Create a user and keep the logins
- Choose _My Local Environment_
- Click on _Add My Current IP Address_
- Go to database tab and on the created cluster
- Click on _Connect_ and copy the connection string (replace \<password\> with the user password)

- Create a .env file in the backend folder

```bash
touch backend/.env
```

- Add the following variables to the .env file

```bash
DATABASE_URL="" # MongoDB URL
TOKEN_SECRET="" # JWT secret (random string of characters) (ex: 2o&voG%7c7hVtf@rdneiKbb&WG79a38B) !!DO NOT LEAVE IT BLANK!!
```

- Run the following command in the backend folder

```bash
npx prisma db push
```

- Start the backend

```bash
npm run dev
```

- Start the frontend

```bash
npm run dev
```

### Add Discord bot config

On the website, go to the Admin page and add the necessary information to add a Discord bot.

_The information can be found on the [Discord developer portal](https://discord.com/developers/applications)_

- Create a new application
- Go to the Bot tab and add a bot
- Copy the **token** and add it to the website
- Go to the OAuth2 tab
- There you can find **client ID** and **client secret**

### Add Slack bot config

On the website, go to the Admin page and add the necessary information to add a Slack bot.
_The information can be found on the [Slack developer portal](https://api.slack.com/apps)_

- Create a new application
- Go to the OAuth & Permissions tab
- Add the following scopes

```bash
channels:history
channels:read
chat:write
chat:write.public
commands
groups:history
groups:read
groups:write
groups:write.invites
users:read
```

- Go to the Slash Commands tab
- Add the following command

```bash
name: "/chat"
desciption: "Creates a chat between you and the chosen bot"
```

- Install the app to your workspace
- Go to the OAuth & Permissions tab
- There you can find the OAuth Access **Token**
- Go to Soket Mode tab and **enable Socket Mode**
- Go to the Basic Information tab
- There you can find the **Signing Secret**
- Scroll down to App-Level Tokens and add a new token with the following scopes

```bash
connections:write
authorizations:read
app_configurations:write
```

- Add the returned token (**Slack App Token**) to the website
- Add the OAuth Access **Token** and the **Signing Secret** to the website
- Go to the Event Subscriptions tab and **enable Events**
- Add the following events

```bash
message.channels
```

### Add Mastodon bot config

Not implemented
