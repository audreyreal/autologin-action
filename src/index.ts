import * as core from "@actions/core";
import * as httpm from "@actions/http-client";
import PQueue from "p-queue";

const userAgent = core.getInput("user_agent");
const credentials = JSON.parse(core.getInput("credentials"));

const http = new httpm.HttpClient(userAgent);

const queue = new PQueue({
  concurrency: 1,
  interval: 1000, // milliseconds
  intervalCap: 1,
  carryoverConcurrencyCount: true,
});

type Auth = {
  pin?: string;
  password?: string;
  autologin?: string;
};

async function ping(nation: string, { password, pin, autologin }: Auth) {
  queue.add(async () => {
    core.debug(`${performance.now()}\tping start: ${nation}`);
    const response = await http.get(
      `https://www.nationstates.net/cgi-bin/api.cgi?nation=${nation}&q=ping`,
      {
        ...(password && { "X-Password": password }),
        ...(pin && { "X-Pin": pin }),
        ...(autologin && { "X-Autologin": autologin }),
      }
    );
    const body = await response.readBody();
    core.debug(`${performance.now()}\tping end: ${nation}`);
    return body;
  });
}

function isValidAuth(auth: unknown): auth is Auth {
  if (!auth) return false;
  if (typeof auth !== "object") return false;

  return "password" in auth || "pin" in auth || "autologin" in auth;
}

for (const [nation, auth] of Object.entries(credentials)) {
  if (isValidAuth(auth)) {
    await ping(nation, auth);
  }
}
