# UserAccountAPI
        
This project is a RESTful API for a User Account Server. This project was designed with games in mind and
offers an easy way to manage unique identities for each user. Emails are verifiable, and user's can update
or reset their passwords as needed. Only one login is permitted per each User, and logins are managed via
Json Web Tokens. Passwords are hashed and salted before storing in the database as well. For maximum security
https only, and rate limiting should be added.

The project is structured according to the onion architecture, and utilizes an inversion of control container to 
provide loose coupling between each layer. Within the project there are three layers: the server, the business logic, 
and the data persistance layer. 

This project was intended to be a learning exercise for my self, and should only be used for educational purposes.
The code could be used for production with a few extra precautions added to it.


Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Create a `config.json` file that follows the `sample-config.json`. 
4. Run `npm start -- -e dev` command

Visual Studio Code support has been added. After opening the root folder
in VS code you will be able to build the typescript code using ctrl-shift-b,
and run the server via the 'Start Dev' task.