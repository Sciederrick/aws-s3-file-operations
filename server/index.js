require('dotenv').config()
const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const fileUpload = require('express-fileupload')
const fileOp = require('./modules/fileOperations.js')

require(__dirname+'/../public/js/helpers.js')

const app = express()

app.engine('hbs', exphbs({
  layoutsDir: `${__dirname}/../views/layouts`,
  extname: 'hbs',
  defaultLayout: 'index',
  partialsDir: `${__dirname}/../views/partials`
}))
app.set('view engine', 'hbs')

//Middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(fileUpload({
    createParentPath: true
}))
app.use(express.static(__dirname+'public'))

app.get('/', (req, res)=>{
  res.render('main')
})

app.get('/api/list', (req, res) => {
  (async ()=>{
    let response = await fileOp.listFiles()
    res.render('main', {listExists: true, bucketObjects: response})
  })()
})

app.post('/api/upload', (req, res) => {
  (async ()=>{
    let response = await fileOp.uploadFile(req.files.file.name, req.files.file.data)
    res.render('main', {statusExists: true, status: response})
  })()
})

app.post("/api/delete", (req, res)=>{
  (async ()=>{
    const fileName = req.body.fileName
    let response = await fileOp.deleteFile(fileName)
    res.render('main', {statusExists: true, status: response})
  })()
})

app.post("/api/download", (req, res)=>{
  (async ()=>{
    const fileName = req.body.fileName
    let response = await fileOp.downloadFile(fileName)
    res.render('main', {statusExists: true, status: response})
  })()
})

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`)
})
