# Artefacts

## Prerequisites

Download the tokens folder (project secrets) from https://drive.google.com/drive/folders/1SPkW17YsGNG68zT5oca3Rwfvs93kOL6-?usp=drive_link and place it in the root of the project.

tokens/.env should contain. (AWS settings for bedrock/AI)

```
MYSQL_ROOT_PASSWORD=******
MYSQL_DATABASE=WritingAnalytics
JWT_SECRET_KEY=******
# next two enable hot reloading
GUNICORN_CMD_ARGS="--reload"
CONFIGURATION=DEV
AWS_ACCESS_KEY_ID = XXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY = XXXXXXXXXXXXXXXXXXX

```

## Install private packages

create a .npmrc file in the root of the WEB project with the following content (get your GitHub PAT from text with permissions for repo, read:packages and write:packages) (there is a copy in the google tokesn folder):

```
@srlstars:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=GITHUB_PAT_TOKEN
```

Then run:

```
cd web
npm install
```

## Launch the service

For local development (with hot reloading)

`docker compose up`

`docker compose down && docker compose up`

in separate shell

`cd web`
`npm run dev`

For production

`CONFIGURATION=PROD docker compose up`

## Run the service in prod

This action is triggered by a push to the main branch. The service is deployed to compucore.itcarlow.ie.

https://github.com/itcOnlineGaming/artefacts/actions/workflows/deploy.yml

## login with test user

On localhost you can login with the test user with arbitrary name & role
(TODO: at the moment this will not overwrite the existing user, so you may need to delete the user cookie first or use incognito mode in the browser):
PORT is whatever flask app is on

```

http://localhost:8062/__dev_login?email=test@example.com&display_name=Dr%20Test%20User&role=admin

```

# Testing

## Run python tests

Run with alternate DB (e.g. clean for testing)

```
`MYSQL_DATABASE=test_db docker compose up`

```

From root, run: `pytest`

or `ptw` (for hot retesting, requires `pip install pytest-watch`)

## Run playwright test

### To run all tests

```cd web
npx playwright test #all tests
```

### To run a specific test

```
npx playwright test tests/devLogin.test.js --headed #to run a specific test with browser visible
```

## Troubleshooting playwright tests

### Error report

An error report is generated in the `web/tests/reports` folder. It contains error-context.md and screenshots where
the error(s) occurred.

### To slow down a test

```
PWDEBUG=1 SLOWMO=1000 npx playwright test tests/e2e.test.js
```

This turns slow motion and headed on (see the playwright.config.js) 1000ms is 1 second delay per step.

### To record a test

```
npx playwright codegen http://localhost:4173/
```

### Step through a test

If you want to step through a test line by line, you can do it in the playwright inspector, like this:

```

PWDEBUG=1 npx playwright test tests/createBriefSubmitArtefact.test.js

```

## Writing e2e tests

Issue 1: finding the element id

Finding by ID is not recommended in Playwright, so we should use other selectors where possible. Use getByRole
or getByLabelText instead of getByTestId.

Some of the elements in the svelte components don't have ids so can't be searched. Also trying to give them ids is not
necessarily straight forward. For example in the brief description component, the element is created by EasyMDE. And
EasyMDE hides the <textarea> and inserts the CodeMirror editor in its place,
which is why the element with id="brief-description" is not visible after initialization.
For now have resorted to using the hint text in the test to find the element. Need a better solution.

To record the selector of an element, you can use the Playwright Inspector (PWDEBUG=1) and right click on the element
and select "Copy selector".

OR run codegen to record all selectors in UI flow (URL creates a new user and goes to the home page with user token in query string):

```
npx playwright codegen http://localhost:5002/stars/api/__dev_login?redirect=http://localhost:5002/stars/
```

## Possible problems

SSL error on docker build? May be a corporate firewall problem. Try this in PythonDockerfile:

`RUN pip install --trusted-host pypi.python.org --trusted-host files.pythonhosted.org --trusted-host pypi.org -r requirements.txt`

```

```
