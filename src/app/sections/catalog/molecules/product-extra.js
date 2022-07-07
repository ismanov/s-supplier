import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Button, Checkbox, Popconfirm } from "antd";

import effector from "../effector";

import ContentEditable from "react-contenteditable";
import { formatPriceProduct } from "helpers/format-price";
import { DoneSvg, TrashSvg } from "svgIcons/svg-icons";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";

const { store, events, effects } = effector;

export const RenderExtra = ({ price, productId, branchId }) => {
  const $productsBatch = useStore(store.$productsBatch);
  const $productList = useStore(store.$productList);
  const $categoriesFilterProps = useStore(store.$categoriesFilterProps);
  const $updateProduct = useStore(store.$updateProduct);
  const $productListFilterProps = useStore(store.$productListFilterProps);

  const [inputValue, setInputValue] = useState({
    html: price,
  });
  const [fieldsErrors, setFieldsErrors] = useState({});

  const [priceUpdateDisabled, setPriceUpdateDisabled] = useState(true);

  useEffect(() => {
    if (price !== inputValue.html) {
      setInputValue({
        html: price,
      });
    }
  }, [price]);

  useEffect(() => {
    if ($updateProduct[productId] && $updateProduct[productId].success) {
      setPriceUpdateDisabled(true);
      openNotificationWithIcon("success", "Товар обновлен");
      events.resetUpdateProductEvent();
      effects.getProductListEffect($productListFilterProps);
    }
  }, [$updateProduct]);

  const onSelectProduct = (value) => {
    const ids = [...$productsBatch];
    const index = ids.indexOf(productId);

    if (value) {
      ids.push(productId);
    } else {
      ids.splice(index, 1);
    }

    events.addProductsBatchEvent(ids);
  };

  const onPriceChange = (value) => {
    const newPrice = value.length < 11 ? value : inputValue.html;

    setInputValue({
      html: newPrice,
    });

    if (price === newPrice || !newPrice) {
      setPriceUpdateDisabled(true);
    } else {
      setPriceUpdateDisabled(false);
    }

    if (value !== "0") {
      setFieldsErrors({});
    }
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";

    const errors = {};

    if (inputValue.html === "0") errors.price = notFilledMessage;

    return errors;
  };

  const onPriceUpdate = () => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    effects.updateProductEffect({
      id: productId,
      branchId: $categoriesFilterProps.branchId,
      categoryId: $productList.categoryId,
      salesPrice: inputValue.html,
    });
  };

  const onDeleteProduct = () => {
    effects.deleteProductEffect({
      productId,
    });
  };

  return (
    <div className="catalog__products__extra">
      <Checkbox
        onChange={(e) => onSelectProduct(e.target.checked)}
        checked={$productsBatch.includes(productId)}
        className="catalog__products__checkbox"
      />
      {/* <div className={`catalog__products__price-wr ${fieldsErrors.price ? "field-error" : ""}`}>
        <ContentEditable
          className="products-price b-r-4"
          disabled={false}
          innerRef={React.createRef()}
          style={{}}
          tagName="div"
          html={inputValue.html ? formatPriceProduct(inputValue.html) : ""}
          onChange={(e) => onPriceChange(e.target.value.replace(/[^0-9]/g, ''))}
        />
        <div className="m-r-5">
          Сум
        </div>
        <Button
          className="custom-button add-button onlyicon b-r-30"
          disabled={priceUpdateDisabled}
          onClick={onPriceUpdate}
        >
          <DoneSvg />
        </Button>
      </div> */}
      <Popconfirm
        title="Вы уверены что хотите удалить товар?"
        onConfirm={onDeleteProduct}
        okText="Да"
        cancelText="Нет"
      >
        <Button className="custom-button trash-button onlyicon b-r-30">
          <TrashSvg />
        </Button>
      </Popconfirm>
    </div>
  );
};
