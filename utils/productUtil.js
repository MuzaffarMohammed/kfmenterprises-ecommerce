import { isEmpty } from "lodash";
import { calculateDiscountedPercentage } from "./util";
import Products from '../models/productModel';
import * as log from "../middleware/log"


export const displayProduct = product => {
    let disProduct = { _id: product._id, checked: product.checked }
    if (!isEmpty(product.attributes)) {
        product.attributes.find(attr => {
            disProduct = { ...disProduct, public_id: attr.defaultImg.public_id, url: attr.defaultImg.url, title: attr.title }
            let displayProductFound = false;
            attr.sizes && attr.sizes.forEach(size => {
                if (size.isDisplay) {
                    log.info('Display product for attr type: '+attr.title);
                    disProduct = populateProductPrices(disProduct, size);
                    displayProductFound = true;
                    return true;//  breaking Loop
                }
                return false;// Continue loop
            });
            if (!displayProductFound){
                disProduct = populateProductPrices(disProduct, attr.sizes[0]);
                return false;// Continue loop
            }else return true;//  breaking Loop
        });
    } else {
        // This will wor for non attr products.
        disProduct = {
            ...disProduct,
            url: product.images ? product.images[0].url : '/public/assets/images/product/no_product_img.png',
            title: product.title,
        }
        log.info('Display product non attr type: '+disProduct.title);
        disProduct = populateProductPrices(disProduct, { totalPrice: product.totalPrice, mrpPrice: product.mrpPrice, inStock: product.inStock });
    }
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

export const updateStockAndSoldFromProd = async (cart, products) => {
    log.info('Inside updateStockAndSoldFromProd...');
    if (isEmpty(products) || isEmpty(cart)) return;
    let updatedCart = cart;
    cart.forEach(cartItem => {
        let product = products[cartItem._id];
        log.info('cartItem : '+JSON.stringify(cartItem));
        log.info('product.attributesRequired : '+product.attributesRequired);
        if (!product.attributesRequired) {// Without attrs - work as old behaviour
            log.info('product.inStock : '+product.inStock+ ', product.sold: '+product.sold);
            cartItem.inStock = Math.abs(product.inStock - cartItem.quantity);
            cartItem.sold = Math.abs(product.sold + cartItem.quantity);
            updateInStockAndSoldById(cartItem._id, cartItem.inStock, cartItem.sold);
            updatedCart.push(cartItem);
        } else {
            product.attributes.find(attr => {
                if(cartItem.public_id && attr.defaultImg && (attr.defaultImg.public_id === cartItem.public_id)){// Checking defaultImg public Id with cart public id.
                    !isEmpty(attr.sizes) && attr.sizes.find(size =>{
                        if(size.isDisplay){
                            log.info('size : '+JSON.stringify(size));
                            size.sold = size.sold ? Math.abs(size.sold + cartItem.quantity) : cartItem.quantity;
                            size.inStock = Math.abs(size.inStock - cartItem.quantity);
                            cartItem.inStock = size.inStock;
                            cartItem.sold =  size.sold;
                            updatedCart.push(cartItem);
                            return true;// Breaking loop
                        }
                        return false;
                    });
                    return true;// Breaking loop
                }
                return false;
            });
            updateAttributes(cartItem._id, product.attributes);
        }
    });
    return updatedCart;
}

const updateAttributes = async (_id, attributes) =>{
    log.info('Inside updateAttributes... ID : '+_id);
    if (!isEmpty(attributes)) {
        await Products.findOneAndUpdate({ _id}, { attributes });
        return true;
    }else return false;
}

const updateInStockAndSoldById = async (_id, inStock, sold) => {
    log.info('Inside updateInStockAndSoldById...ID : '+_id);
    await Products.findOneAndUpdate({ _id }, { inStock, sold });
}