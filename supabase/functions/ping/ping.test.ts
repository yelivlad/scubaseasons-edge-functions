import { handler } from "./index.ts";

Deno.test("ping returns ok", async () => {
  const req = new Request("http://localhost/ping?name=Vlad");
  const res = await handler(req);
  if (res.status !== 200) throw new Error("expected 200");

  const body = await res.json();
  if (!body.ok && !body.data) {
    throw new Error("expected ok response");
  }
});
