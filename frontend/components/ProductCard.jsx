import { Link } from "react-router-dom";

function ProductCard({ product }) {
    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL;

    return (
        <Link to={`/products/${product.id}`}>
            <div className="bg-white rounded-x1 shadow-md hover:shadow-1g hover:scale-[1.02] transition-transform p-4 cursor-pointer">
                <img
                    src={`${BASE_URL}${product.image}`}
                    alt={product.name}
                    className="w-full h-56 object-cover rounded-lg mb-4"
                />

                <h2 className="text-ig font-semibold text-gray-800 truncate">{product.name} </h2>
                <p className="font-medium text-gray-600"> {product.price} </p>
            </div>
        </Link>
    );
}

export default ProductCard;