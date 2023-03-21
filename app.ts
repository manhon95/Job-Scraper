import express from "express";
import session from "express-session";
import { Request, Response } from "express";
import path from "path";
import { print } from "listening-on";
import { User, UserDb } from "./userJSON";

export class AppComponent {
  public readonly app = express();
  private readonly port = 8000;

  constructor(private readonly userDb: UserDb) {}

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
        cookie: { secure: true },
      })
    );
  }

  addMethod() {
    //Main page
    this.app.get("/", (req: Request, res: Response) => {
      res.sendFile(path.resolve("Public", "index.html"));
    });
    //Login page
    this.app.get("/Login", (req: Request, res: Response) => {
      res.sendFile(path.resolve("Public", "login.html"));
    });

    this.app.post("/Login", (req: Request, res: Response) => {
      if (this.userDb.isAuthenticated(req.body.username, req.body.pass)) {
        res.status(401).send("401 Unauthorized");
      }
    });

    this.app.post("/user", async (req: Request, res: Response) => {
      let formData: User = req.body;
      if (formData.username.length == 0 || formData.pass.length < 8) {
        res.status(400);
        res.send("400 Bad username or password");
      }
      formData.uid = "0";
      try {
        await this.userDb.createUser(formData);
      } catch (error) {
        res.status(400).send(error);
      }
      res.status(201).send(`${formData.username} created successfully`);
    });

    this.app.put("/user", async (req: Request, res: Response) => {
      try {
        await this.userDb.updateUser(req.body);
      } catch (error) {
        res.status(400).send(error);
      }
      res.status(200).send(`${req.body.username} update successfully`);
    });

    this.app.delete("/user", async (req: Request, res: Response) => {
      try {
        await this.userDb.deleteUser(req.body);
      } catch (error) {
        res.status(400).send(error);
      }
      res.status(200).send(`${req.body.username} delete successfully`);
    });

    //Error handling
    this.app.use((req: Request, res: Response) => {
      res.redirect("/");
    });
  }

  run() {
    this.app.listen(this.port, () => {
      print(this.port);
    });
  }
}
