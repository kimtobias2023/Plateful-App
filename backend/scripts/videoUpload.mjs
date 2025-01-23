const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

// Create a GridFS storage engine connected to your MongoDB instance
const conn = mongoose.createConnection(mongoURI); // Make sure to define mongoURI
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    // Now you can start using gfs for file operations
});

// Function to upload a video
const uploadVideo = (req, res) => {
    const { video } = req.files;

    if (!video) {
        return res.status(400).json({ message: 'No video file provided' });
    }

    const writeStream = gfs.createWriteStream({
        filename: video.name,
        content_type: video.mimetype
    });

    video.data.pipe(writeStream);

    writeStream.on('close', () => {
        res.json({ message: 'Video uploaded successfully' });
    });
};

module.exports = {
    uploadVideo
};
