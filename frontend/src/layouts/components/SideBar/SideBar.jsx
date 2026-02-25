const SideBar = () => {
    const categories = ["Tops", "Bottoms", "Outerwear", "Dresses", "Activewear", "Accessories"];
    const sizes = ["S", "M", "L", "XL", "XXL"];
    const genders = ["Men", "Women", "Unisex"];

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 xl:mr-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Filters</h2>

            {/* Categories */}
            <div className="mb-8">
                <h3 className="font-semibold text-gray-700 mb-4 tracking-wide uppercase text-sm">Category</h3>
                <ul className="space-y-3">
                    {categories.map((category, index) => (
                        <li key={index} className="flex items-center group cursor-pointer">
                            <input
                                type="checkbox"
                                id={`cat-${index}`}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <label
                                htmlFor={`cat-${index}`}
                                className="ml-3 text-sm font-medium text-gray-600 group-hover:text-blue-600 cursor-pointer transition-colors"
                            >
                                {category}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Gender */}
            <div className="mb-8 border-t pt-6">
                <h3 className="font-semibold text-gray-700 mb-4 tracking-wide uppercase text-sm">Gender</h3>
                <ul className="space-y-3">
                    {genders.map((gender, index) => (
                        <li key={index} className="flex items-center group cursor-pointer">
                            <input
                                type="checkbox"
                                id={`gender-${index}`}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <label
                                htmlFor={`gender-${index}`}
                                className="ml-3 text-sm font-medium text-gray-600 group-hover:text-blue-600 cursor-pointer transition-colors"
                            >
                                {gender}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price Range (Visual only for now) */}
            <div className="mb-8 border-t pt-6">
                <h3 className="font-semibold text-gray-700 mb-4 tracking-wide uppercase text-sm">Price Range</h3>
                <div className="px-2">
                    <input
                        type="range"
                        min="0"
                        max="5000000"
                        step="100000"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between items-center mt-4 text-sm font-medium text-gray-600">
                        <span className="bg-gray-100 px-3 py-1 rounded-md border border-gray-200">0 ₫</span>
                        <span className="text-gray-400">-</span>
                        <span className="bg-gray-100 px-3 py-1 rounded-md border border-gray-200">5,000,000 ₫</span>
                    </div>
                </div>
            </div>

            {/* Sizes */}
            <div className="mb-6 border-t pt-6">
                <h3 className="font-semibold text-gray-700 mb-4 tracking-wide uppercase text-sm">Size</h3>
                <div className="flex flex-wrap gap-2">
                    {sizes.map((size, index) => (
                        <div
                            key={index}
                            className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 text-sm font-medium text-gray-600 hover:border-blue-600 hover:text-blue-600 cursor-pointer transition-colors"
                        >
                            {size}
                        </div>
                    ))}
                </div>
            </div>

            {/* Apply Button */}
            <button className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors mt-4">
                Apply Filters
            </button>
        </div>
    );
};

export default SideBar;