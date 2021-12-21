import adminsRoute from "./admins.routes.js";
import authsRoute from "./auths.route.js";
import usersRoute from "./users.route.js";

const routes = (express) => {
  express.use("/auth", authsRoute);
  express.use("/users", usersRoute);
};

export default routes;
