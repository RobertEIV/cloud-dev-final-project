# Architecture Bucket List Serverless Project

This project is a serverless application that allows users to store a bucket list of architectural projects they would like to visit!

# Functionality of the application

This application will allow creating/removing/updating/fetching entry items. Each entry item can optionally have an attachment image. Each user only has access to entry items that he/she/they has created.

# entry items

The application should store entry items, and each entry item contains the following fields:

* `entryId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of an entry item (e.g. "Tower of The Winds")
* `entryDate` (string) - date and time by which an item is uploaded/last edited
* `location` (string) - location of the architectural project
*  `architect` (string) - architect(s)/creator(s) of the project
* `done` (boolean) - true if an entry was visted, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to an entry item

## Prerequisites

* <a href="https://manage.auth0.com/" target="_blank">Auth0 account</a>
* <a href="https://github.com" target="_blank">GitHub account</a>
* <a href="https://nodejs.org/en/download/package-manager/" target="_blank">NodeJS</a> version up to 12.xx 
* Serverless 
   * Create a <a href="https://dashboard.serverless.com/" target="_blank">Serverless account</a> user
   * Install the Serverless Framework’s CLI  (up to VERSION=2.21.1). Refer to the <a href="https://www.serverless.com/framework/docs/getting-started/" target="_blank">official documentation</a> for more help.
   ```bash
   npm install -g serverless@2.21.1
   serverless --version
   ```
   * Login and configure serverless to use the AWS credentials 
   ```bash
   # Login to your dashboard from the CLI. It will ask to open your browser and finish the process.
   serverless login
   # Configure serverless to use the AWS credentials to deploy the application
   # You need to have a pair of Access key (YOUR_ACCESS_KEY_ID and YOUR_SECRET_KEY) of an IAM user with Admin access permissions
   sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless
   ```
   
# Data Example

```json
{
  "items": [
    {
      "entryId": "123",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "Tower of The Winds",
      "location": "Yokohama, Japan",
      "architect": "Toyo Ito",
      "entryDate": "2019-07-29T20:01:45.424Z",
      "done": false,
      "attachmentUrl": "http://example.com/image.png"
    },
    {
      "entryId": "456",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "Fallingwater",
      "location": "Mill Run, Pennsylvania",
      "architect": "Frank Lloyd Wright",
      "entryDate": "2019-07-29T20:01:45.424Z",
      "done": true,
      "attachmentUrl": "http://example.com/image.png"
    },
  ]
}
```

# Code Configuration

If deploying and running, the below variables should be updated in the frontend with API Gateway apiId and OAuth domain and clientId. In addition, JWT file in backend will also need to be updated with proper url to get keys for authorization.

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless entry application.

## Citations

Image used in frontend is from https://inhabitat.com/wp-content/blogs.dir/1/files/2016/10/Heydar-Aliyev-Centre-ead.jpg.

Base code is from course-04 project in https://github.com/udacity/cloud-developer repository with modifications from my serverless project submission in https://github.com/RobertEIV/cloud-developer repository.
