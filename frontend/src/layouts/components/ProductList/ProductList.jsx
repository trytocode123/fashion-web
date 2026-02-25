import { useEffect, useState } from "react";
import { findAllProduct } from "../../../service/Product/ProductService.js";
import { useSelector } from "react-redux";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = useSelector(state => state.auth?.account?.token);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const data = await findAllProduct(token);
                setProductList(data.content || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [token]);

    const handleDetail = (id) => {
        navigate(`/detail/${id}`);
    };

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">All Products</h2>

            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <FaSpinner className="animate-spin text-4xl text-gray-400" />
                </div>
            ) : productList.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
                    <p className="text-lg">No products found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productList.map(product => (
                        <div
                            key={product.id}
                            onClick={() => handleDetail(product.id)}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group flex flex-col h-full border border-gray-100"
                        >
                            {/* Product Image */}
                            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                                <img
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    src={product.img}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
                                    }}
                                />
                                {/* Optional: Add badge here if needed (e.g., Sale, New) */}
                            </div>

                            {/* Product Info */}
                            <div className="p-4 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-800 text-lg line-clamp-1 flex-grow pr-2" title={product.name}>
                                        {product.name}
                                    </h3>
                                    <span className="font-bold text-blue-600 whitespace-nowrap">
                                        {product.price ? product.price.toLocaleString("vi-VN") : "0"} ₫
                                    </span>
                                </div>

                                <div className="mt-auto space-y-2">
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <span className="bg-gray-100 px-2 py-1 rounded-md">
                                            {product.subCategory?.name || "Uncategorized"}
                                        </span>
                                        <span className="capitalize text-gray-600 font-medium">
                                            {product.gender?.toLowerCase() || "Unisex"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                                        <span className="text-gray-500">Size</span>
                                        <span className="font-semibold text-gray-700">{product.size || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;