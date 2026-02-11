import homePic1 from "../../assets/img/home_image_1.png";
import homePic2 from "../../assets/img/home_image_2.png";


const About = () => {
    return (<div className={"lg:px-[80px] lg:w-[100%]"}>
        <h2 className={"lg:text-[30px] font-bold lg:text-start lg:w-[100%] text-gray-900"}>ABOUT US</h2>
        <p className={"text-gray-600"}>
            We help you discover and express your personal style through carefully curated fashion collections.
            Our mission is to bring high-quality,
            <p className={"text-gray-600"}> stylish products closer to people who value design, comfort, and
                individuality.</p>
        </p>

        <div className={"lg:grid lg:gap-4 lg:grid-cols-2 lg:mt-[50px]"}>
            <div className={"lg:order-1"}>
                <img src={homePic1}/>
            </div>

            <div className={"lg:flex lg:flex-col lg:items-center lg:justify-center lg:order-2"}>
                <h2 className={"font-bold lg:text-[24px]"}>Provide fashionable and high-quality products</h2>
                <p className={"text-gray-600"}>Our products are thoughtfully designed to meet modern fashion
                    standards while ensuring comfort and durability.
                    Millions of customers trust us for styles that stay relevant and quality that lasts.</p>
            </div>
        </div>

        <div className={"lg:grid lg:gap-4 lg:grid-cols-2 lg:mt-[50px]"}>
            <div className={"lg:flex lg:flex-col lg:items-center lg:justify-center lg:order-1"}>
                <h2 className={"font-bold lg:text-[24px]"}>Inspired by trends, designed for everyday life</h2>
                <p className={"text-gray-600"}>As fashion evolves, so do we.
                    We continuously adapt to new trends and customer needs, delivering collections that balance
                    innovation, practicality, and timeless design.</p>
            </div>

            <div className={"lg:order-2"}>
                <img src={homePic2}/>
            </div>
        </div>

        <div className={"lg:mt-[50px]"}>
            <h2 className={"font-bold lg:text-[24px]"}>Keep in touch with us</h2>
            <div className={"lg:grid lg:gap-4 lg:grid-cols-2 lg:mt-[20px]"}>

                <div>
                    <div>
                        <p className={"lg:font-bold"}>Address</p>
                        <p className={"lg:text-gray-600"}>K44/8, Ngo Chi Lan St, Hai Chau Dt.</p>
                    </div>

                    <div className={"lg:mt-3"}>
                        <p className={"lg:font-bold"}>Email</p>
                        <p className={"lg:text-gray-600"}>annguyendang.17.07.2002@gmail.com</p>
                    </div>

                    <div className={"lg:mt-3"}>
                        <p className={"lg:font-bold"}>Phone</p>
                        <p className={"lg:text-gray-600"}>079 450 4074</p>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}

export default About;