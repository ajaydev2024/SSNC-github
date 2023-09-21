import Image from 'next/image';
import React from 'react';
import brands from '../pages/api/brandList';
import { useBrandContext } from './BrandContext';



const HomeBrands = () => {
    const { setSelectedBrand } = useBrandContext();

    const handleBrandClick = (brandName) => {
        setSelectedBrand(brandName);
    };

    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6  py-4">
            <div className="text-center pb-2 mt-20 lg:mt-0 lg:px-4">
                <h2 className="text-sm sm:text-sm md:text-md lg:text-2xl   font-bold text-blue-600">
                    Click on Brands to Proceed
                </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-9 gap-6">
                {/* Replace with your brand data */}
                {brands.map((brand, index) => (
                    <div
                        key={index}
                        onClick={() => handleBrandClick(brand.name)}
                        className="w-full bg-gray-900 rounded-lg p-12 flex flex-col justify-center items-center hover:scale-110 shadow-lg cursor-pointer"
                    >
                        <div className="mb-8 ">
                            <Image
                                className="object-center object-cover "
                                src={brand.imageSrc}
                                width={1000}
                                height={500}
                                blurDataURL="data:..."
                                placeholder="blur" // Optional blur-up while loading
                                alt={brand.altText}
                            />
                        </div>
                        <div className="text-center">
                            <p className="text-sm sm:text-sm  md:text-md lg:text-xl  text-white font-bold mb-2">{brand.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HomeBrands;


