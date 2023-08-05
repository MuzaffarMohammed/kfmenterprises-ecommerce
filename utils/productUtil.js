import { isEmpty } from "lodash";
import { calculateDiscountedPercentage } from "./util";


export const displayProduct = product => {
    let disProduct = { _id: product._id, checked: product.checked }
    if (!isEmpty(product.attributes)) {
        product.attributes.forEach(attr => {
            disProduct = { ...disProduct, url: attr.defaultImg.url, title: attr.title }
            let displayProductFound = false;
            attr.sizes && attr.sizes.forEach(size => {
                if (size.isDisplay) {
                    disProduct = populateProductPrices(disProduct, size);
                    displayProductFound = true;
                }
            });
            if (!displayProductFound) disProduct = populateProductPrices(disProduct, attr.sizes[0]);
        });
    }else{
        disProduct = {
            ...disProduct, 
            url: product.images ? product.images[0].url : '/public/assets/images/product/no_product_img.png', 
            title:product.title,
        }
        disProduct = populateProductPrices(disProduct, {totalPrice:product.totalPrice, mrpPrice: product.mrpPrice, inStock: product.inStock});
    }
    console.log('disProduct: ', disProduct)
    return disProduct;
}

export const displayProducts = products => {
    let displayProducts = [];
    !isEmpty(products) && products.forEach(product =>
        displayProducts.push(displayProduct(product))
    );
    return displayProducts;
}

export const populateProductPrices = (product, sizeObj) => {
    return {
        ...product,
        totalPrice: sizeObj.totalPrice,
        mrpPrice: sizeObj.mrpPrice,
        inStock: sizeObj.inStock,
        discount: calculateDiscountedPercentage(sizeObj.mrpPrice, sizeObj.totalPrice)
    }
}