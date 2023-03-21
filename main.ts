import { UserSQLDb } from "./userSQL";
import { AppComponent } from "./app";
import dotenv from "dotenv";

dotenv.config();

if (process.env.DB_NAME == undefined) {
  throw new Error();
}
if (process.env.DB_USERNAME == undefined) {
  throw new Error();
}
if (process.env.DB_PASS == undefined) {
  throw new Error();
}
const db = new UserSQLDb(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASS
);

const app = new AppComponent(db);

app.addMiddleware();
app.addMethod();
app.run();
