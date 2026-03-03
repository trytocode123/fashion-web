import { useState, useEffect } from "react";
import SideBar from "../../layouts/components/SideBar/SideBar.jsx";
import ProductList from "../../layouts/components/ProductList/ProductList.jsx";
import { useSearchParams } from "react-router-dom";
import { FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const Product = () => {
    const [searchParams] = useSearchParams();
    const genderParam = searchParams.get("gender");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [filters, setFilters] = useState({
        categories: [],
        genders: genderParam ? [genderParam] : [],
        sizes: [],
        minPrice: 0,
        maxPrice: 400000
    });

    useEffect(() => {
        if (genderParam) {
            setFilters(prev => ({
                ...prev,
                genders: [genderParam]
            }));
        }
    }, [genderParam]);

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
        setIsSidebarOpen(false); // Close sidebar on mobile after applying
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Mobile Filter & Quick Categories */}
            <div className="xl:hidden sticky top-[70px] z-30 bg-white/95 backdrop-blur-md border-b border-zinc-100/50 pt-6 pb-2 shadow-sm transition-all">
                <div className="px-4 flex items-center justify-between mb-4">
                    <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest font-mono">
                        {filters.categories.length > 0 ? `${filters.categories.length} Categories` : 'All Products'}
                    </span>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-zinc-200"
                    >
                        <FiFilter />
                        Filters
                    </button>
                </div>

                {/* Horizontal Quick Filters */}
                <div className="flex overflow-x-auto scrollbar gap-2 px-4 pb-2">
                    {["All", "Tops", "Bottoms", "Outerwear", "Dresses", "Activewear", "Accessories"].map((cat) => {
                        const isAll = cat === "All";
                        const isActive = isAll
                            ? filters.categories.length === 0
                            : filters.categories.includes(cat);

                        return (
                            <button
                                key={cat}
                                onClick={() => {
                                    if (isAll) {
                                        handleApplyFilters({ ...filters, categories: [] });
                                    } else {
                                        const newCats = filters.categories.includes(cat)
                                            ? filters.categories.filter(c => c !== cat)
                                            : [...filters.categories, cat];
                                        handleApplyFilters({ ...filters, categories: newCats });
                                    }
                                }}
                                className={`whitespace-nowrap px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 shrink-0
                                    ${isActive
                                        ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                                        : 'bg-white border-zinc-100 text-zinc-400 hover:border-zinc-200'}`}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-10 lg:px-20 py-8 lg:py-12">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                    {/* Sidebar with Drawer functionality for Mobile */}
                    <div className={`
                        fixed inset-0 z-[100] xl:relative xl:z-0 xl:col-span-3 transition-all duration-500
                        ${isSidebarOpen ? 'visible' : 'invisible xl:visible'}
                    `}>
                        {/* Backdrop */}
                        <div
                            className={`absolute inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-500 xl:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
                            onClick={() => setIsSidebarOpen(false)}
                        />

                        {/* Sidebar Content */}
                        <div className={`
                            absolute left-0 top-0 bottom-0 w-[300px] md:w-[350px] bg-white p-8 xl:p-0 shadow-2xl xl:shadow-none xl:bg-transparent overflow-y-auto xl:overflow-visible transition-transform duration-500 xl:translate-x-0 xl:w-full
                            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                        `}>
                            <div className="flex items-center justify-between mb-8 xl:hidden">
                                <h2 className="text-xl font-black text-zinc-900 uppercase">Filters</h2>
                                <button onClick={() => setIsSidebarOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                                    <IoClose size={24} />
                                </button>
                            </div>
                            <SideBar filters={filters} setFilters={handleApplyFilters} />
                        </div>
                    </div>

                    <div className="xl:col-span-9">
                        <ProductList filters={filters} />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Product;
