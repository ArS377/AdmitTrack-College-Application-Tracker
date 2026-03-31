export function ServerError({ error }) {
  let errorMessage = null;
  if (error.code === "ECONNREFUSED") {
    errorMessage =
      "❌ Connection refused: The server is down or not reachable.";
  } else if (error.code === "ENOTFOUND") {
    errorMessage = "❌ DNS error: The server address could not be found.";
  } else if (error.message.includes("Network Error")) {
    errorMessage = "❌ General network error: Check your connection.";
  }
  if (errorMessage) console.error(errorMessage);
  return errorMessage && <h2>{errorMessage}</h2>;
}
