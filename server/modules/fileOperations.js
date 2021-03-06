
require('dotenv').config()
const AWS = require('aws-sdk')

//AWS
const ID = process.env.AWS_ID
const SECRET = process.env.AWS_SECRET
const BUCKET_NAME = process.env.AWS_BUCKET

AWS.config.setPromisesDependency()
AWS.config.update({
  accessKeyId: ID,
  secretAccessKey: SECRET,
  region: 'us-east-1'
})

const s3 = new AWS.S3()
//Upload
const uploadFile = async (fileName, fileContent) => {

  //S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: `Team_Test/Default/${fileName}`,
    Body: fileContent
  }

  //Uploading files to the bucket
  let location = await s3.upload(params).promise()

  return `file uploaded successfully: ${location.Location} : ${location.Key}`
}
//List
const listFiles = async () => {

  //S3 list files parameters
  const params = {
    Bucket: BUCKET_NAME
  }

  //File listing
  let bucket = await s3.listObjectsV2(params).promise()

  return bucket.Contents
}
//Delete
const deleteFile = async (fileName) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName
  }
  //Deleting a file
  let result = await s3.deleteObject(params).promise()

  return `file deleted Successfuly`
}

const downloadFile = async (fileName) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName
  }
  //Download a file
  let result = await s3.getObject(params).promise()

  console.log(result)
  return result
}

module.exports.uploadFile = uploadFile
module.exports.listFiles =  listFiles
module.exports.deleteFile = deleteFile
module.exports.downloadFile = downloadFile
