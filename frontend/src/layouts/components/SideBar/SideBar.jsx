import { useState, useEffect } from "react";

const SideBar = ({ filters, setFilters }) => {
    const categoriesList = ["Tops", "Bottoms", "Outerwear", "Dresses", "Activewear", "Accessories"];
    const sizesList = ["S", "M", "L", "XL", "XXL"];
    const gendersList = ["Men", "Women"];

    const [localFilters, setLocalFilters] = useState({
        categories: [],
        genders: [],
        sizes: [],
        minPrice: 0,
        maxPrice: 400000
    });

    useEffect(() => {
        if (filters) {
            setLocalFilters(filters);
        }
    }, [filters]);

    const handleCheckboxChange = (type, value) => {
        setLocalFilters(prev => {
            const currentList = prev[type];
            if (currentList.includes(value)) {
                return { ...prev, [type]: currentList.filter(item => item !== value) };
            } else {
                return { ...prev, [type]: [...currentList, value] };
            }
        });
    };

    const handlePriceChange = (e) => {
        setLocalFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }));
    };

    const handleApply = () => {
        setFilters(localFilters);
    };

    return (
        <div className="w-full bg-white rounded-[2rem] shadow-2xl shadow-zinc-100 border border-zinc-100/50 p-8 lg:sticky lg:top-24 animate-scale-in">
            <div className="flex items-center justify-between mb-8 border-b border-zinc-50 pb-6">
                <h2 className="text-2xl font-black text-zinc-900 tracking-tighter">Filters</h2>
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
            </div>

            {/* Category Section */}
            <div className="mb-10">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-5">Category</h3>
                <ul className="space-y-4">
                    {categoriesList.map((category, index) => (
                        <li key={index} className="flex items-center group cursor-pointer" onClick={() => handleCheckboxChange('categories', category)}>
                            <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center 
                                          ${localFilters.categories.includes(category)
                                    ? 'bg-indigo-600 border-indigo-600'
                                    : 'bg-zinc-50 border-zinc-200 group-hover:border-indigo-400'}`}>
                                {localFilters.categories.includes(category) && (
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                )}
                            </div>
                            <span className={`ml-3 text-sm font-bold transition-colors
                                           ${localFilters.categories.includes(category) ? 'text-zinc-900' : 'text-zinc-500 group-hover:text-indigo-600'}`}>
                                {category}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Gender Section */}
            <div className="mb-10 pt-8 border-t border-zinc-50">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-5">Gender</h3>
                <div className="flex flex-wrap gap-2">
                    {gendersList.map((gender, index) => (
                        <div
                            key={index}
                            onClick={() => handleCheckboxChange('genders', gender)}
                            className={`px-4 py-2 rounded-xl border-2 text-xs font-black tracking-widest uppercase cursor-pointer transition-all
                                      ${localFilters.genders.includes(gender)
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                                    : 'bg-white border-zinc-100 text-zinc-400 hover:border-indigo-400 hover:text-indigo-600'}`}
                        >
                            {gender}
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Section */}
            <div className="mb-10 pt-8 border-t border-zinc-50">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-5">Max Price</h3>
                <div className="px-1">
                    <input
                        type="range"
                        min="0"
                        max="400000"
                        step="1000"
                        value={localFilters.maxPrice}
                        onChange={handlePriceChange}
                        className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between items-center mt-6">
                        <div className="bg-zinc-50 px-3 py-2 rounded-xl border border-zinc-100 text-[11px] font-black text-zinc-900">
                            FREE
                        </div>
                        <div className="w-4 h-px bg-zinc-200"></div>
                        <div className="bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-100 text-[11px] font-black text-indigo-700">
                            {localFilters.maxPrice.toLocaleString('vi-VN')} ₫
                        </div>
                    </div>
                </div>
            </div>

            {/* Size Section */}
            <div className="mb-10 pt-8 border-t border-zinc-50">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-5">Size</h3>
                <div className="flex flex-wrap gap-2">
                    {sizesList.map((size, index) => {
                        const isSelected = localFilters.sizes.includes(size);
                        return (
                            <div
                                key={index}
                                onClick={() => handleCheckboxChange('sizes', size)}
                                className={`w-11 h-11 flex items-center justify-center rounded-xl border-2 text-xs font-black cursor-pointer transition-all
                                          ${isSelected
                                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-xl shadow-zinc-200'
                                        : 'border-zinc-100 text-zinc-400 hover:border-zinc-900 hover:text-zinc-900'}`}
                            >
                                {size}
                            </div>
                        );
                    })}
                </div>
            </div>

            <button
                onClick={handleApply}
                className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px]
                         shadow-xl shadow-zinc-100 hover:bg-indigo-600 hover:shadow-indigo-100 hover:-translate-y-1 
                         active:scale-95 transition-all duration-300"
            >
                Apply Filters
            </button>
        </div>
    );
};;

export default SideBar;