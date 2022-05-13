const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3 } = require('../lib/aws');
const { v4:uuid } = require('uuid');
const mime = require("mime-types");
let idTomulterS3;

const storageCover = multerS3({
  s3,
  bucket: "bkksg-images",
  key: (req, file, cb) => {
    let _id;
    console.log('정보추출:',req.body);
    if(req.body.img_id) _id  = `raw/${req.body.img_id}`;
    else {
      _id = `raw/${uuid()}.${mime.extension(file.mimetype)}`;
      idTomulterS3 = _id;
    }
    cb(null, _id); 
  }
})

const uploadCoverTool = multer({ storage: storageCover,
                                fileFilter : (req, file, cb) =>{
                                  if(['image/png', 'image/jpeg', 'image/jpg', 'image/gif'].includes(file.mimetype)) cb(null, true)
                                  else cb(new Error("Invalid file type."),false)
                                },
                                limits:{
                                  fileSize: 1024 * 1024 * 5,
                                }
                                })
const contentController = require("./content_controller");
router.get("/", contentController.contentList);
router.get("/read", contentController.read);
router.get("/getType", contentController.getTypeContent);
router.post("/create_process", uploadCoverTool.single('coverImg'),
(req, res, next) => {contentController.create(req,res,idTomulterS3)});
router.post("/update_process",uploadCoverTool.single('coverImg'),contentController.update)
router.post("/delete_process",contentController.delete)

module.exports = router