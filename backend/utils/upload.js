const multer = require("multer");
const path = require("path");

// Storage location and filename formatting
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/payments"); // Folder to store images
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_")
    );
  },
});

// File filter (optional - only images allowed)
const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpg", "image/jpeg"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG/JPG/JPEG files allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
