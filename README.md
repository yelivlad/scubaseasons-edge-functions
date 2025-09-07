# README.md

## Overview
This project contains **Supabase Edge Functions** written in **Deno**.  
It’s set up with:
- **Local development** (Deno CLI + VS Code)  
- **Shared utilities** in `_shared/` for reuse across functions  
- **Tests** (run locally and in CI)  
- **GitHub Actions** pipeline that:
  - Runs tests
  - Fails fast if tests fail
  - Deploys to Supabase only if tests pass  

---

## Development Setup

### 1. Install Deno ( Prerequisites if you want to run tests locally and not for each deploy ) 
We use the latest stable **Deno 1.x**.  
Download for Windows/macOS/Linux: [https://deno.land/manual/getting_started/installation](https://deno.land/manual/getting_started/installation)

On Windows (PowerShell):
```powershell
winget install denoland.deno
```

Verify:
```powershell
deno --version
```

We **pin the version** in CI. Check `.github/workflows/deploy.yml` → `deno-version` to see which one you should use locally.

---


### 2. Clone and open the repo
```bash
git clone <repo-url>
cd edge-functions
```

Open in VS Code. If you have the **Deno extension**, it will read `deno.json` and give you autocompletion.

---


### 3. Run locally
You can serve a single function locally ( *ONLY* if you are connected with supabase cli ):
```bash
supabase functions serve ping
```

Or run tests  ( no need to connect supabase cli ) :
```bash
deno task test
```

---


## Testing

- Tests live next to functions (e.g. `ping/ping.test.ts`).  
- Run all tests locally:
  ```bash
  deno task test
  ```
- Run with coverage:
  ```bash
  deno task coverage
  ```
- In CI, if **any test fails** → **deployment is blocked**.

---


## Secrets

Some secrets are stored in **GitHub → Settings → Secrets → Actions**:
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_REF`
- `...`

These are injected into the pipeline for deployments.  
Other runtime secrets (like `SUPABASE_URL`, `SUPABASE_ANON_KEY`) are set in **Supabase Dashboard → Edge Functions → Secrets**.

---

## Project Configuration

### `supabase/config.toml`
- Defines functions and options.  
- Example:
  ```toml
  [functions.ping]
  verify_jwt = false
  import_map = "./functions/ping/import_map.json"
  ```

#### About `verify_jwt`
- `verify_jwt = false` → **public function**.  
  - Anyone can call it via `https://<project>.supabase.co/functions/v1/ping`  
  - No authentication required.  
  - Good for webhooks, health checks, or public endpoints.
- `verify_jwt = true` → **protected function**.  
  - Every request must include an **Authorization header** with a **valid Supabase JWT**.  
  - Example:
    ```http
    GET /functions/v1/ping
    Authorization: Bearer <supabase-jwt>
    ```
  - Supabase will reject unauthenticated calls with `401 Unauthorized`.  
  - Useful for APIs that should only be used by logged-in users or internal systems.

---

### `supabase/functions/_shared/`
- Contains **reusable utilities** (e.g. `json.ts`).  
- Functions import them with:
  ```ts
  import { json } from "@shared/utils.ts";
  ```

### `deno.json` (root)
- Used for local dev & tests (not for deploy).  
- Defines aliases, tasks, and compiler options.  
- Example:
  ```json
  {
    "imports": { "@shared/": "./supabase/functions/_shared/" },
    "tasks": {
      "test": "deno test -A --fail-fast",
      "coverage": "deno test -A --coverage=coverage && deno coverage coverage --lcov > coverage.lcov"
    },
    "compilerOptions": { "lib": ["deno.ns", "dom"] }
  }
  ```

### `import_map.json` (per function)
- Required for deploy bundler (Supabase CLI doesn’t read root `deno.json`).  
- Example (`supabase/functions/ping/import_map.json`):
  ```json
  {
    "imports": { "@shared/": "../_shared/" }
  }
  ```

---

## Deployment

- Pipeline is hooked to the **`prod` branch**.  
- On every push to `prod`:
  1. CI runs `deno test`.  
  2. If all tests pass → deploys with `supabase functions deploy`.  
  3. If tests fail → deployment is cancelled.

---

## Coverage

When you run coverage, you can generate a nice HTML report:

```bash
deno test -A --coverage=coverage
deno coverage coverage --html coverage_html
```

Then open:
```
coverage_html/index.html
```

This shows green/red highlights for every line.  

**<img width="536" height="211" alt="image" src="https://github.com/user-attachments/assets/ddc16386-c798-4ec3-ace0-161541385150" />
**

or locally:

** <img width="321" height="85" alt="image" src="https://github.com/user-attachments/assets/17a86ddf-1771-418f-9788-b75ccdb0e291" />
 ** 
---

## Recommended workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/my-change
   ```
2. Commit changes + tests.  
3. Push and open a **Pull Request** into `prod`.  
4. CI will run tests on your PR.  
5. Once merged into `prod`, the pipeline will deploy to Supabase.

---

## Summary
- **Deno** is the runtime (latest stable).  
- **Tests** block deploys.  
- **Shared code** lives in `_shared`.  
- **Secrets** live in GitHub Actions + Supabase dashboard.  
- **Config** is split across `deno.json`, `config.toml`, and `import_map.json`.  
- **Deployment** happens automatically from `prod` branch.  
- **verify_jwt** controls whether functions are public or require authentication.  
- **Coverage** can be generated in terminal or HTML.

---
