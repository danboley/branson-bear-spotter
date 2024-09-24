const multer = require("multer");
const path = require("path");
const bucket = require("../config/googleCloudStorage");

// Set up multer storage (in-memory buffer)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|heic|heif/;
    const extname = filetypes.test(file.originalname.toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  },
}).single("imagePath");

// Helper function to upload image to Google Cloud Storage
const uploadImageToGCS = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject("No file provided");
    }

    const blob = bucket.file(Date.now() + "-" + file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    blobStream.on("error", (err) => {
      reject(err);
    });

    blobStream.on("finish", () => {
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

module.exports = { upload, uploadImageToGCS };
