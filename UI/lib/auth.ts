// Logout / auth side-effects
export async function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // optional delay
  await new Promise((r) => setTimeout(r, 500));
}
