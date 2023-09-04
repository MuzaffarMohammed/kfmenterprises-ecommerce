export const ProductPrice = ({ product, isAdmin, isProductDetailPage }) => {

    return (
        <>
            {!isProductDetailPage &&
                <h6 className="card-title text-capitalize" title={product.title} style={{ fontSize: isProductDetailPage ? "24px" : "" }}>
                    {product.title}
                </h6>
            }
            <div className={!isProductDetailPage ? "row justify-content-between mx-0" : "row mx-0"}>

                <h6 className="text-success">₹{product.totalPrice}
                    {product.discount !== '0.0' &&
                        <>
                            <span className="text-muted" style={{ marginLeft: '5px', textDecoration: 'line-through', fontSize: '12px' }}>
                                {product.mrpPrice}
                            </span>
                            <span className='offer-text'>{product.discount}% Off</span>
                        </>
                    }
                </h6>
                {
                    product.inStock > 0
                        ? <h6 className={isProductDetailPage ? "d-flex text-success mx-1 my-1 small" : "stock text-success my-2"}>In Stock {isAdmin ? ":" + product.inStock : ""}</h6>
                        : <h6 className="stock text-danger">Out Of Stock</h6>
                }
            </div>
        </>
    );
}