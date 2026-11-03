import { fileURLToPath } from "node:url";
import { createAppServer } from "./app-server.mjs";

const apiOrigin = process.env.API_ORIGIN;
if (!apiOrigin) throw new Error("API_ORIGIN is required, e.g. http://api.railway.internal:3000 or the API's public https URL");

const port = Number(process.env.PORT ?? 8080);
const distDir = fileURLToPath(new URL("../dist", import.meta.url));
createAppServer({ distDir, apiOrigin }).listen(port, "0.0.0.0", () => {
  console.log(JSON.stringify({ level: "info", msg: "app server listening", port, apiOrigin }));
});
