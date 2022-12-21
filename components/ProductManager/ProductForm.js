import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import PriceQuantiity from "./PriceQuantity";
import { renderSizes } from "./ProductAttributesUtil";


const ProductForm = (props) => {


    const [displaySizes, setDisplaySizes] = useState(false);

    const productTooltip = (attributes, img) => {
        if (!isEmpty(attributes)) {
            let attr = attributes.filter(attr => attr.defaultImg.public_id === img.public_id);
            if (!isEmpty(attr)) {
                attr = attr[0];
                return (
                    <>
                        Price: {attr.totalPrice}
                    </>
                );
            }
        }
    }

    const handleSizeTypeSelect = (e) => {
        props.handleChangeInput(e);

    };

    useEffect(() => {
        if (props.product.selectedSizeType) {
            setDisplaySizes(props.product.selectedSizeType !== 'select');
        }
    }, [props.product.selectedSizeType])

    return (
        <>
            {props.isLoading ? <Loading />
                :
                <form className="row my-3" onSubmit={props.handleSubmit}>
                    <div className="col-xl-5 col-md-5">
                        <div className="row mx-1">
                            <div className="col">
                                <label className='product-attributes-label' htmlFor="title">Product Name</label>
                                <input type="text" name="title" value={props.product.title}
                                    placeholder="Title" className={'d-block w-100 product-attributes-input'}
                                    onChange={props.handleChangeInput}
                                    maxLength='25'
                                />
                            </div>
                        </div>
                        {!props.isAttributes && <PriceQuantiity {...props} />}
                        {props.isAttributes &&
                            <>
                                <div className="row pt-2">
                                    <label className='product-attributes-label' htmlFor="selectedSizeType">Choose a size type</label>
                                    <select name="selectedSizeType" id="sizes" value={props.product.selectedSizeType}
                                        onChange={handleSizeTypeSelect} className="custom-select text-capitalize product-attributes-input">
                                        {props.sizeTypeList.map(item => (
                                            <option key={item.type} value={item.type}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {displaySizes &&
                                    <div className="col pt-2">
                                        {renderSizes(props.product.selectedSizeType, props.product.sizes, props.handleSizes)}
                                    </div>
                                }

                                <div className="row">
                                    <div className="col-5 pl-1">
                                        <label className='product-attributes-label' htmlFor="color">Color</label>
                                        <input type="text" name="color" value={props.product.color}
                                            placeholder="Color" className={'d-block w-100 product-attributes-input'}
                                            onChange={props.handleChangeInput}
                                            maxLength='15'
                                        />
                                    </div>
                                    <div className="col-5 pl-1">
                                        <label className='product-attributes-label' htmlFor="color">Shape</label>
                                        <input type="text" name="shape" value={props.product.shape}
                                            placeholder="Shape" className={'d-block w-100 product-attributes-input'}
                                            onChange={props.handleChangeInput}
                                            maxLength='15'
                                        />
                                    </div>
                                </div>
                            </>
                        }
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
                            {props.images.map((img, index) => (
                                <div key={'IMG-' + index} className="file_img my-1">
                                    <img src={img.url ? img.url : URL.createObjectURL(img)}
                                        alt="" className="img-thumbnail rounded my-1" />
                                    <span className='img-del' onClick={() => props.handleImageDelete(index, props.images)}>X</span>
                                    {(img.url && !props.isAttributes) &&
                                        <span className='img-edit' onClick={() => { props.handleImageClick(img) }}><i className="fas fa-edit" aria-hidden="true" /></span>
                                    }
                                    {!props.isAttributes &&
                                        <div className="product-tooltip">
                                            {productTooltip(props.product.attributes, img)}
                                        </div>
                                    }
                                </div>
                            ))}
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