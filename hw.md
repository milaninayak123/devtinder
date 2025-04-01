create a repo
initialize the repo
node-modules , package-json , package-lock.json 
install server
create a server
listen to port 7777
write request handlers for /test , /hello
install nodemon and update scripts inside package.json

- initialise git
- diff bw package.json or package-lock.json
- should you add package-lock.json to github or not
- create a remote repo on github
- push all code to remote origin
- play with routes and route extensions /hello , / , hello/2 , /xyz
- explore routing , use of ? , + , () , * in routes
-use of regex in routes: /a/ /.*fly$/
- reading query params in the routes
- reading the dynamic routes
diff bw app.use and app.all
write a dummy auth middleware for admin
write a dummy auth middleware for all user routes , except /user/login
error handling using app.use which is a wildcard-way of error handling wo using try catch
--connect your application to database "connection-url"/devtinder
--call connectdb func and connect to db before starting app on 7777
--create user schema and user model
--create a POST/signup API to add data to db
--push some documents using api calls from postman
---------

more about apis:
diff bw json and js
add the express.js middleware to your app
make your signup api dynamic to receive data from the end user
api - get user by email
api - feed api to get all users from the db
api - get users by id
--diff bw patch & put
// explore schematypes 
required , minLength,maxLength , trim , min , lowercase
Improve the db schema , add timestamps , put all appropriate validations on each field in schema
// create a validator that will limit the users to add a few skills


validate data in signup api by creating helper functions
create pw hash usinf bcrypt.hash save user with encrytpted pw 
compare pws and throw errors if email or pw invalid
install cookie-parse
just send a dummy cookie to user
create get/profile api and check if you get the cookie back
install jsonwebtoken
in login api after email and pw validation , create a jwt token and send it to user
-read the cookies inside your profile api and find the logged in user

