const Footer = () => {
    return (

        <div className={"flex flex-col lg:mt-[55px] bg-gray-900 text-white w-[100%]"}>
            <div
                className={"flex justify-between  lg:px-[80px] w-[100%] lg:py-4 border-b border-gray-700"}>
                <div className={"flex flex-col"}>
                    <p className={"font-bold hover:text-gray-300 cursor-pointer transition"}>Getting started</p>
                    <span>Release Notes</span>
                    <span>Upgrade Guide</span>
                </div>

                <div className={"flex flex-col"}>
                    <p className={"font-bold hover:text-gray-300 cursor-pointer transition"}>Explore</p>
                    <span>Prototyping</span>
                    <span>Design System</span>
                </div>

                <div className={"flex flex-col"}>
                    <p className={"font-bold hover:text-gray-300 cursor-pointer transition"}>Community</p>
                    <span>Discussion Forums</span>
                    <span>Code of Conduct</span>
                </div>
            </div>

            <div className={"lg:px-[80px] lg:py-3"}>
                <span>Fashion eCommerce. &copy; 2026</span>
            </div>
        </div>
    )
}

export default Footer;