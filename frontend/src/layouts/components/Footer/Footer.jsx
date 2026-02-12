const Footer = () => {
    return (
        <div className={"lg:flex md:flex-col lg:mt-[55px] bg-gray-900 text-white w-[100%]"}>
            <div
                className={"flex-col lg:flex lg:flex-row justify-between lg:px-[80px] w-[100%] lg:py-4 border-b border-gray-700"}>
                <div className={"flex flex-col items-center"}>
                    <p className={"font-bold hover:text-gray-300 cursor-pointer transition mt-5 lg:mt-0"}>Getting
                        started</p>
                    <span>Release Notes</span>
                    <span>Upgrade Guide</span>
                </div>

                <div className={"flex flex-col items-center mt-5 lg:mt-0"}>
                    <p className={"font-bold hover:text-gray-300 cursor-pointer transition"}>Explore</p>
                    <span>Prototyping</span>
                    <span>Design System</span>
                </div>

                <div className={"flex flex-col items-center mt-5 mb-5 lg:mb-0 lg:mt-0"}>
                    <p className={"font-bold hover:text-gray-300 cursor-pointer transition"}>Community</p>
                    <span>Discussion Forums</span>
                    <span>Code of Conduct</span>
                </div>
            </div>

            <div className={"text-center lg:text-start mt-1 lg:mt-0 lg:px-[80px] lg:py-3"}>
                <span>Fashion eCommerce. &copy; 2026</span>
            </div>
        </div>
    )
}

export default Footer;