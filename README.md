# Login and Profile

## Tech Used

React / TypeScript / Tailwind

### How to build

IMPORTANT NOTE: `./amplify` was added to `.gitignore`, this way every new build need to init and import auth, and also add hosting.

* Build <https://github.com/gugazimmermann/touch-admin>
* run `npm install` to install dependencies packages
* create `.env` file as `.env.sample`, use the output from the backend
* `amplify init` to import Cognito and Hosting
* `amplify import auth` and choose **Cognito User Pool only**, select the created userPool from the backend output;
* run `amplify push` to import the cognito info
* run `npm start` to run the react app
