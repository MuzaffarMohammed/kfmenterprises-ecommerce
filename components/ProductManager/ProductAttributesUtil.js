import ClothSizes from "./ClothSizes";
import LengthXBreadth from "./LengthXBreadth";

export const sizeTypeList = [
    { type: 'select', name: '-select-', value: '' },
    { type: 'cloth-smlxl', name: 'Cloth-S,M,L,XL,XXL,3XL', value: ['S', 'M', 'L', 'XL', 'XXL', '3XL'] },
    { type: 'lxb', name: 'Length x Breadth', value: ['Length', 'Breadth'] },
    { type: 'custom', name: 'Custom', value: ['Size'] }
];

export const renderSizes = (sizeType, data, handleSizes) => {
    let sizesType = sizeTypeList.filter(size => size.type === sizeType);
    sizesType = sizesType ? sizesType[0] : {};
    const dataArr = data && data.filter(item => item.type === sizeType);
    switch (sizeType) {
        case 'cloth-smlxl':
            return <ClothSizes sizesType={sizesType} dataArr={dataArr} handleSizes={handleSizes} />;
        case 'lxb':
            return <LengthXBreadth sizesType={sizesType} dataArr={dataArr} handleSizes={handleSizes} />;
        case 'custom':
        default:
            return;
    }
}