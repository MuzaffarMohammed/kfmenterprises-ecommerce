import { PRODUCT_ATTR } from "../../utils/constants";
import ProductAtrributes from "./ProductAttributes";

export const openProductAtrributesPopup = (attrData, existingAttrs, callBack, dispatch) => {
  $('#confirmModal').modal('show');
  dispatch({
    type: 'ADD_MODAL',
    payload: {
      maxWidth: '800px',
      title: 'Product Attributes',
      content: <ProductAtrributes attrData={attrData} existingAttrs={existingAttrs} callBack={callBack} />,
      data: {},
      type: PRODUCT_ATTR
    }
  });
}