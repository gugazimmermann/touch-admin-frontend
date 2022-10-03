# Login and Profile

Live: <https://admin.touchsistemas.com.br>

## Tech Used

React / TypeScript / Tailwind

### How to build

IMPORTANT NOTE: `./amplify` was added to `.gitignore`, this way every new build need to init and import auth, and also add hosting.

* Build <https://github.com/gugazimmermann/touch-admin>
* run `npm install` to install dependencies packages
* create `.env` file as `.env.sample`, use the output from the backend
* `amplify init` to import Cognito and Hosting
* `amplify import auth` and choose **Cognito User Pool and Identity Pool**, select the created userPool from the backend output;
* `amplify import storage` and choose the bucket Logo and Maps bucket from the backend output
* run `amplify push`
* run `npm start` to run the react app

## How to Deploy

* run `amplify add hosting` and select **Amazon CloudFront and S3** and **PROD (S3 with CloudFront using HTTPS**
* run `amplify push`
* run `amplify publish`

The output will be similar to this one:

```bash
Your app is published successfully.
https://d113tyd56o48tz.cloudfront.net
```

Pay attention that in the backend we need to modify the CORS to accept this domain, and not only the localhost.

We can also change the CloudFormation to work with Route43 and add a custom domain, in my case is <https://admin.touchsistemas.com.br>
