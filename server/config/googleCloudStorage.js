const { Storage } = require("@google-cloud/storage");
const path = require("path");

// Path to your service account key JSON file
const keyFilename = path.join(__dirname, "reference-point-436118-q9-a4218ce7272c.json");

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename, 
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

// Set up a bucket reference
const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

module.exports = bucket;