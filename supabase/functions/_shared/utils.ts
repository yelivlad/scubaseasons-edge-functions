/**
 * Helper to return JSON responses
  * @param data - The data to be serialized to JSON
  * @param status - The HTTP status code (default: 200)
  * @param extra - Additional headers to include in the response
  * @returns A Response object with the JSON data and appropriate headers
  * @example
  * ```ts
  * return json({ message: "Hello, world!" });
  * ```
  * @example
  * ```ts
  * return json({ error: "Not found" }, 404);
  * ```
  * @example
  * ```ts
  * return json({ message: "Hello, world!" }, 200, { "x-custom-header": "value" });
  * ```
 */

export const json = (data: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...extra }
  });