import multer from 'multer';

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        '_' +
        Math.floor(Math.random) * 10000 +
        '_' +
        file.originalname
    );
  },
});

//export multer middleware
export const userMulter = multer({ storage }).single('image');
