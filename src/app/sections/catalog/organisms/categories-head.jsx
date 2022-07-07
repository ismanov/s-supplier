import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Button } from "antd";

import effector from "../effector";

import { UpdateCategoryModal } from "./update-category-modal";

import { AddPlusSvg, DownloadSvg, UploadSvg } from "svgIcons/svg-icons";
import { UploadProductListModal } from "./upload-product-list-modal";
import { SyncOutlined } from "@ant-design/icons";
import { SyncCatalogModal } from "./sync-catalog-modal";

const { store, events, effects } = effector;

export const CategoriesHead = () => {
  const $downloadAllCategoriesExcel = useStore(
    store.$downloadAllCategoriesExcel
  );
  const $categoriesFilterProps = useStore(store.$categoriesFilterProps);

  const [categoryEditProps, setCategoryEditProps] = useState({
    visible: false,
    shouldRender: false,
  });

  const [productListUploadModalProps, setProductListUploadModalProps] =
    useState({
      visible: false,
      shouldRender: false,
    });

  const [syncCatalogModalProps, setSyncCatalogModalProps] = useState({
    visible: false,
    shouldRender: false,
  });

  useEffect(() => {
    if ($downloadAllCategoriesExcel.data) {
      const data = $downloadAllCategoriesExcel.data;
      const urlCreator = window.URL || window.webkitURL;
      const fileUrl = urlCreator.createObjectURL(data);
      window.open(fileUrl);

      events.resetDownloadAllCategoriesExcelEvent();
    }
  }, [$downloadAllCategoriesExcel.data]);

  const onCategoryAdd = () => {
    setCategoryEditProps({ visible: true, shouldRender: true });
  };

  const onDownloadExcel = () => {
    effects.downloadAllCategoriesExcelEffect({
      branchId: $categoriesFilterProps.branchId,
    });
  };

  const onUploadExcel = () => {
    setProductListUploadModalProps({ visible: true, shouldRender: true });
  };

  const onSyncCatalog = () => {
    setSyncCatalogModalProps({ visible: true, shouldRender: true });
  };

  return (
    <>
      <div className="catalog__categories__head">
        <div className="catalog__categories__head-title">
          Категории и подкатегории
          <Button
            onClick={onCategoryAdd}
            className="custom-button primary-button onlyicon m-l-15"
          >
            <AddPlusSvg />
          </Button>
          <Button
            onClick={onDownloadExcel}
            className="custom-button primary-button onlyicon m-l-10"
            loading={$downloadAllCategoriesExcel.loading}
          >
            <DownloadSvg />
          </Button>
          <Button
            onClick={onUploadExcel}
            className="custom-button primary-button onlyicon m-l-10"
          >
            <UploadSvg />
          </Button>
          <Button
            onClick={onSyncCatalog}
            className="custom-button primary-button onlyicon m-l-10"
          >
            <SyncOutlined
              style={{ color: "#009f3c", fontSize: "1.1em", fontWeight: 900 }}
            />
          </Button>
        </div>
      </div>
      {categoryEditProps.shouldRender && (
        <UpdateCategoryModal
          modalProps={categoryEditProps}
          setModalProps={setCategoryEditProps}
        />
      )}
      {productListUploadModalProps.shouldRender && (
        <UploadProductListModal
          modalProps={productListUploadModalProps}
          setModalProps={setProductListUploadModalProps}
        />
      )}
      {syncCatalogModalProps.shouldRender && (
        <SyncCatalogModal
          modalProps={syncCatalogModalProps}
          setModalProps={setSyncCatalogModalProps}
        />
      )}
    </>
  );
};
