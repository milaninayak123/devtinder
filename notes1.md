# Node.js Course Notes

## Episode 3: Route Handling [cite: 1, 2, 3, 4]

* **Route Priority**: Route handlers are evaluated in the order they are defined. The first matching route will handle the request.
    * If you define a broad route like `app.use("/")` before more specific routes (e.g., `/hello`, `/test`), the broad route will capture all matching requests.
    * Example:

        ```javascript
        app.use("/", (req, res) => {
          res.send("hello milani !");
        });
        app.get("/hello", (req, res) => {
          res.send("hello hello");
        });
        ```

        In this case, a request to `/hello` will be handled by the `/` route.
* **`app.use()` vs. Specific Methods**:
    * `app.use()` matches any HTTP method.
    * `app.get()`, `app.post()`, etc., match only the specified HTTP method.
* **Route Parameters**:
    * Dynamic route segments are defined with a colon (e.g., `/user/:userId`).
    * Parameters are accessed via `req.params`.
    * Query parameters are accessed via `req.query`.
    * Example:

        ```javascript
        app.get("/user/:userId", (req, res) => {
          console.log(req.params.userId); // Accessing userId parameter
          console.log(req.query); // Accessing query parameters
          res.send({ firstname: "milani" });
        });
        // URL: /user/707?name=John
        // req.params: { userId: "707" }
        // req.query: { name: "John" }
        ```
* **Route Patterns**:
    * `ab+c`: Matches "abc", "abbc", "abbbc", etc. [cite: 17]
    * `ab\*cd`: Matches "abcd", "abXcd", "abSomeRandomTextcd", etc. [cite: 17]
    * `a(bc)?d`: Matches "ad" or "abcd". The `(bc)` part is optional. [cite: 18]
    * `a(bc)+d`: Matches "abcd", "abcbcd", "abcbcbcd", etc. [cite: 18]
    * Regular expressions can be used for advanced pattern matching (e.g., `/.*fly$/`). [cite: 18]

## Episode 4: Routing and Request Handlers Summary [cite: 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 39, 40]

* **API Calls**:
    * Browsers make GET requests. [cite: 5]
    * POST requests usually require code (e.g., from a form or other application). [cite: 6]
    * APIs facilitate communication between systems. [cite: 8]
* **HTTP Methods**:
    * `GET`: Used to retrieve data. [cite: 9]
    * `POST`: Used to send data to the server to create/update a resource. [cite: 10, 19]
    * `DELETE`: Used to delete a resource. [cite: 20]
* **Request Handling Flow**:
    * Requests are matched against route handlers from top to bottom. [cite: 4]
    * The first matching handler is invoked. [cite: 4]
* **Middleware**:
    * Functions that execute during the lifecycle of a request to the Express server. [cite: 34, 35, 36, 39]
    * Can perform tasks like:
        * Logging [cite: 39]
        * Authentication [cite: 39]
        * Data modification [cite: 39]
    * `next()`: A function that passes control to the next middleware function. [cite: 30, 31, 32]
    * Route handlers are also a form of middleware, but they send the final response and typically do not call `next()`. [cite: 36]
* **Multiple Route Handlers**:
    * A single route can have multiple handlers. [cite: 27, 28, 29, 30, 31, 32, 33]
    * Use `next()` to pass control to the subsequent handler. [cite: 30, 31, 32]
    * Sending multiple responses will result in an error. [cite: 32]
* **Example of Middleware**: [cite: 36, 37, 38]

    ```javascript
    app.use((req, res, next) => {
      console.log("Middleware 1: Logging");
      next();
    });

    app.use((req, res, next) => {
      console.log("Middleware 2: Authentication");
      const isAuthenticated = true;
      if (!isAuthenticated) {
        return res.status(403).send("Access Denied");
      }
      next();
    });

    app.get("/dashboard", (req, res) => {
      console.log("Route Handler: Dashboard");
      res.send("Welcome to your dashboard!");
    });
    ```

## Episode 5: Middleware [cite: 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55]

* **Purpose of Middleware**: [cite: 43, 44, 45, 46]
    * Efficiently handle multiple requests. [cite: 43]
    * Authentication and authorization. [cite: 44]
    * Modify requests. [cite: 45]
* **Example: Authentication Middleware** [cite: 41, 42]

    ```javascript
    app.use("/admin", (req, res, next) => {
      const token = "xyz";
      const isAdminAuthorized = token == "xyz";
      if (!isAdminAuthorized) {
        return res.status(401).send("Unauthorized");
      }
      next();
    });

    app.get("/admin/getAllData", (req, res) => {
      res.send("All data");
    });
    ```

* **Organizing Middleware**: [cite: 47, 48, 49, 50, 51, 52, 53]
    * It's good practice to keep middleware in separate files (e.g., `middlewares/auth.js`).
* **Error Handling Middleware**: [cite: 56, 57, 58]
    * Special middleware with four arguments: `(err, req, res, next)`. [cite: 56]
    * Order of arguments is crucial: `(error, req, res, next)`. [cite: 56]
    * Example:

        ```javascript
        app.use("/", (error, req, res, next) => {
          if (error) {
            res.status(500).send("Something went wrong");
          }
        });

        app.get("/getuserdata", (req, res) => {
          try {
            throw new Error("DB Error");
            res.send("User data");
          } catch (err) {
            res.status(500).send("Error");
          }
        });
        ```

## Episode 6: Database, Schemas, and Models (Mongoose) [cite: 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78]

* **Mongoose**: A MongoDB object modeling tool. [cite: 70]
* **Schema**: Defines the structure of documents in a MongoDB collection. [cite: 59, 60, 69]
    * Example:

        ```javascript
        const userSchema = new mongoose.Schema({
          first_name: { type: String },
          emailId: { type: String },
          password: { type: String },
          age: { type: Number },
        });
        ```

* **Model**: A constructor compiled from a schema. Instances of a model represent MongoDB documents. [cite: 59, 60, 69]

    ```javascript
    const userModel = mongoose.model("User", userSchema);
    ```

* **Connecting to MongoDB**: [cite: 70, 71, 72, 73, 74, 75, 76, 77, 78]
    * Use `mongoose.connect()` to establish a connection. [cite: 71, 72]
    * It's recommended to wrap the connection logic in an `async` function. [cite: 71, 72]
    * Best Practice: Connect to the database before starting the server. [cite: 63, 64, 65, 66, 67, 68]
* **Creating Documents**: [cite: 60, 61, 62]
    * Use `new Model(data)` to create a new document instance. [cite: 60, 61, 62]
    * Use `document.save()` to save the document to the database. [cite: 60, 61, 62]
    * Use `await` with `save()` for asynchronous operations. [cite: 62]
* **Example: Creating a User** [cite: 63, 64, 65, 66, 67, 68]

    ```javascript
    const express = require("express");
    const connectDB = require("./config/database");
    const User = require("./models/user");
    const app = express();

    app.post("/signup", async (req, res) => {
      const user = new User({
        firstName: "Milani",
        lastName: "Nayak",
        email: "milaninayak123@gmail.com",
        password: "milaninayak123",
      });
      try {
        await user.save();
        res.send("User added");
      } catch (err) {
        res.status(400).send("Error: " + err.message);
      }
    });

    connectDB()
      .then(() => {
        console.log("DB connected");
        app.listen(7777, () => {
          console.log("Server started");
        });
      })
      .catch((err) => {
        console.log("Connection failed", err);
      });
    ```

* **Important**: [cite: 74, 75]
    * Field names in `app.js` must match the schema definitions in `user.js`. [cite: 74]
    * Wrap database operations in `try...catch` blocks for error handling. [cite: 74, 75]

## Episode 7: Diving into APIs [cite: 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88]

* **Middleware for JSON**: [cite: 78]
    * Use `app.use(express.json())` to parse incoming JSON data. [cite: 78]
* **Dynamic POST Requests**: [cite: 78, 79]
    * Access data from POST requests using `req.body`. [cite: 79]
    * Example:

        ```javascript
        app.post("/signup", async (req, res) => {
          const user = new User(req.body);
          try {
            await user.save();
            res.send("User added");
          } catch (err) {
            res.status(400).send("Error: " + err.message);
          }
        });
        ```

* **GET Requests**: [cite: 80, 81, 82, 83]
    * `User.find()`: Retrieves documents from the database. [cite: 81, 82]
        * `User.find({})` gets all users. [cite: 82]
        * `User.find({ email: useremail })` gets users with a specific email. [cite: 81]
    * `User.findById(id)`: Retrieves a document by its ID. [cite: 83]
    * `User.findOne()`: Retrieves a single document that matches the condition. [cite: 83]
* **DELETE Requests**: [cite: 84]
    * `User.findByIdAndDelete(id)`: Deletes a document by its ID. [cite: 84]
* **UPDATE Requests**: [cite: 85, 86]
    * `User.findByIdAndUpdate(id, data)`: Updates a document. [cite: 85]
    * Example:

        ```javascript
        app.patch("/user", async (req, res) => {
          const userId = req.body.userId;
          const data = req.body;
          try {
            await User.findByIdAndUpdate({ _id: userId }, data);
            res.send("User updated");
          } catch (err) {
            res.status(400).send("Error");
          }
        });
        ```

* **Important**: [cite: 86, 87]
    * MongoDB will ignore fields in the update data that are not defined in the schema. [cite: 86]
    * It is important to sanitize data. [cite: 87, 88]

## Episode 8: Data Sanitization and Schema Validation [cite: 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101]

* **Schema Validation**: [cite: 89, 90, 91, 92, 93, 94, 95]
    * Mongoose allows you to define validation rules in your schema. [cite: 89, 90, 91, 92, 93, 94, 95]
    * Example:

        ```javascript
        const userSchema = new mongoose.Schema({
          firstName: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 50,
          },
          email: {
            type: String,
            lowercase: true,
            required: true,
            unique: true,
            trim: true,
          },
          password: {
            type: String,
            required: true,
          },
          age: {
            type: Number,
            min: 18,
          },
          gender: {
            type: String,
            validate(value) {
              const validGenders = ["male", "female"];
              if (!validGenders.includes(value.toLowerCase())) {
                throw new Error(
                  `🚨 Oops! "${value}" is not a valid gender. Try "male" or "female"—or take it up with the admin!`
                );
              }
            },
          },
          photoUrl: {
            type: String,
            default:
              "[https://img.freepik.com/premium-vector/gray-avatar-icon-vector-illustration_276184-163.jpg](https://img.freepik.com/premium-vector/gray-avatar-icon-vector-illustration_276184-163.jpg)",
          },
          about: {
            type: String,
            default: "this is a default value",
          },
          skills: {
            type: [String],
          },
        });
        ```

    * To enable validation on updates, use the `runValidators: true` option in `findByIdAndUpdate()`. [cite: 93, 94]

        ```javascript
        app.patch("/user", async (req, res) => {
          const userId = req.body.userId;
          const data = req.body;
          try {
            const user = await User.findByIdAndUpdate({ _id: userId }, data, {
              runValidators: true,
            });
            res.send("User updated successfully");
          } catch (err) {
            res.status(400).send("update failed:" + err.message);
          }
        });
        ```

* **API Level Validation**:
You can validate data at the API level before sending it to the database.
* This allows you to control which fields can be updated.
* Example:

    ```javascript
    app.patch("/user/:userId", async (req, res) => {
      const userId = req.params?.userId;
      const data = req.body;
      try {
        const ALLOWED_UPDATES = [
          "photo-url",
          "about",
          "gender",
          "age",
          "skills",
        ];
        const isUpdate_Allowed = Object.keys(data).every((k) =>
          ALLOWED_UPDATES.includes(k)
        );
        if (!isUpdate_Allowed) {
          throw new Error("update not allowed");
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
          runValidators: true,
        });
        res.send("user updated successfully");
      } catch (err) {
        res.status(400).send("something went wrong:" + err.message);
      }
    });
    ```
Validator Library:
The validator npm library provides functions for data validation.

Example:

JavaScript

email: {
  type: String,
  lowercase: true,
  required: true,
  unique: true,
  trim: true,
  validate(value) {
    if (!validator.isEmail(value)) {
      throw new Error("Invalid error address: " + value);
    }
  },
},
password: {
  type: String,
  required: true,
  validate(value) {
    if (!validator.isStrongPassword(value)) {
      throw new Error("Not a strong pw. Try again!");
    }
  },
},
Episode 9: Encrypting Passwords
Password Hashing:

Store passwords in a hashed format using libraries like bcrypt.

Salting adds randomness to the hashing process.

Example:

JavaScript

const bcrypt = require("bcrypt");

app.post("/signup", async (req, res) => {
  try {
    // Validation
    validateSignupData(req);

    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10); // 10 is the salt rounds
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    res.send("User added");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
Validation Functions:

It's good practice to create utility functions for validation (e.g., in utils/validation.js).

Example:

JavaScript

const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, email, password, photoUrl } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name not valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("EMail is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Not a strong password. Try again !");
  } else if (!validator.isURL(photoUrl)) {
    throw new Error("Not a valid img link");
  }
};

module.exports = validateSignupData;
Login API:

Check if the user exists.

Compare the provided password with the stored hash using bcrypt.compare().

Example:

JavaScript

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials"); // Don't expose specific error
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("User login successful");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("something went wrong " + err.message);
  }
});
Episode 10: Authentication, Cookies, JWT Tokens
Authentication Flow:

User logs in, server verifies credentials.
Server creates a JSON Web Token (JWT) and sends it to the user.
The user stores the JWT (often in a cookie).
Subsequent requests from the user include the JWT for authentication.
Cookies:

Small pieces of data stored by the user's browser.
Used to store the JWT.
The cookie-parser middleware is used to parse cookies.
JSON Web Token (JWT):

A standard for securely transmitting information between parties as a JSON object.
Structure:
Header: Metadata about the token.
Payload: The data (claims) to be stored (e.g., user ID).
Signature: Used to verify the token's integrity.
Creating and Using JWTs:

Use the jsonwebtoken library.
jwt.sign(payload, secretKey, options) creates a JWT.
jwt.verify(token, secretKey) verifies a JWT.
Example: Login with JWT

JavaScript

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = await jwt.sign(
        { _id: user._id },
        "DEV@Tinder$3498",
        { expiresIn: "1D" } // Token expires in 1 day
      );
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // Cookie expires in 8 hours
      });
      res.send("User login successful");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
Example: Get Profile (Protected Route)

JavaScript

app.get("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    const decodedMsg = await jwt.verify(token, "DEV@Tinder$3498");
    const { _id } = decodedMsg;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("Username doesn't exist");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("error: " + err.message);
  }
});
Authentication Middleware:

Create middleware to protect routes.

This middleware verifies the JWT.

Example:

JavaScript

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid.");
    }
    const decodedObj = await jwt.verify(token, "DEV@Tinder$3498");
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user; // Attach user to request
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("error: " + err.message);
  }
});
JWT Expiration:

Set an expiration time for JWTs in the jwt.sign() options: { expiresIn: "1D" } (1 day).
Cookie Expiration:

Set an expiration time for cookies when setting them:

JavaScript

res.cookie("token", token, {
  expires: new Date(Date.now() + 8 * 3600000), // 8 hours
});
Mongoose Schema Methods:

Add custom methods to your Mongoose schema for reusable functionality.

Example: Generating a JWT

JavaScript

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id },
    "DEV@Tinder$3498",
    {
      expiresIn: "7D",
    }
  );
  return token;
};
Example: Validating Password

JavaScript

userSchema.methods.validatePassword = async function (
  passwordInputByUser
) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};
JavaScript

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("User login successful");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
Episode 11: Diving into APIs and Express Router
Express Router:
A way to organize your routes into separate files.
Create a router instance: const router = express.Router();.
Define routes on the router: router.get('/users', ...);.
Use the router in your app: app.use('/api', router);.
This helps in maintaining your code when you have many API endpoints.
const express = require("express");
const router = express.Router();

router.get("/users", (req, res) => {
  res.send("Get all users");
});

router.post("/users", (req, res) => {
  res.send("Create new user");
});

module.exports = router;

// In app.js:
const userRouter = require("./routes/user");
app.use("/api", userRouter);
API List:

GET /users: Get all users.
POST /users: Create a new user.
GET /users/:id: Get a specific user by ID.
PATCH /users/:id: Update a user by ID.
DELETE /users/:id: Delete a user by ID.
GET /posts: Get all posts.
POST /posts: Create a new post.
GET /posts/:id: Get a specific post by ID.
PATCH /posts/:id: Update a post by ID.
DELETE /posts/:id: Delete a post by ID.
POST /signup: Register a new user.
POST /login: Authenticate a user and get a token.
GET /profile: Get the logged-in user's profile.
File Structure:

- app.js
- models/
    - user.js
    - post.js
- routes/
    - user.js
    - post.js
- controllers/
    - user.js
    - post.js
- middlewares/
    - auth.js
- utils/
    - validation.js
Controllers:

It's a good practice to separate the route handling logic from the route definitions.

Controllers are used to handle the actual logic for each route.

Example:

JavaScript

// controllers/user.js
const User = require("../models/user");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = { getAllUsers, createUser };

// routes/user.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.get("/users", userController.getAllUsers);
router.post("/users", userController.createUser);

module.exports = router;
Important:

Use express.Router() to create modular route handlers.
Separate route logic into controllers for better organization.
Plan your APIs and file structure before coding.
