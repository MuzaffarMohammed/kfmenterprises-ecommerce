import { formatDateTime } from "../../utils/util";

// const dateFormatter = cell => {
//     console.log('cell.label', cell.label)
//     if (cell && !cell.label) return;
//     return formatDateTime(cell.label);
// }

export const productColumns = [
    {
        dataField: "title",
        text: "Product Name",
        sort: true
    },
    {
        dataField: "totalPrice",
        text: "Price",
        sort: true
    },
    {
        dataField: "tax",
        text: "Tax",
        sort: true
    },
    {
        dataField: "inStock",
        text: "In Stock",
        sort: true
    },
    {
        dataField: "createdAt",
        text: "Creation Date",
        sort: true,
        //formatter: dateFormatter
    }
];
