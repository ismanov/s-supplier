import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Spin } from "antd";

import effector from "../effector";

import { UpdateProductForm } from "../organisms/update-product-form";

const { store, events, effects } = effector;


export const UpdateProduct = ({ productId, openedProducts, setOpenedProducts }) => {
  const $productInfo = useStore(store.$productInfo);

  const [ product, setProduct ] = useState(null);

  useEffect(() => {
    effects.getProductInfoEffect({
      id: productId
    });

    return () => {
      events.resetProductInfoEvent();
    }
  }, []);

  useEffect(() => {
    if ($productInfo[productId] && Object.keys($productInfo[productId].data).length > 0) {
      setProduct($productInfo[productId].data);
    }
  }, [$productInfo]);

  return (
    <div className="update-product">
      {product ? <UpdateProductForm product={product} openedProducts={openedProducts} setOpenedProducts={setOpenedProducts} />
        :
        <div className="abs-loader">
          <Spin size="large"/>
        </div>
      }
    </div>
  )
};