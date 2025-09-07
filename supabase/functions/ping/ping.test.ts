import { handler } from "./index.ts";

Deno.test("ping returns ok", async () => {
  const req = new Request("http://localhost/ping?name=Vlad");
  const res = await handler(req);

  if (res.status !== 200) throw new Error(`expected 200, got ${res.status}`);

  const body = await res.json();

  if (body.ok !== true) {
    throw new Error(`expected ok=true, got ${JSON.stringify(body)}`);
  }

  // When no DB env vars → dbStatus should be "skipped"
  if (body.dbStatus !== "skipped") {
    throw new Error(`expected dbStatus=skipped, got ${body.dbStatus}`);
  }
});
