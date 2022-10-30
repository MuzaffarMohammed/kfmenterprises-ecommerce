import Link from "next/link";

export const CategoryDisplayItems = ({ categories }) => {

    return (
        <>
            {categories &&
                <>
                    {categories.map((category, i) => (
                        category.displayItems &&
                        <Link key={category + i} href={`/productSearch/?category=${category._id}`}>
                            <div className="row category-display-items">
                                <div className='col-xl-6'>
                                    <img className="" src={category.displayItems.img} />
                                </div>
                                <div className='col-xl-6 row align-items-center justify-content-center'>
                                    <div className="category-display-items-text">
                                        <h1 className="category-display-items-name">
                                            {category.displayItems.name}
                                        </h1>
                                        <h3 className="category-display-items-desc">
                                            {category.displayItems.description}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                    }
                </>
            }
        </>
    );
}