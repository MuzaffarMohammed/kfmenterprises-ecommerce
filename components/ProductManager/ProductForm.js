import Loading from "../Loading";

const ProductForm = (props) => {
    return (
        <>
            {props.isLoading ? <Loading />
                :
                <form className="row my-3" onSubmit={props.handleSubmit}>
                    <div className="col-xl-4 col-md-5">
                        <div className="row mx-1">
                            <div className="col">
                                <label className='product-attributes-label' htmlFor="title">Product Name</label>
                                <input type="text" name="title" value={props.product.title}
                                    placeholder="Title" className={'d-block w-100 product-attributes-input'}
                                    onChange={props.handleChangeInput}
                                    maxLength='25'
                                />
                            </div>
                            <div className="row justify-content-between">
                                <div className="col-3 col-lg-2">
                                    <label className='product-attributes-label' htmlFor="mrpPrice">MRP Price</label>
                                    <input type="number" name="mrpPrice" value={props.product.mrpPrice}
                                        placeholder="Price" className={'d-block w-100 product-attributes-input'}
                                        onChange={props.handleChangeInput}
                                        maxLength='5'
                                    />
                                </div>
                                <div className="col-3 col-lg-2 pl-1">
                                    <label className='product-attributes-label' htmlFor="price">Your Price</label>
                                    <input type="number" name="price" value={props.product.price}
                                        placeholder="Price" className={'d-block w-100 product-attributes-input'}
                                        onChange={props.handleChangeInput}
                                        maxLength='5'
                                    />
                                </div>
                                <div className="col-3 col-lg-2 pl-1">
                                    <label className='product-attributes-label' htmlFor="tax">Tax (2%)</label>
                                    <input type="text" name="tax" value={props.product.tax}
                                        placeholder="Tax" className={'d-block w-100 product-attributes-input'}
                                        disabled
                                        onChange={props.handleChangeInput}
                                    />
                                </div>
                                <div className="col-3 col-lg-2 pl-1">
                                    <label className='product-attributes-label' htmlFor="total">Total Price</label>
                                    <input type="text" name="total" value={props.product.totalPrice}
                                        placeholder="Total Price" className={'d-block w-100 product-attributes-input'}
                                        onChange={props.handleChangeInput}
                                        disabled
                                    />
                                </div>
                                <div className="col-3 col-lg-2 pl-1">
                                    <label className='product-attributes-label' htmlFor="inStock">In Stock</label>
                                    <input type="number" name="inStock" value={props.product.inStock}
                                        placeholder="inStock" className={'d-block w-100 product-attributes-input'}
                                        onChange={props.handleChangeInput}
                                        maxLength='5'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row mx-1">
                            <textarea name="description" id="description" cols="100" rows="3"
                                placeholder="Description" onChange={props.handleChangeInput}
                                className="mt-2" value={props.product.description}
                                maxLength='250'
                            />
                        </div>
                        <div className="row mx-1">
                            <textarea name="content" id="content" cols="100" rows="6"
                                placeholder="Content" onChange={props.handleChangeInput}
                                className="mt-2" value={props.product.content}
                                maxLength='700'
                            />
                        </div>
                        {!props.isAttributes &&
                            <div className="row mx-1">
                                <div className="col mt-2">
                                    <div className="input-group-prepend px-0 my-2">
                                        <select name="category" id="category" value={props.categories}
                                            onChange={props.handleChangeInput} className="custom-select text-capitalize product-attributes-input">
                                            <option value="all">All</option>
                                            {
                                                props.categoriesList.map(item => (
                                                    <option key={item._id} value={item._id}>
                                                        {item.name}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                    <div className="col-md-7 pl-2">
                        <div className="mt-2">
                            <div className='upload-img-btn'>
                                <label htmlFor="upload-img-input">+ Upload Image(s) <i className="fas fa-image upload-img-icon" aria-hidden="true" /></label>
                                <input type="file" id="upload-img-input"
                                    onChange={props.handleUploadInput} multiple accept="image/*" />
                            </div>
                        </div>
                        <div className="row img-up">
                            {
                                props.images.map((img, index) => (
                                    <div key={'IMG-' + index} className="file_img my-1">
                                        <img src={img.url ? img.url : URL.createObjectURL(img)}
                                            alt="" className="img-thumbnail rounded my-1" />
                                        <span className='img-del' onClick={() => props.handleImageDelete(index, props.images)}>X</span>
                                        {(img.url && !props.isAttributes) &&
                                            <span className='img-edit' onClick={() => { props.handleImageClick(img) }}><i className="fas fa-edit" aria-hidden="true" /></span>
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className="row col-xl-12 mt-2 justify-content-center">
                        <button type="submit" className="btn btn-primary w-100">
                            {props.onEdit ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            }
        </>
    );
}

export default ProductForm;