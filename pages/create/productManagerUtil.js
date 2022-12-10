import { deleteData } from "../../utils/fetchData";

export const deleteImagesFromCloudinary = (imgsTodelete, auth) => {
    let publicIds = [];
    imgsTodelete.map(img => { if (img.public_id) publicIds.push(img.public_id) });
    if (publicIds) deleteData(`uploads/delete`, auth.token, { publicIds });
}