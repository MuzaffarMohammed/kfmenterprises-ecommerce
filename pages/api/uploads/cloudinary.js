import cloudinary from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
    secure: true
})

export const cloud_uploads = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.v2.uploader.upload(
            file,
            {
                use_filename: true,
                unique_filename: false,
                resource_type: "auto",
                folder: folder
            },
            (error, result) => {
                resolve({
                    url: result.secure_url,
                    id: result.public_id
                })
            })
    })
}

export const cloud_delete = (publicIds) => {
    return new Promise(resolve => {
        publicIds.forEach(public_id => {
            console.log('Deleting image : ', public_id);
            cloudinary.v2.uploader.destroy(public_id, async (error, response) => {
                if (error) throw error;
                if (response) {
                    console.log('Image deleted : ', response.result);
                    return response.result;
                }
            });
        });
    });
}