import { createContext, useContext, useState, useEffect } from "react";
import { authFetch, getAccessToken } from "../src/utils/auth";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    // Fetch cart from API
    const fetchCart = async () => {
        try {
            const res = await authFetch(`${BASEURL}/api/cart/`)
            if (!res.ok) {
                setCartItems([]);
                setTotal(0);
                return;
                throw new Error("Failed to fetch cart");
            }

            const data = await res.json();
            setCartItems(data.items || []);
            setTotal(data.total || 0);

        } catch (error) {
            console.log("Error fetching cart:", error);
        }
    }


    useEffect(() => {
        fetchCart();
    }, []);


    // Add to cart
    const addToCart = async (productId) => {
        try {
            await authFetch(`${BASEURL}/api/cart/add/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ product_id: productId }),
            });
            fetchCart();
        } catch (error) {
            console.log("Error adding to cart: ", error);
        }
    };

    // Remove from cart
    const removeFromCart = async (itemId) => {
        try {
            await authFetch(`${BASEURL}/api/cart/remove/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ item_id: itemId }),
            });
            fetchCart();
        } catch (error) {
            console.log("Error removing to cart: ", error);
        }
    }


    // Update qty 
    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) {
            await removeFromCart(itemId);
            fetchCart();
            return;
        }

        try {
            await authFetch(`${BASEURL}/api/cart/update/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ item_id: itemId, quantity: quantity }),
            });
            fetchCart();
        } catch (error) {
            console.log("Error updating cart items: ", error);
        }
    }

    const clearCart = () => {
        setCartItems([]);
        setTotal(0)
    }

    return (
        <CartContext.Provider
            value={{ cartItems, total, fetchCart, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
