import React, { useState } from "react";
import { useStore } from "effector-react";
import { Button } from "antd";

import effector from "../effector";

import { AddProductModal } from "./add-product-modal";
import { AddPlusSvg } from "svgIcons/svg-icons";

const { store, events, effects } = effector;

export const ProductsHead = () => {
  const $productListFilterProps = useStore(store.$productListFilterProps);

  const [productEditProps, setProductEditProps] = useState({
    visible: false,
    shouldRender: false,
  });

  const onProductAdd = () => {
    setProductEditProps({ visible: true, shouldRender: true });
  };

  return (
    <>
      <div className="catalog__categories__head">
        <div className="catalog__categories__head-title">
          Товары
          <Button
            //disabled={!$productListFilterProps.categoryId}
            className="custom-button primary-button onlyicon m-l-15"
            onClick={onProductAdd}
          >
            <AddPlusSvg />
          </Button>
        </div>
      </div>
      {productEditProps.shouldRender && (
        <AddProductModal
          modalProps={productEditProps}
          setModalProps={setProductEditProps}
        />
      )}
    </>
  );
};
