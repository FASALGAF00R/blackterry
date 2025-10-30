const multer = require("multer")
const path = require("path");
const fs = require("fs");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderpath = path.join(__dirname, '../uploads');

         if (!fs.existsSync(folderpath)) {
      fs.mkdirSync(folderpath, { recursive: true });
    }

    cb(null, folderpath);

    },
    filename: function (req, file, cb) {
        console.log(file);
    const name = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
        cb(null, name)
    }
});


const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// required type
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, JPG, PDF, and DOC/DOCX are allowed."), false);
  }
};

// file size
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});



module.exports = upload;