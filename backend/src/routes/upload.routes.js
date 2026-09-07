"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Configure Cloudinary storage for Multer
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: async (req, file) => {
        // extract original extension without dot
        const ext = file.originalname.split('.').pop() || 'png';
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        return {
            folder: 'portfolio_uploads',
            format: ext, // supports promises as well
            public_id: `profile-${uniqueSuffix}`,
        };
    },
});
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
};
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
// Upload endpoint
router.post('/', auth_middleware_1.protect, auth_middleware_1.admin, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        // req.file.path contains the secure Cloudinary URL when using CloudinaryStorage
        const fileUrl = req.file.path;
        res.status(200).json({
            success: true,
            message: 'File uploaded successfully to Cloudinary',
            data: {
                url: fileUrl,
                filename: req.file.filename,
            },
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: 'Server error during upload' });
    }
});
exports.default = router;
//# sourceMappingURL=upload.routes.js.map