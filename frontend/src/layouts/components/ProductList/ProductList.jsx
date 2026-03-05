import { useEffect, useState } from "react";
import { findAllProduct, filterProducts } from "../../../service/Product/ProductService.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi2";
import { FiFilter } from "react-icons/fi";

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

                const isFilterEmpty =
                    filters.categories.length === 0 &&
                    filters.genders.length === 0 &&
                    filters.sizes.length === 0 &&
                    filters.minPrice === 0 &&
                    filters.maxPrice === 400000;

                if (!isFilterEmpty) {
                    data = await filterProducts(token, filters, page, 9);
                } else {
                    data = await findAllProduct(token, page, 9);
                }

                if (data) {
                    setProductList(data.content || []);
                    if (data.page && data.page.totalPages) {
                        setTotalPages(data.page.totalPages);
                    } else if (data.totalPages) {
                        setTotalPages(data.totalPages);
                    } else {
                        setTotalPages(0);
                    }
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                // Add a small delay for smoother transition feel
                setTimeout(() => setLoading(false), 300);
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

    const SkeletonCard = () => (
        <div className="bg-zinc-50 rounded-[2rem] border border-zinc-100 p-2 animate-pulse">
            <div className="aspect-[4/5] bg-zinc-200 rounded-[1.8rem] mb-4"></div>
            <div className="px-3 pb-4 space-y-3">
                <div className="h-4 bg-zinc-200 rounded-full w-2/3"></div>
                <div className="h-3 bg-zinc-100 rounded-full w-1/3"></div>
                <div className="flex justify-between items-center pt-2">
                    <div className="h-5 bg-zinc-200 rounded-lg w-1/4"></div>
                    <div className="h-8 w-8 bg-zinc-200 rounded-full"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-10">
                <div className="flex flex-col">
                    <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-1">Catalog</span>
                    <h2 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">Our Collection</h2>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-zinc-50 px-4 py-2 rounded-full border border-zinc-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{productList.length} Items Loaded</span>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : productList.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-zinc-50 rounded-[3rem] border-2 border-dashed border-zinc-200">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-zinc-300 mb-4">
                        <FiFilter size={24} />
                    </div>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No products matches your filters</p>
                    <button onClick={() => window.location.reload()} className="mt-4 text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline">Clear all filters</button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {productList.map(product => (
                            <div
                                key={product.id}
                                onClick={() => handleDetail(product.id)}
                                className="group cursor-pointer flex flex-col h-full animate-scale-in"
                            >
                                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-zinc-100 mb-6 shadow-sm border border-zinc-100 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-zinc-200 group-hover:-translate-y-2">
                                    <img
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        src={product.img}
                                        alt={product.name}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=No+Image'; }}
                                    />
                                    <div className="absolute top-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-zinc-900 shadow-lg">
                                            <HiArrowRight className="-rotate-45" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4">
                                        <span className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-900 border border-white/50">
                                            {product.subCategory?.name || "General"}
                                        </span>
                                    </div>
                                </div>

                                <div className="px-2">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-black text-zinc-900 text-lg uppercase tracking-tight line-clamp-1" title={product.name}>
                                            {product.name}
                                        </h3>
                                    </div>
                                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-50">
                                        <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                                            Size {product.size || "All"}
                                        </span>
                                        <span className="font-black text-indigo-600 text-sm">
                                            {product.price ? product.price.toLocaleString("vi-VN") : "0"} ₫
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-20 gap-3">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 0}
                                className={`h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border-2
                                    ${page === 0
                                        ? "text-zinc-300 border-zinc-100 cursor-not-allowed"
                                        : "text-zinc-900 border-zinc-100 hover:border-zinc-900 bg-white"}`}
                            >
                                Prev
                            </button>

                            <div className="flex gap-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i)}
                                        className={`w-12 h-12 rounded-2xl font-black transition-all flex items-center justify-center text-xs
                                            ${page === i
                                                ? "bg-zinc-900 text-white shadow-xl shadow-zinc-200 scale-110"
                                                : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900"}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages - 1}
                                className={`h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border-2
                                    ${page === totalPages - 1
                                        ? "text-zinc-300 border-zinc-100 cursor-not-allowed"
                                        : "text-zinc-900 border-zinc-100 hover:border-zinc-900 bg-white"}`}
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