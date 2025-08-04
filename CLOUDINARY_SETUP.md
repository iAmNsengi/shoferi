# 🔧 Cloudinary Setup for File Uploads

## 📋 **Environment Variables Required**

Add these to your `server/.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 🚀 **How to Get Cloudinary Credentials**

1. **Sign up at [Cloudinary](https://cloudinary.com/)**
2. **Go to Dashboard**
3. **Copy your credentials:**
   - Cloud Name
   - API Key
   - API Secret

## 📁 **File Structure Created**

```
server/
├── config/
│   └── cloudinary.js          # Cloudinary configuration
├── routes/
│   └── uploadRoutes.js        # Updated with Cloudinary uploads
└── package.json               # Added cloudinary dependency
```

## 🔄 **Updated Upload Endpoints**

### **1. Profile Image Upload**

```javascript
POST /api/v1/upload/profile-image
Content-Type: multipart/form-data
Authorization: Bearer <token>

// Response
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "profileUrl": "https://res.cloudinary.com/...",
  "publicId": "shoferi/profile-images/..."
}
```

### **2. CV Upload**

```javascript
POST /api/v1/upload/cv
Content-Type: multipart/form-data
Authorization: Bearer <token>

// Response
{
  "success": true,
  "message": "CV uploaded successfully",
  "cvUrl": "https://res.cloudinary.com/...",
  "publicId": "shoferi/cv/..."
}
```

### **3. Generic File Upload**

```javascript
POST /api/v1/upload/
Content-Type: multipart/form-data
Authorization: Bearer <token>

// Response
{
  "success": true,
  "message": "File uploaded successfully",
  "fileUrl": "https://res.cloudinary.com/...",
  "publicId": "shoferi/general/..."
}
```

## ✨ **Features**

- **Automatic Image Optimization**: Profile images are resized to 400x400 with face detection
- **File Type Validation**: Only images and PDFs are allowed
- **File Size Limit**: 5MB maximum
- **Organized Folders**: Files are organized in Cloudinary folders
- **Secure URLs**: All URLs use HTTPS
- **Public IDs**: Returned for future management

## 🔧 **Configuration Details**

### **Profile Images**

- Folder: `shoferi/profile-images`
- Transformations: 400x400 crop with face detection
- Quality: Auto-optimized

### **CV Files**

- Folder: `shoferi/cv`
- Resource Type: Auto-detected
- No transformations applied

### **General Files**

- Folder: `shoferi/general`
- Resource Type: Auto-detected
- No transformations applied

## 🚨 **Important Notes**

1. **Environment Variables**: Must be set before starting the server
2. **File Validation**: Only images and PDFs are accepted
3. **Size Limits**: 5MB maximum per file
4. **Authentication**: All upload routes require authentication
5. **Error Handling**: Comprehensive error responses

## 🔍 **Testing**

Test the upload endpoints with:

```bash
# Profile image upload
curl -X POST http://localhost:5000/api/v1/upload/profile-image \
  -H "Authorization: Bearer <your_token>" \
  -F "profileImage=@/path/to/image.jpg"

# CV upload
curl -X POST http://localhost:5000/api/v1/upload/cv \
  -H "Authorization: Bearer <your_token>" \
  -F "cv=@/path/to/cv.pdf"
```

The upload system is now **production-ready** with Cloudinary! 🚀
