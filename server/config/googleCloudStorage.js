const { Storage } = require("@google-cloud/storage");
const path = require("path");
require("dotenv").config();

// Decode base64 service account key if running in production
let keyFileContents;
if (process.env.NODE_ENV === "production") {
  if (process.env.GOOGLE_CLOUD_KEYFILE_BASE64) {
    keyFileContents = Buffer.from(
      process.env.GOOGLE_CLOUD_KEYFILE_BASE64,
      "base64"
    ).toString("utf8");
  } else {
    throw new Error(
      "Missing GOOGLE_CLOUD_KEYFILE_BASE64 in production environment"
    );
  }
} else {
  try {
    keyFileContents = require(path.join(
      __dirname,
      "reference-point-436118-q9-a4218ce7272c.json"
    ));
  } catch (error) {
    throw new Error("Could not load service account JSON file in development");
  }
}

// Initialize Google Cloud Storage
const storage = new Storage({
  credentials:
    process.env.NODE_ENV === "production"
      ? JSON.parse(keyFileContents)
      : keyFileContents,
  projectId:
    process.env.GOOGLE_CLOUD_PROJECT_ID || "your-google-cloud-project-id",
});

// Set up a bucket reference
const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
if (!bucketName) {
  throw new Error(
    "Bucket name is not set. Please ensure GOOGLE_CLOUD_BUCKET_NAME is in your .env file."
  );
}
const bucket = storage.bucket(bucketName);

module.exports = bucket;
