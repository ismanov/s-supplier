import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Checkbox, Collapse, Empty, Spin, Pagination } from "antd";

import effector from "../effector";

import { RenderExtra } from "../molecules/product-extra";
import { UpdateProduct } from "../templates/update-product";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";

const { Panel } = Collapse;

const { store, events, effects } = effector;

const RenderHeader = ({ product, openedProducts, setOpenedProducts }) => {
  const onOpenProduct = () => {
    const openedProductsLocal = [...openedProducts];

    if (openedProductsLocal.includes(product.id)) {
      const index = openedProductsLocal.indexOf(product.id);
      openedProductsLocal.splice(index, 1);
    } else {
      openedProductsLocal.push(product.id);
    }

    setOpenedProducts(openedProductsLocal);
  };

  return (
    <div className="catalog__products__title" onClick={onOpenProduct}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          paddingRight: "1.5vw",
        }}
      >
        <div>{product.name} {product?.capacity}</div>
        <div>
          {product.price
            ? product.price.toString().toLocaleString() +
              " сум"
            : ""}
        </div>
      </div>
    </div>
  );
};

export const Products = () => {
  const $productList = useStore(store.$productList);
  const $productListFilterProps = useStore(store.$productListFilterProps);
  const $productsBatch = useStore(store.$productsBatch);
  const $addProduct = useStore(store.$addProduct);
  const $deleteProduct = useStore(store.$deleteProduct);
  const $updateProductsBatch = useStore(store.$updateProductsBatch);

  const { content: productsData, totalElements: productsTotal } =
    $productList.data;

  const [openedProducts, setOpenedProducts] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);

  useEffect(() => {
    return () => {
      events.resetProductListFilterPropsEvent();
      events.resetProductListEvent();
    };
  }, []);

  useEffect(() => {
    if (openedProducts.length) {
      setOpenedProducts([]);
    }

    if ($productListFilterProps.categoryId) {
      effects.getProductListEffect($productListFilterProps);
    }
  }, [$productListFilterProps]);

  useEffect(() => {
    if ($addProduct.success || $updateProductsBatch.success) {
      effects.getProductListEffect($productListFilterProps);
    }
  }, [$addProduct.success, $updateProductsBatch.success]);

  useEffect(() => {
    if ($deleteProduct.success) {
      openNotificationWithIcon("success", "Товар удалён");
      events.resetDeleteProductEvent();

      effects.getProductListEffect($productListFilterProps);
    }
  }, [$deleteProduct.success]);

  useEffect(() => {
    if (productsData.length) {
      let hasProducts = true;

      productsData.forEach((item) => {
        if (!$productsBatch.includes(item.id)) {
          hasProducts = false;
        }
      });

      setSelectedAll(hasProducts);
    }
  }, [productsData, $productsBatch]);

  const changePagination = (page, size) => {
    events.updateProductListFilterPropsEvent({
      page: page - 1,
      size,
    });
  };

  const onSelectAllProduct = (value) => {
    let ids = [...$productsBatch];

    productsData.forEach((item) => {
      const index = ids.indexOf(item.id);

      if (value) {
        ids.push(item.id);
      } else {
        ids.splice(index, 1);
      }
    });

    events.addProductsBatchEvent(ids);
  };

  const products = productsData.map((product) => {
    return (
      <Panel
        key={product.id}
        header={
          <RenderHeader
            product={product}
            openedProducts={openedProducts}
            setOpenedProducts={setOpenedProducts}
          />
        }
        extra={
          <RenderExtra
            price={(product.salesPrice || 0).toString()}
            productId={product.id}
            branchId={$productListFilterProps.branchId}
          />
        }
      >
        <UpdateProduct
          productId={product.id}
          openedProducts={openedProducts}
          setOpenedProducts={setOpenedProducts}
        />
      </Panel>
    );
  });

  return (
    <div className="catalog__products catalog__row">
      {products.length ? (
        <>
          <div className="catalog__products__head">
            {products.length > 1 && (
              <Checkbox
                className="catalog__products__head-checkbox"
                checked={selectedAll}
                onChange={(e) => onSelectAllProduct(e.target.checked)}
              />
            )}
            <div className="catalog__products__head-row1">Название товара</div>
            <div className="catalog__products__head-row2">Стоимость</div>
          </div>
          <Collapse
            expandIconPosition="right"
            destroyInactivePanel={true}
            activeKey={openedProducts}
          >
            {products}
          </Collapse>
          <div className="catalog__products__pagination">
            <Pagination
              onChange={changePagination}
              current={
                $productListFilterProps.page
                  ? $productListFilterProps.page + 1
                  : 1
              }
              total={productsTotal}
              pageSize={$productListFilterProps.size}
              hideOnSinglePage={true}
            />
          </div>
        </>
      ) : (
        <div className="abs-loader">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      )}
      {$productList.loading && (
        <div className="abs-loader">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};
