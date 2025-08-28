// UserStore.js
let user = { name: "", email: "" };

export function setUser(newUser) {
  user = newUser;
}

export function getUser() {
  return user;
}
