import { formatDateTime } from "../../utils/util";

// const dateFormatter = cell => {
//     console.log('cell.label', cell.label)
//     if (cell && !cell.label) return;
//     return formatDateTime(cell.label);
// }

export const productColumns = [
    {
        id:"title",
        field: "title",
        name: "Product Name",
        sort: true
    },
    {
        id: "totalPrice",
        field: "totalPrice",
        name: "Price",
        sort: true
    },
    {
        id: "tax",
        field: "tax",
        name: "Tax",
        sort: true
    },
    {
        id: "inStock",
        field: "inStock",
        name: "In Stock",
        sort: true
    },
    {
        id: "createdAt",
        field: "createdAt",
        name: "Creation Date",
        sort: true,
        //formatter: dateFormatter
    }
];
