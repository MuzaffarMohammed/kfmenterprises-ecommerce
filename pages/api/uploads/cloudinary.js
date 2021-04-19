import cloudinary from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
})

export const cloud_uploads = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.v2.uploader.upload(file,{ use_filename: true, unique_filename: false }, (error, result) => {
            resolve({
                url: result.secure_url,
                id: result.public_id
            })
        }, {
            resource_type: "auto",
            folder: folder
        })
    })
}