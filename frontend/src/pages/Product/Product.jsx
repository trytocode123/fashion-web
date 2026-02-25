import SideBar from "../../layouts/components/SideBar/SideBar.jsx";
import ProductList from "../../layouts/components/ProductList/ProductList.jsx";

const Product = () => {
    return (
        <div className="lg:px-[80px] px-4 py-8">
            <div className="xl:grid xl:grid-cols-12 xl:gap-8">
                <div className="xl:col-span-3 mb-8 xl:mb-0">
                    <SideBar />
                </div>

                <div className="xl:col-span-9">
                    <ProductList />
                </div>
            </div>
        </div>
    )
};

export default Product;
