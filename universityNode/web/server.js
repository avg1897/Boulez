const express = require("express");
const db = require("./src/models");
const init = require("./src/utils/init");
const bodyParser = require('body-parser')

const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
//app.use(express.urlencoded({ extended: true }));

db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome" });
});

require("./src/routes/chatbot.routes")(app);
require("./src/routes/boulez.routes")(app);

if (process.env.NODE_ENV === 'development') {
    init.crateUniDatabase().then();
}

// set port, listen for requests
const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});