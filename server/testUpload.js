const bucket = require("./config/googleCloudStorage"); // Adjust the path if necessary

async function testUpload() {
  const fileName = "test-file.txt";
  const fileContent = "This is a test upload to Google Cloud Storage!";
  const file = bucket.file(fileName);

  try {
    await file.save(fileContent);
    console.log("File uploaded successfully.");
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

testUpload();
