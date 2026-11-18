
import ProductCard from '../ProductCard';
import './style.css';

function ProductListing({ products = [] }) {
  return (
    <div className="product-listing">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          image={product.image}
          price={product.price}
          priceDiscount={product.priceDiscount}
        />
      ))}
    </div>
  );
}

export default ProductListing;
