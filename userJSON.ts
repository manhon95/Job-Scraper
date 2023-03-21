import pfs from "fs/promises";
import fs from "fs";

export type User = {
  uid: string;
  username: string;
  pass: string;
};

export class UserJSONDb {
  uidCount: number;
  userArr: User[];
  constructor(private readonly filePath: string) {
    try {
      let content = fs.readFileSync(this.filePath);
      this.userArr = JSON.parse(String(content));
      this.uidCount = Math.max(
        ...this.userArr.map((user) => parseInt(user.uid))
      );
    } catch (error) {
      this.userArr = [];
      this.uidCount = 1;
    }
  }

  async createUser(newUser: User): Promise<void> {
    if (!(newUser.username in this.userArr.map((user) => user.username))) {
      newUser.uid = this.uidCount.toString();
      this.uidCount++;
      this.userArr.push(newUser);
    } else {
      throw new Error("Username already exists");
    }
    await pfs.writeFile(this.filePath, JSON.stringify(this.userArr));
    return;
  }

  getUserById(uid: string): User {
    return this.userArr.filter((user) => user.uid === uid)[0];
  }

  getUserByName(username: string): User {
    return this.userArr.filter((user) => user.username === username)[0];
  }

  async updateUser(newUserInfo: User): Promise<void> {
    let oldUserIndex = this.getUserIndex(newUserInfo.uid);
    if (oldUserIndex !== -1) {
      this.userArr[oldUserIndex] = newUserInfo;
    } else {
      throw new Error("User not exists");
    }
    await pfs.writeFile(this.filePath, JSON.stringify(this.userArr));
    return;
  }

  async deleteUser(oldUser: User): Promise<void> {
    let oldUserIndex = this.getUserIndex(oldUser.uid);
    if (oldUserIndex !== -1) {
      this.userArr.splice(oldUserIndex, 1);
    } else {
      throw new Error("User not exists");
    }
    await pfs.writeFile(this.filePath, JSON.stringify(this.userArr));
    return;
  }

  private getUserIndex(uid: string): number {
    return this.userArr.findIndex((user) => user.uid === uid);
  }

  isAuthenticated(inputUsername, inputPass): boolean {
    return this.getUserByName(inputUsername).pass === inputPass;
  }
}
