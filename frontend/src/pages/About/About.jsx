import homePic1 from "../../assets/img/home_image_1.png";
import homePic2 from "../../assets/img/home_image_2.png";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";

const About = () => {
    return (
        <div className="bg-white text-zinc-900 pt-[100px] lg:pt-[140px] pb-20 px-4 md:px-10 lg:px-20 overflow-x-hidden">
            <div className="max-w-[1400px] mx-auto">
                {/* Hero Section */}
                <header className="mb-16 lg:mb-28 animate-scale-in">
                    <h1 className="font-black text-5xl md:text-7xl lg:text-9xl tracking-tighter leading-none mb-8">
                        ABOUT <span className="text-zinc-400">US</span>
                    </h1>
                    <div className="max-w-2xl">
                        <p className="text-lg md:text-xl text-zinc-600 leading-relaxed">
                            We help you discover and express your personal style through carefully curated fashion collections.
                            Our mission is to bring high-quality, stylish products closer to people who value design, comfort, and individuality.
                        </p>
                    </div>
                </header>

                {/* Section 1 */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center mb-20 lg:mb-40">
                    <div className="order-2 lg:order-1 group">
                        <div className="relative overflow-hidden rounded-3xl lg:rounded-[4rem] aspect-[4/5] lg:aspect-square shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                            <img
                                src={homePic1}
                                alt="Fashion Display"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0"></div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-6 lg:space-y-8">
                        <h2 className="font-black text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-tight uppercase">
                            Premium <br /> Quality <br /> Standards
                        </h2>
                        <p className="text-zinc-600 text-lg md:text-xl leading-relaxed">
                            Our products are thoughtfully designed to meet modern fashion standards while ensuring comfort and durability.
                            Millions of customers trust us for styles that stay relevant and quality that lasts.
                        </p>
                        <div className="w-20 h-1 bg-zinc-900"></div>
                    </div>
                </section>

                {/* Section 2 */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center mb-20 lg:mb-40">
                    <div className="space-y-6 lg:space-y-8">
                        <h2 className="font-black text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-tight uppercase">
                            Inspired <br /> By Modern <br /> Life
                        </h2>
                        <p className="text-zinc-600 text-lg md:text-xl leading-relaxed">
                            As fashion evolves, so do we. We continuously adapt to new trends and customer needs,
                            delivering collections that balance innovation, practicality, and timeless design.
                        </p>
                        <div className="w-20 h-1 bg-zinc-900 ml-auto lg:ml-0"></div>
                    </div>

                    <div className="group">
                        <div className="relative overflow-hidden rounded-3xl lg:rounded-[4rem] aspect-[4/5] lg:aspect-square shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                            <img
                                src={homePic2}
                                alt="Design Process"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0"></div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="bg-zinc-950 rounded-[2.5rem] lg:rounded-[5rem] p-10 lg:p-24 text-white">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        <div>
                            <h2 className="font-black text-4xl md:text-5xl lg:text-7xl tracking-tighter uppercase mb-6">
                                Keep In <br /> Touch
                            </h2>
                            <p className="text-zinc-400 text-lg max-w-sm">
                                Have questions or want to collaborate? Reach out to our team anytime.
                            </p>
                        </div>

                        <div className="grid gap-8">
                            {/* Address */}
                            <div className="flex items-start gap-4 group">
                                <div className="p-3 sm:p-4 bg-zinc-900 rounded-2xl group-hover:bg-indigo-600 transition-colors shrink-0">
                                    <MdLocationOn className="text-xl sm:text-2xl md:text-[28px]" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-widest mb-1 text-zinc-500">Address</p>
                                    <p className="text-base sm:text-lg md:text-xl font-medium break-words">K44/8, Ngo Chi Lan St, Hai Chau Dt.</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4 group">
                                <div className="p-3 sm:p-4 bg-zinc-900 rounded-2xl group-hover:bg-indigo-600 transition-colors shrink-0">
                                    <MdEmail className="text-xl sm:text-2xl md:text-[28px]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[11px] font-bold uppercase tracking-widest mb-1 text-zinc-500">Email</p>
                                    <p className="text-base sm:text-lg md:text-xl font-medium break-all">annguyendang.17.07.2002@gmail.com</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4 group">
                                <div className="p-3 sm:p-4 bg-zinc-900 rounded-2xl group-hover:bg-indigo-600 transition-colors shrink-0">
                                    <MdPhone className="text-xl sm:text-2xl md:text-[28px]" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-widest mb-1 text-zinc-500">Phone</p>
                                    <p className="text-base sm:text-lg md:text-xl font-medium">079 450 4074</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
