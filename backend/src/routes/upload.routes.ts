import express, { Request, Response } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
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

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return cb(new Error('Only image files are allowed!'));
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Upload endpoint
router.post('/', protect, admin, upload.single('image'), (req: Request, res: Response) => {
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
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Server error during upload' });
  }
});

export default router;
