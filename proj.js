const express=require('express')
const path=require('path') 
const multer= require('multer')
const {mergepdfs}=require('./merge')
const app = express(); 
const upload = multer({ dest: 'uploads/' })
app.use('/static', express.static('public'))
const port = 3000

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "templates/index.html"))
})
app.post('/merge', upload.array('pdfs', 2), async (req, res)=> {
  try {
   // Validate that two files are uploaded
     if (req.files.length !== 2) {
       return res.status(400).send("Please upload exactly two PDF files.");
     }

    // Validate that both files are PDFs
    if (!req.files.every(file => file.mimetype === 'application/pdf')) {
      return res.status(400).send("Only PDF files are allowed.");
    }
  console.log(req.files)
  await mergepdfs(path.join(__dirname,req.files[0].path),path.join(__dirname,req.files[1].path))
  res.redirect("http://localhost:3000/static/merged.pdf")
 
}catch (error) {
  console.error("Error during file merge:", error);
  res.status(500).send("An error occurred while merging PDFs.");
}
})
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
