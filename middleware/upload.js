const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Store file in memory (buffer) so we can stream it to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

/**
 * Upload a buffer to Cloudinary and return the secure URL.
 */
const uploadToCloudinary = (buffer, folder = 'profile-photos') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }] },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
};

module.exports = { upload, uploadToCloudinary };
