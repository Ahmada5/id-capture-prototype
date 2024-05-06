const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer();

const uploadDir = path.join(__dirname, 'uploaded');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Endpoint to receive multipart form data
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filename = `${Date.now()}_${req.file.originalname}`;

    // Save uploaded file to disk
    fs.writeFile(path.join(uploadDir, filename), req.file.buffer, (err) => {
        if (err) {
            console.error('Error saving file', err);
            return res.status(500).send('Error saving file.');
        }

        console.log('File saved:', filename);
        res.send('File uploaded and saved successfully!');
    });
});

// Endpoint to send saved file names
app.get('/files', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error('Error reading directory', err);
            return res.status(500).send('Error reading directory.');
        }

        res.json(files);
    });
});
const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


