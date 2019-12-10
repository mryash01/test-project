# test-project

Simple Document which stores a certain web application backend regularly generates and store reports (can be pdf,doc, txt etc.).

Use different API endpoints to upload documents to S3 or filesystem.

How to use this repo-
1. Initialize with - npm init
2. Run - npm install
3. Run the server using - npm start

Upload to filesystem -
localhost:3000/api/file

Get list of filesystem -
localhost:3000/systemfiles

Upload to S3 -
localhost:3000/upload

Get list of S3 -
localhost:3000/lists3

NOTE :- Postman collection file attached.