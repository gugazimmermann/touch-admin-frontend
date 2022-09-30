# Login and Profile

Live: <https://d1aewi60iom71h.cloudfront.net>

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

## How to Deploy

* run `amplify add hosting` and select **Amazon CloudFront and S3** and **PROD (S3 with CloudFront using HTTPS**
* run `amplify push`
* run `amplify publish`

The output will be similar to this one:

```bash
Your app is published successfully.
https://d1aewi60iom71h.cloudfront.net
```

Pay attention that in the backend we need to modify the CORS to accept this domain, and not only the localhost
