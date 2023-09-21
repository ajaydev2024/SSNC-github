import React ,{useEffect} from 'react';
import Client from 'shopify-buy';

const ProductCard = ({ product }) => {
  useEffect(() => {
    async function setCountryInCheckout() {
      try {
        const shop = await client.shop.fetchInfo();

        const shopCountry = shop.countryCode;

        const checkout = await client.checkout.create();

        // Set the shop's country in the checkout
        await client.checkout.updateAttributes(checkout.id, {
          country: shopCountry,
        });
      } catch (error) {
        console.error('Error setting shop country in checkout:', error);
      }
    }

    setCountryInCheckout();
  }, []);

  const client = Client.buildClient({
    domain: 'flex-wheeler.myshopify.com',
    storefrontAccessToken: '654ba1b2fc5161d5e9c92d68adc8bda4',
  });

  const addToCart = async () => {
    try {
        const variantId = product.variants[0].id;

        // Construct the cart URL
        const cartUrl = `https://flex-wheeler.myshopify.com/cart/${variantId}:1`;
  
        // Redirect to the cart URL
        window.location.href = cartUrl;
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  

  const truncatedBodyHtml = product.body_html.substring(0, product.body_html.indexOf('</p>', product.body_html.indexOf('</p>') + 1) + 140); // Truncate to the first 2 lines

  return (
    <>
   
<div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
  
    <a href="#">
        <img class="rounded-t-lg"   src={product.images[0].src}        alt={product.title} />
    </a>
    <div class="p-5">
        <a href="#">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{product.title}</h5>
        </a>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400"><div dangerouslySetInnerHTML={{ __html: truncatedBodyHtml }} /></p>
        <p className="text-lg font-semibold mb-2">Price: ₹{product.variants[0].price}</p>

        <a   onClick={addToCart} class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Add to Cart
             <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
        </a>
    </div>
</div>

</>
  );
};

export default ProductCard;
