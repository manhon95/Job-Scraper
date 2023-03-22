import express from "express";
import session from "express-session";
import { Request, Response } from "express";
import path from "path";
import { print } from "listening-on";
import { User, UserSQLDb } from "./userSQL";

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

export class AppComponent {
  public readonly app = express();
  private readonly port = 8000;

  constructor(private readonly userDb: UserSQLDb) {}
  /* -------------------------------------------------------------------------- */
  /*                                 Middleware                                 */
  /* -------------------------------------------------------------------------- */
  addMiddleware() {
    this.app.use(express.static("Public"));
    this.app.use(express.json());
    this.app.use(express.urlencoded());
    /* --------------------------------- Session -------------------------------- */
    this.app.use(
      session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        // cookie: { secure: true },
      })
    );
  }
  /* -------------------------------------------------------------------------- */
  /*                                   Method                                   */
  /* -------------------------------------------------------------------------- */
  addMethod() {
    /* -------------------------------- Main page ------------------------------- */
    this.app.get("/", (req: Request, res: Response) => {
      res.sendFile(path.resolve("Public", "index.html"));
    });
    /* ------------------------------- Login page ------------------------------- */
    this.app.get("/login", (req: Request, res: Response) => {
      console.log(req.session);
      console.log(req.session.user);
      if (req.session.user) {
        res.redirect("/");
        return;
      }
      res.sendFile(path.resolve("Public", "login.html"));
    });
    /* ------------------------------ Login handle ------------------------------ */
    this.app.post("/login", async (req: Request, res: Response) => {
      try {
        req.session.user = await this.userDb.login(
          req.body.username,
          req.body.pass
        );
        console.log("req.session.user", req.session.user);
        res.status(200);
        req.session.save();
        res.send(`Login as ${req.session.user.username}`);
      } catch (err) {
        res.status(401).send("401 Unauthorized");
      }
    });
    /* ------------------------------- Create user ------------------------------ */
    this.app.post("/user", async (req: Request, res: Response) => {
      let formData: User = req.body;
      if (formData.username.length == 0 || formData.pass.length < 8) {
        res.status(400);
        res.send("400 Bad username or password");
      }
      formData.id = "0";
      try {
        console.log(formData);
        await this.userDb.createUser(formData);
      } catch (error) {
        res.status(400).send(error);
        return;
      }
      res.status(201).send(`${formData.username} created successfully`);
    });
    /* ------------------------------- Update user ------------------------------ */
    this.app.put("/user", async (req: Request, res: Response) => {
      await this.userDb.updateUser(req.body);
      try {
      } catch (error) {
        res.status(400).send(error);
      }
      res.status(200).send(`${req.body.username} update successfully`);
    });
    /* ------------------------------- Delete user ------------------------------ */
    this.app.delete("/user", async (req: Request, res: Response) => {
      try {
        await this.userDb.deleteUser(req.body);
      } catch (error) {
        res.status(400).send(error);
        return;
      }
      res.status(200).send(`${req.body.username} delete successfully`);
    });

    /* ----------------------------- Error handling ----------------------------- */
    this.app.use((req: Request, res: Response) => {
      res.redirect("/");
    });
  }
  /* -------------------------------------------------------------------------- */
  /*                                 Run server                                 */
  /* -------------------------------------------------------------------------- */
  run() {
    this.app.listen(this.port, () => {
      print(this.port);
    });
  }
}
