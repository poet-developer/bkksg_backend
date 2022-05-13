require("dotenv").config();
const aws = require("aws-sdk");
const {AWS_ACCESS_ID, AWS_ACCESS_SECRET} = process.env

const s3 = new aws.S3({
 secretAccessKey : AWS_ACCESS_SECRET,
 accessKeyId: AWS_ACCESS_ID,
 region: "ap-northeast-2"
})

module.exports = { s3 }