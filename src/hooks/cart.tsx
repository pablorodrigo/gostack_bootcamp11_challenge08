import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      console.log('loadProducts');
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const productsStoraged = await AsyncStorage.getItem(
        '@GoMarketPlace:products',
      );

      if (productsStoraged) {
        setProducts(JSON.parse(productsStoraged));
      }
    }

    loadProducts();
  }, []);

  /* useEffect(() => {
    async function updateStoredProducts(): Promise<void> {
      await AsyncStorage.setItem(
        '@GoMarketPlace:products',
        JSON.stringify(products),
      );
    }

    updateStoredProducts();
  }, [products]); */

  async function addInAsyncStorage(): Promise<void> {
    await AsyncStorage.setItem(
      '@GoMarketPlace:products',
      JSON.stringify(products),
    );
  }

  const addToCart = useCallback(
    async (product: Product) => {
      console.log(addToCart);
      console.log(products);
      const checkIfNewProduct = products.find(item => item.id === product.id);

      if (!checkIfNewProduct) {
        product.quantity = 1;
        setProducts([...products, product]);
        await addInAsyncStorage();
        return;
      }

      const updatedProducts = products.map(item => {
        if (item.id !== product.id) return item;

        const updatedProduct = {
          ...item,
          quantity: item.quantity += 1,
        };

        return updatedProduct;
      });

      setProducts(updatedProducts);
      await addInAsyncStorage();
    },
    [addInAsyncStorage, products],
  );

  const increment = useCallback(
    async id => {
      console.log('increment');
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
      const updatedProducts = products.map(item => {
        if (item.id !== id) return item;

        const updatedProduct = {
          ...item,
          quantity: item.quantity += 1,
        };

        return updatedProduct;
      });

      setProducts(updatedProducts);
      await addInAsyncStorage();
    },
    [addInAsyncStorage, products],
  );

  const decrement = useCallback(
    async id => {
      console.log('decrement');
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      const updatedProducts = products
        .map(product => {
          if (product.id !== id) return product;

          const updatedProduct = {
            ...product,
            quantity: product.quantity -= 1,
          };

          return updatedProduct;
        })
        .filter(product => product.quantity > 0);

      setProducts(updatedProducts);
      await addInAsyncStorage();
    },
    [addInAsyncStorage, products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
