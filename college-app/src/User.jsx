// UserStore.js
let user = { name: "", email: "", accessToken: undefined };

export function setUser(newUser) {
  user = newUser;
  console.log("setUser accessToken:", user.accessToken);
}

export function getUser() {
  console.log("getUser accessToken:", user.accessToken);
  return user;
}
