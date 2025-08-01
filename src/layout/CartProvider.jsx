import { useQuery } from "@tanstack/react-query";
import React, { createContext, useContext } from "react";
import CartAPI from "../api/cart.api";
import { useLayout } from "./LayoutProvider";

const CartContext = createContext();

const useCart = () => {
  return useContext(CartContext);
};

const CartProvider = ({ children }) => {
  const { AccessToken, Auth } = useLayout();

  const { data, isLoading } = useQuery({
    queryKey: ["ListsCart", { AccessToken, Auth }],
    queryFn: async () => {
      const body = {
        order: {
          ID: 0,
          SenderID: Auth?.ID,
          VCode: null,
        },
        addProps: "ProdTitle",
      };

      const { data } = await CartAPI.list({ token: AccessToken, body });
      return data?.data;
    },
    enabled: !!AccessToken && Number(Auth?.ID) > 0,
    initialData: {
      data: [],
    },
  });

  return (
    <CartContext.Provider
      value={{
        Orders: data,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider, useCart };
