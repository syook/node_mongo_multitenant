const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const path = require("path");

const { connectAllDb } = require("./connectionManager");

// Express app instance
const app = express();
const PORT = 9001;
app.set("port", PORT);

// helmet for security purpose
app.use(helmet());

// Logging Http Request
const log4js = require("log4js");
const appLogger = log4js.getLogger();
app.use(log4js.connectLogger(appLogger));

// CORS - To hanlde cross origin requests
const cors = require("cors");
app.use(cors());

// Parsing the body of the http
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connectAllDb();

global.appRoot = path.resolve(__dirname);

// mount the api routes
const router = require("./api/routes");
router(app);

app.listen(PORT, () => {
  console.log(`Express server started at port: ${PORT}`);
});
