import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import sessionStore from "connect-session-sequelize";

import routes from "./routes/index.js";
import sequelize from "./app/configs/sequelize.js";
import logger from "./app/configs/logger.js";
import { notFound, handleError } from "./middlewares/handlerError.js";

const SequelizeStore = sessionStore(session.Store);

const app = express();

// Middlewares
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  session({
    secret: "r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
    store: new SequelizeStore({
      db: sequelize,
    }),
  })
);

// Connection
sequelize.sync().then(async () => {
  logger.info("Connection has been established successfully.");
});

// Routes
routes(app);

// Handler Error
app.use(notFound);
app.use(handleError);

// Crons

const PORT = process.env.PORT || 1234;

app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
