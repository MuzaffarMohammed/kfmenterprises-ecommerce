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
        id: "name",
        field: "name",
        name: "Category",
        format:{
            type:"object",
            field:"categories"
        },
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
