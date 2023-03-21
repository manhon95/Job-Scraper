import { Client, QueryResult } from "pg";

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
    console.log(newUser.username);
    console.log(newUser.pass);
    await this.client.query(
      'insert into "users" (username, pass) values ($1, $2)',
      [newUser.username, newUser.pass]
    );
  }

  async getUserById(uid: string): Promise<User> {
    let result: QueryResult = await this.client.query(
      'select * from "users" where id = $1',
      [uid]
    );
    const user = result.rows[0];
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getUserByName(username: string): Promise<User> {
    let result: QueryResult = await this.client.query(
      'select * from "users" where username = $1',
      [username]
    );
    const user = result.rows[0];
    if (!user) {
      throw new Error("User not found");
    }
    return user;
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

  async login(inputUsername: string, inputPass: string): Promise<User> {
    let user: User = await this.getUserByName(inputUsername);
    if (user.pass === inputPass) {
      return user;
    } else {
      throw new Error("Invalid password");
    }
  }
}
