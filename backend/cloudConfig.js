import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
import {CloudinaryStorage} from 'multer-storage-cloudinary'
dotenv.config();
import multer from 'multer';

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder:'ChatApp',
        allowed_formats:["png", "jpg", "jpeg"]
    }
});

const upload = multer({storage});

export { cloudinary, upload };