const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer();

const uploadDir = path.join(__dirname, 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use(cors());

// Serve the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
// Endpoint to get the list of files in uploads directory
app.get('/files', (req, res) => {
    fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
        if (err) {
            console.error('Error reading directory', err);
            return res.status(500).send('Error reading directory.');
        }

        res.json(files);
    });
});

// Endpoint to send some data as response
app.get('/data', (req, res) => {
    const data = {
        message: 'Hello from the server!'
    };
    res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

