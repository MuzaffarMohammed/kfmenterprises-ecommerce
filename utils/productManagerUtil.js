import { deleteData } from "./fetchData";
import { imageUpload } from "./imageUpload";
import { calcTaxAmount, calcTotalPrice } from "./util";


export const populateProduct = (name, value, TAX, product) =>{
    if (name === 'price') {
        const calcTax = calcTaxAmount(value, TAX);
        return { ...product, [name]: value, tax: calcTax, totalPrice: calcTotalPrice(value, calcTax)};
    } else if (name === 'category') return undefined;
    return { ...product, [name]: value };
}

export const validateUploadInputs = (uploadFiles, existingFilesCount) =>{
    let newImages = [];
    let err = '';
    if (uploadFiles.length === 0) err = 'Files does not exist.';
    if (existingFilesCount + uploadFiles.length > 5) err = 'Select upto 5 images only!';
    uploadFiles.forEach(file => {
        if (file.size > 1024 * 1024) err = 'The largest image size is 1mb'
        if (file.type !== 'image/jpeg' && file.type !== 'image/png') err = 'Image format is incorrect.'
        newImages.push(file);
    })
    return err === '' ? {images: newImages} : {err};
}


export const deleteImagesFromCloudinary = (imgsTodelete, auth) => {
    let publicIds = [];
    imgsTodelete.map(img => { if (img.public_id) publicIds.push(img.public_id) });
    if (publicIds.length > 0) deleteData(`uploads/delete`, auth.token, { publicIds });
}

export const uploadImagesToCloudinary = async (imgs) =>{
    let newUploadedImgsURLs = [];
    const imgsToUpload = imgs.filter(img => !img.url)
    const oldImgsURLs = imgs.filter(img => img.url)
    if (imgsToUpload.length > 0) {
        newUploadedImgsURLs = await imageUpload(imgsToUpload, 'product');
        return [...oldImgsURLs, ...newUploadedImgsURLs];
    }
    return imgs;
}

