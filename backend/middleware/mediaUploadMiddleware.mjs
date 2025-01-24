import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Convert import.meta.url to a file path for __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Common uploads directory
const uploadsDir = path.join(__dirname, 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Custom storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(`Saving file to uploads directory: ${uploadsDir}`);
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        console.log(`Assigning filename: ${uniqueSuffix}`);
        cb(null, uniqueSuffix);
    }
});


// Define allowed MIME types for images, audio, and videos
const allowedMimeTypes = {
    'audio': ['audio/mpeg', 'audio/ogg', 'audio/wav'],
    'image': ['image/jpeg', 'image/png', 'image/gif'],
    'video': ['video/mp4', 'video/quicktime']
};

// Custom file filter
const fileFilter = (req, file, cb) => {
    const fileType = file.fieldname; // 'audio', 'image', or 'video'
    if (allowedMimeTypes[fileType]?.includes(file.mimetype)) {
        console.log(`Accepting file: ${file.originalname} of type ${file.mimetype}`);
        cb(null, true); // Accept the file
    } else {
        console.log(`Rejecting file: ${file.originalname} of type ${file.mimetype}`);
        cb(new Error(`Invalid file type for ${fileType}. Only specific ${fileType} types are allowed.`), false); // Reject the file
    }
};


// Setup Multer for handling different media types
const mediaUploadMiddleware = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for any file
    fileFilter
}).fields([
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]);

export { mediaUploadMiddleware };
