const ProductForm = (props) => {
    return (
        <form className="row my-3" onSubmit={props.handleSubmit}>
            <div className="col-xl-6 col-xs-12">
                <div className="row mx-1">
                    <div className="col-sm-12">
                        <label htmlFor="title">Product Name</label>
                        <input type="text" name="title" value={props.product.title}
                            placeholder="Title" className="d-block w-100 p-2"
                            onChange={props.handleChangeInput}
                            maxLength='25'
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-2 mt-1">
                            <label htmlFor="mrpPrice">MRP Price</label>
                            <input type="number" name="mrpPrice" value={props.product.mrpPrice}
                                placeholder="Price" className="d-block w-100 p-2"
                                onChange={props.handleChangeInput}
                                maxLength='5'
                            />
                        </div>
                        <div className="col-md-2 mx-lg-3 mt-1">
                            <label htmlFor="price">Your Price</label>
                            <input type="number" name="price" value={props.product.price}
                                placeholder="Price" className="d-block w-100 p-2"
                                onChange={props.handleChangeInput}
                                maxLength='5'
                            />
                        </div>
                        <div className="col-md-2 mx-lg-1 mt-1">
                            <label htmlFor="tax">Tax (2%)</label>
                            <input type="text" name="tax" value={props.product.tax}
                                placeholder="Tax" className="d-block w-100 p-2"
                                disabled
                                onChange={props.handleChangeInput}
                            />
                        </div>
                        <div className="col-md-2 mx-lg-3 mt-1">
                            <label htmlFor="total">Total Price</label>
                            <input type="text" name="total" value={props.product.totalPrice}
                                placeholder="Total Price" className="d-block w-100 p-2"
                                onChange={props.handleChangeInput}
                                disabled
                            />
                        </div>
                        <div className="col-lg-2 col-md-3 mx-lg-1 mt-1">
                            <label htmlFor="inStock">In Stock</label>
                            <input type="number" name="inStock" value={props.product.inStock}
                                placeholder="inStock" className="d-block w-100 p-2"
                                onChange={props.handleChangeInput}
                                maxLength='5'
                            />
                        </div>
                    </div>
                </div>
                <div className="row mx-1">
                    <textarea name="description" id="description" cols="30" rows="3"
                        placeholder="Description" onChange={props.handleChangeInput}
                        className="d-block my-sm-4 mt-3 w-100 p-2" value={props.product.description}
                        maxLength='250'
                    />
                </div>
                <div className="row mx-1">
                    <textarea name="content" id="content" cols="30" rows="6"
                        placeholder="Content" onChange={props.handleChangeInput}
                        className="d-block my-sm-2 mt-3 w-100 p-2" value={props.product.content}
                        maxLength='700'
                    />
                </div>
                <div className="row mx-1">
                    <div className="col mt-2">
                        <div className="input-group-prepend px-0 my-2">
                            <select name="category" id="category" value={props.categories}
                                onChange={props.handleChangeInput} className="custom-select text-capitalize">
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
            </div>

            <div className="col-xl-5 col-xs-12 mx-md-4 mx-xs-3 mt-5 mt-md-0 justify-content-md-center">
                <div className="mt-2 mb-3">
                    <div className='upload-img-btn pt-2'>
                        <label htmlFor="upload-img-input">+ Upload Image(s) <i className="fas fa-image upload-img-icon" aria-hidden="true" /></label>
                        <input type="file" id="upload-img-input"
                            onChange={props.handleUploadInput} multiple accept="image/*" />
                    </div>
                </div>
                <div className="row img-up mx-0">
                    {
                        props.images.map((img, index) => (
                            <div key={'IMG-' + index} className="file_img my-1">
                                <img src={img.url ? img.url : URL.createObjectURL(img)}
                                    alt="" className="img-thumbnail rounded my-1" onClick={() => { props.handleImageClick(img, index) }} />
                                <span onClick={() => props.handleImageDelete(index, images)}>X</span>
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
    );
}

export default ProductForm;