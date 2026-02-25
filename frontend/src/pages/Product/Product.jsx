import { useState } from "react";
import SideBar from "../../layouts/components/SideBar/SideBar.jsx";
import ProductList from "../../layouts/components/ProductList/ProductList.jsx";

const Product = () => {
    const [filters, setFilters] = useState({
        categories: [],
        genders: [],
        sizes: [],
        minPrice: 0,
        maxPrice: 400
    });

    return (
        <div className="lg:px-[80px] px-4 py-8 bg-gray-50/50 min-h-screen">
            <div className="max-w-7xl mx-auto xl:grid xl:grid-cols-12 xl:gap-8">
                <div className="xl:col-span-3 mb-8 xl:mb-0">
                    <SideBar filters={filters} setFilters={setFilters} />
                </div>

                <div className="xl:col-span-9">
                    <ProductList filters={filters} />
                </div>
            </div>
        </div>
    )
};

export default Product;
