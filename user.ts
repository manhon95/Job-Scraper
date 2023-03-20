import fs from "fs/promises";

const filePath = "users.json";

export type User = {
  username: string;
  pass: string;
};

export async function createUser(user: User): Promise<void> {
  try {
    let userArr = await loadUser();
    if (!(user.username in userArr.map((user) => user.username))) {
      userArr.push(user);
    } else {
      throw new Error("User already exists");
    }
    await fs.writeFile(filePath, JSON.stringify(userArr));
    return;
  } catch (error) {
    throw error;
  }
}

async function loadUser(): Promise<User[]> {
  try {
    await fs.access(filePath, fs.constants.F_OK);
  } catch (error) {
    await fs.writeFile(filePath, JSON.stringify([]));
  }
  try {
    let content = await fs.readFile(filePath);
    return JSON.parse(String(content));
  } catch (error) {
    throw error;
  }
}
