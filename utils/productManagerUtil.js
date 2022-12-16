import { isEmpty } from "lodash";
import { deleteData, putData } from "./fetchData";
import { imageUpload } from "./imageUpload";
import { calcTaxAmount, calcTotalPrice } from "./util";

export const populateProduct = (name, value, TAX, product) => {
    if (name === 'price') {
        const calcTax = calcTaxAmount(value, TAX);
        return { ...product, [name]: value, tax: calcTax, totalPrice: calcTotalPrice(value, calcTax) };
    } else if (name === 'category') return undefined;
    return { ...product, [name]: value };
}

export const updateAttributes = (existingAttrs, newAttr, isDelete, del_publicIds) => {
    let toUpdateAttr = [];
    if (!isEmpty(existingAttrs)) {
        // Getting toBeRemoveAttrIndex for update/ delete of attribute from the existing attributes of product by 'defaultImg.public_id'.
        if (isDelete) return deleteAttrs(del_publicIds, existingAttrs); // For removing existing attribute by public_ids
        else return updateAttrs(newAttr, existingAttrs, toUpdateAttr); // For removing existing Attribute & updating with new one.
    } else if (newAttr) toUpdateAttr = [newAttr];
    return toUpdateAttr;
}

const updateAttrs = (newAttr, existingAttrs, toUpdateAttr) => {
    const toBeRemoveAttrIndex = existingAttrs.findIndex((obj) => {
        const publid_id = obj.defaultImg && obj.defaultImg.public_id;
        const new_public_id = newAttr && newAttr.defaultImg && newAttr.defaultImg.public_id;
        return publid_id === new_public_id; // For removing existing Attribute & updating with new one.
    });
    if (toBeRemoveAttrIndex > -1) existingAttrs.splice(toBeRemoveAttrIndex, 1);
    toUpdateAttr = !newAttr ? existingAttrs : [...existingAttrs, newAttr];// Old Attrs + new Attr
    return toUpdateAttr;
}

const deleteAttrs = (del_publicIds, existingAttrs) => {
    del_publicIds.forEach(del_public_id => {
        const toBeRemoveAttrIndex = existingAttrs.findIndex(obj => obj.defaultImg && obj.defaultImg.public_id === del_public_id);
        if (toBeRemoveAttrIndex > -1) existingAttrs.splice(toBeRemoveAttrIndex, 1);
    });
    return existingAttrs;
}

export const validateUploadInputs = (uploadFiles, existingFilesCount, isAttributes) => {
    let newImages = [];
    let err = '';
    if (uploadFiles.length === 0) err = 'Files does not exist.';
    if (isAttributes && existingFilesCount + uploadFiles.length > 5) err = 'Upto 5 images are allowed!';
    else if (existingFilesCount + uploadFiles.length > 10) err = 'Upto 10 images are allowed for a product!';

    uploadFiles.forEach(file => {
        if (file.size > 1024 * 1024) err = 'The largest image size is 1mb'
        if (file.type !== 'image/jpeg' && file.type !== 'image/png') err = 'Image format is incorrect.'
        newImages.push(file);
    })
    return err === '' ? { images: newImages } : { err };
}

export const deleteImagesFromCloudinary = (imgsTodelete, auth, productId, isAttributes, existingAttrs) => {
    let publicIds = [];
    imgsTodelete.map(img => { if (img.public_id) publicIds.push(img.public_id) });
    if (publicIds.length > 0) {
        deleteData(`uploads/delete`, auth.token, { publicIds });
        if (!isAttributes) {
            const updatedAttrs = updateAttributes(existingAttrs, {}, true, publicIds);
            putData(`product/attributes/${productId}`, { attributes: updatedAttrs }, auth.token);
        }
    }
}

export const uploadImagesToCloudinary = async (imgs) => {
    let newUploadedImgsURLs = [];
    const imgsToUpload = imgs.filter(img => !img.url)
    const oldImgsURLs = imgs.filter(img => img.url)
    if (imgsToUpload.length > 0) {
        newUploadedImgsURLs = await imageUpload(imgsToUpload, 'product');
        return [...oldImgsURLs, ...newUploadedImgsURLs];
    }
    return imgs;
}

