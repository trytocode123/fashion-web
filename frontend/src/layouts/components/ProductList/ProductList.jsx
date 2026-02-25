import { useEffect, useState } from "react";
import { findAllProduct, filterProducts } from "../../../service/Product/ProductService.js";
import { useSelector } from "react-redux";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProductList = ({ filters }) => {
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const token = useSelector(state => state.auth?.account?.token);
    const navigate = useNavigate();

    useEffect(() => {

        setPage(0);
    }, [filters]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                let data;
                if (filters) {
                    data = await filterProducts(token, filters, page, 9);
                } else {
                    data = await findAllProduct(token, page, 9);
                }

                if (data) {
                    setProductList(data.content || []);
                    setTotalPages(data.totalPages || 0);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [token, page, filters]);

    const handleDetail = (id) => {
        navigate(`/detail/${id}`);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
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
                <>
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
                                </div>

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
                    
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-12 gap-2">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 0}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors border
                                    ${page === 0
                                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                        : "text-gray-700 border-gray-300 hover:border-gray-900 hover:text-gray-900 bg-white"}`}
                            >
                                Previous
                            </button>

                            <div className="flex gap-1 mx-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i)}
                                        className={`w-10 h-10 rounded-lg font-medium transition-all flex items-center justify-center
                                            ${page === i
                                                ? "bg-gray-900 text-white shadow-md font-bold"
                                                : "text-gray-600 hover:bg-gray-100"}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages - 1}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors border
                                    ${page === totalPages - 1
                                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                        : "text-gray-700 border-gray-300 hover:border-gray-900 hover:text-gray-900 bg-white"}`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductList;