import pfs from "fs/promises";
import fs from "fs";
import { Client } from "pg";

export type User = {
  id: string;
  username: string;
  pass: string;
};

export class UserSQLDb {
  private client;
  constructor(
    private readonly db: string,
    private readonly dbUser: string,
    private readonly dbPass: string
  ) {
    this.client = new Client({
      database: db,
      user: dbUser,
      password: dbPass,
    });
    this.client.connect();
  }

  async createUser(newUser: User): Promise<void> {
    await this.client.query(
      'insert into "users" (username, pass) values ($1, $2)',
      [newUser.username, newUser.pass]
    );
  }

  async getUserById(uid: string): Promise<User> {
    return await this.client.query('select * from "users" where id = $1', [
      uid,
    ])[0];
  }

  async getUserByName(username: string): Promise<User> {
    return await this.client.query(
      'select * from "users" where username = $1',
      [username]
    )[0];
  }

  async updateUser(newUserInfo: User): Promise<void> {
    await this.client.query(
      'update "users" set username = $1, pass = $2 where id = $3',
      [newUserInfo.username, newUserInfo.pass, newUserInfo.id]
    );
  }

  async deleteUser(oldUser: User): Promise<void> {
    await this.client.query('delete from "users" where id = $1', [oldUser.id]);
  }
}
