# Node.js MongoDB Mongoose Login/Signup

This is a simple website using logged in sessions that provide some authenticated-only content. You can also signup for an account.

It uses **MongoDB** for persistant storage, with **Mongoose** as the database API (which leverages the mongodb driver). **Jade** is used for the view template engine, **express** for the web framework and also some other useful middleware.

Make sure to have MongoDB installed on your machine. See their [installation guides](http://docs.mongodb.org/manual/installation/) if you haven't already.

1. run the mongo demon (if you don't know how - it will be within the installtion guide) For me that's `mongod` inside Terminal
2. inside a new shell; run `node server`
3. load up http://127.0.0.1:3000
4. Signup and login!
