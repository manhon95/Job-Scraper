import express from "express";
import { Request, Response } from "express";
import path from "path";
import { print } from "listening-on";
import { createUser, User } from "./user";

export class AppComponent {
  public readonly app = express();
  private readonly port = 8000;

  addMiddleware() {
    this.app.use(express.static("Public"));
    this.app.use(express.json());
    this.app.use(express.urlencoded());
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
      let formData: User = req.body;
      if (formData.username.length == 0 || formData.pass.length < 8) {
        res.status(400);
        res.send("400 Bad username or password");
      }
    });
    this.app.post("/user", async (req: Request, res: Response) => {
      let formData: User = req.body;
      if (formData.username.length == 0 || formData.pass.length < 8) {
        res.status(400);
        res.send("400 Bad username or password");
      }
      try {
        await createUser(formData);
      } catch (error) {
        res.status(400);
        res.send(error);
      }
      res.send(`${formData.username} created successfully`);
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
