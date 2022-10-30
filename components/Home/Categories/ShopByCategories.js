import Link from "next/link";

export const ShopByCategories = ({ categories }) => {

    return (
        <>
            {categories &&
                <>
                    <h2>Shop By Category</h2>
                    <div className='row justify-content-center'>
                        {categories.map((category, i) => (
                            <Link key={category + i} href={`/productSearch/?category=${category._id}`}>
                                <div className="mx-2 my-2 card category-card">
                                    <div className='pt-2 category-img-div'>
                                        <img className="category-img" src={category.img} />
                                    </div>
                                    <div className='pt-md-3'>{category.name}</div>
                                </div>
                            </Link>
                        ))
                        }
                    </div>
                </>
            }
        </>
    );
}