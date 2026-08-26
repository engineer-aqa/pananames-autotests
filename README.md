# Pananames UI autotests

End-to-end tests for the Pananames control panel (`mcp.pananames-dev.com`), written with Playwright and TypeScript.

## Requirements

- Node.js 20 or newer (Playwright 1.62 does not run on Node 18; the version is pinned in `.nvmrc`)
- npm 9+

## Installation

```bash
nvm use            # optional, picks the Node version from .nvmrc
npm ci
npx playwright install chromium
```

## Configuration

Copy the example file and fill in the credentials you were given:

```bash
cp .env.example .env
```

```
BASE_URL=https://mcp.pananames-dev.com
USER_EMAIL=your.account@example.com
USER_PASSWORD='your-password'
```

Wrap the password in single quotes if it contains `#`, `$` or other special characters: without quotes
everything after `#` is treated as a comment and the password silently gets truncated.

`.env` is gitignored and never committed.

## Running the tests

```bash
npm test                 # the whole suite
npm run test:contacts    # contacts scenarios only
npm run test:domains     # domain cart scenarios only
npm run test:headed      # with a visible browser
npm run report           # open the HTML report of the last run
```

Single test or suite:

```bash
npx playwright test -g "Verify creating a new contact"
npx playwright test --grep @contacts     # suite tags: @contacts, @domains
```

## CI

Two GitHub Actions workflows:

- **Code quality** runs on every pull request: ESLint, Prettier and the TypeScript compiler.
- **Playwright tests** runs on every pull request, and can be started manually with a choice of suite
  (all, contacts, domains). The account comes from the repository secrets `USER_EMAIL` and
  `USER_PASSWORD`, the environment from the `BASE_URL` variable. The HTML report is uploaded as an
  artifact.

## Code quality

```bash
npm run lint         # ESLint
npm run lint:fix     # ESLint with autofix
npm run typecheck    # tsc --noEmit
npm run format       # Prettier
```

## Project structure

```
src/
  api/
    clients/          transport-level HTTP client (verbs, headers, status validation)
    services/         one service per API area, built on top of the client
    constants/        API endpoints
    types/            request and response types
  common/
    constants/        routes, storage keys
    data/test-data/   environment config and test data builders
    types/            shared types
    utils/            pure helpers (price parsing, auth storage mapping)
  ui/
    pages/            page objects, components and UI constants
    types/            UI-level types
tests/
  fixtures/           Playwright fixtures (pages, services, user)
  specs/ui/           specs grouped by area
```

## How authentication works

Tests do not drive the login form. `loginPage.loginViaApi(user)` logs in through the API and hands the
session to the browser context of the current test:

1. `POST /api/auth/login` returns the session cookie.
2. `GET /api/user/get` provides the profile, which is mapped to the `auth.*` values the application keeps
   in localStorage - its router decides whether the visitor is signed in by those values, so cookies alone
   are not enough.
3. Cookies go to the context directly, the `auth.*` values through an init script, so that they are in
   place before the application boots.

The application accepts only a few logins per minute, so the session is obtained once per worker and every
test reuses it. A rejected login still answers with HTTP 200, therefore the response payload is checked
explicitly and the test fails with the message returned by the server.

## Conventions

- Page Object Model: pages and components expose actions and `assert*` methods, specs never call `expect`
  directly and never build locators.
- No magic strings: all UI texts, routes and endpoints live in constants.
- Types are declared in `*.types.ts` files: `interface` for object shapes, `type` for unions.
- Files and folders are named in kebab-case, classes in PascalCase.
- Tests are independent: each one prepares its own data through the API and cleans it up afterwards.

## Notes about the application

A few behaviours worth knowing when reading the tests:

- Zones such as `.net` show a registration notice that has to be accepted before the domain is added to
  the cart; `.com` and `.org` do not.
- Promo rows in the search results show the crossed out price first and the actual one second, so the last
  price in a row is the one the customer pays.
- The cart and the contact list are shared state of a single account, so the suite runs in one worker.
