// db.ts

declare global {
  var DB: { currentUser: User };
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export const DB = (global.DB = {
  currentUser: {
    name: "John Smith",
  email: "jsmith@email.com",
    avatar: undefined,
  },
});

const delay = (ms: number = 80) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function getCurrentUser() {
  await delay();
  return DB.currentUser;
}

export async function updateUser(user: Partial<User>) {
  await delay();
  DB.currentUser = Object.assign({}, DB.currentUser, user);
}
