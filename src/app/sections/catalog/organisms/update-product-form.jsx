import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import {
  Button,
  Row,
  Checkbox,
  Col,
  Form,
  Input,
  Popconfirm,
  Select,
} from "antd";

import effector from "../effector";

import { formatPrice, formatPriceProduct } from "helpers/format-price";
import { FormField } from "ui/molecules/form-field";
import { FormState } from "ui/molecules/form-state";

import { AddPlusSvg, EditPencilSvg, TrashSvg } from "svgIcons/svg-icons";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";

var globalVar;

const { store, effects, events } = effector;

const { Option } = Select;

export const UpdateProductForm = (props) => {
  const $updateDetailsProduct = useStore(store.$updateDetailsProduct);
  const $categoriesFilterProps = useStore(store.$categoriesFilterProps);
  const $unitItems = useStore(store.$unitItems);
  const $categoriesList = useStore(store.$categoriesList);
  const $productList = useStore(store.$productList);
  const $productListFilterProps = useStore(store.$productListFilterProps);
  const $vatItems = useStore(store.$vatItems);

  const $companyCatalogItems = useStore(store.$companyCatalogItems);
  const $productTypeItems = useStore(store.$productTypeItems);

  const { product, openedProducts, setOpenedProducts } = props;
  const [formFields, setFormFields] = useState({
    vatBarcode: product.vatBarcode ? product.vatBarcode : undefined,
    name: product.name,
    categoryId: product.category?.id,
    salesPrice: product.price,
    productType: product.productType?.code,
    packageType: product.packageCode
      ? { code: product.packageCode, name: product.packageName }
      : undefined,
    barcode: product.barcode,
    capacity: product.capacity,
    unitId: product.unit?.id,
    favourite: product.favourite,
    qtyInPackage: product.qtyInPackage,
    hasMark: product.hasMark,
    vatRate: product.vat?.code,
  });

  const [fieldsErrors, setFieldsErrors] = useState({});
  const [fieldsUnitsErrors, setFieldsUnitsErrors] = useState({});

  const [unitsOfProduct, setUnitsOfProduct] = useState([]); // Массив единиц измерения
  const [createUnit, setCreateUnit] = useState(-1); // Index создаваемого элемента
  const [currentUnitEdit, setCurrentUnitEdit] = useState(-2); // Index редактируемого элемента
  const [createUnitParams, setCreateUnitParams] = useState({}); // Параметры создаваемого элемента

  const [packageTypeItems, setPackageTypeItems] = useState([]);

  useEffect(() => {
    events.resetCategoriesListEvent();
    !$companyCatalogItems.data.length && effects.getCompanyCatalogItemsEffect();
    !$productTypeItems.data.length && effects.getProductTypeItemsEffect();
    getCategoryList();
    if (!(Array.isArray($unitItems.data) ? $unitItems.data : []).length) {
      effects.getUnitItemsEffect();
    }

    if (!$vatItems.data.length) {
      effects.getVatItemsEffect();
    }
    onFormFieldChange("categoryId", $productList.categoryId);
    setUnitsOfProduct(product.units);
  }, []);

  useEffect(() => {
    if (
      $updateDetailsProduct[product.id] &&
      $updateDetailsProduct[product.id].success
    ) {
      onCancel();
      openNotificationWithIcon("success", "Товар обновлен");
      events.resetUpdateDetailsProductEvent();
      effects.getProductListEffect($productListFilterProps);
    }
  }, [$updateDetailsProduct]);

  useEffect(() => {
    if (formFields.vatBarcode && $companyCatalogItems.data.length) {
      const catalogItem = $companyCatalogItems.data?.find(
        (item) => item.mxikCode === formFields.vatBarcode
      );
      if (catalogItem) setPackageTypeItems(catalogItem?.packageNames || []);
      else onFormFieldChange("vatBarcode", undefined);
    }
  }, [formFields.vatBarcode, $companyCatalogItems.data]);

  useEffect(() => {
    if (
      formFields.packageType &&
      packageTypeItems.length &&
      !packageTypeItems.find(
        (item) => item.code === formFields.packageType.code
      )
    ) {
      onFormFieldChange("packageType", undefined);
    }
  }, [packageTypeItems]);

  const getCategoryList = (params) => {
    effects.getCategoriesListEffect({
      ...params,
      branchId: $categoriesFilterProps.branchId,
    });
  };

  const onCancel = () => {
    const openedProductsLocal = [...openedProducts];
    const index = openedProductsLocal.indexOf(product.id);

    openedProductsLocal.splice(index, 1);

    setOpenedProducts(openedProductsLocal);
  };

  const getBaseUnitIndex = () => {
    let baseIndex = null;

    unitsOfProduct?.forEach((item, index) => {
      if (item.base) {
        baseIndex = index;
      }
    });

    return baseIndex;
  };

  const disableUnitItem = (unitId) => {
    let isContained = false;

    unitsOfProduct?.forEach((item) => {
      if (item.unit.id === unitId) {
        isContained = true;
      }
    });

    return isContained;
  };

  const getUnitName = (id) => {
    let name = "";

    (Array.isArray($unitItems.data) ? $unitItems.data : []).forEach((item) => {
      if (item.id === id) {
        name = item.nameRu;
      }
    });

    return name;
  };

  const onDeleteUnitOfProduct = (delIndex) => {
    const newArr = unitsOfProduct.filter((unit, index) => delIndex !== index);

    setUnitsOfProduct(newArr);
  };

  const switchUnitCreating = (index) => {
    setCreateUnit(index);
  };

  const onChangeUnit = (prop, val) => {
    if (prop === "id") {
      setCreateUnitParams({
        ...createUnitParams,
        base: !!(!unitsOfProduct.length || createUnitParams.base),
        price:
          !unitsOfProduct.length || createUnitParams.base
            ? formFields.salesPrice
            : 0,
        unit: {
          [prop]: val,
          name: getUnitName(val),
        },
      });
    } else {
      setCreateUnitParams({
        ...createUnitParams,
        [prop]: val,
      });
    }
  };

  const validateUnits = (index) => {
    const notFilledMessage = "Не заполнено поле";

    const errors = {};

    if (!createUnitParams.unit) errors.id = notFilledMessage;
    if (!createUnitParams.minOrder || createUnitParams.minOrder === "0")
      errors.minOrder = notFilledMessage;
    if (index !== 0 && !createUnitParams.count) errors.count = notFilledMessage;

    return errors;
  };

  const onUnitAdd = (index) => {
    const errors = validateUnits(index);

    if (Object.keys(errors).length) {
      setFieldsUnitsErrors(errors);
      return;
    }

    setFieldsUnitsErrors({});

    const newUnits = [...unitsOfProduct];

    if (currentUnitEdit !== -2) {
      newUnits[index] = createUnitParams;
    } else {
      newUnits.splice(index, 0, createUnitParams);
    }

    setCreateUnit(-1);
    setUnitsOfProduct(newUnits);
    setCreateUnitParams({});
    setCurrentUnitEdit(-2);
  };

  const onUnitAddCancel = () => {
    setCurrentUnitEdit(-2);
    setCreateUnit(-1);
    setCreateUnitParams({});
  };

  const onEditUnit = (index) => {
    setFieldsUnitsErrors({});
    setCreateUnit(index);
    setCurrentUnitEdit(index);
    setCreateUnitParams(unitsOfProduct[index]);
  };

  const unitCreateComponents = (createUnitIndex, prevUnitId) => {
    if (createUnit === currentUnitEdit) {
      createUnitIndex = createUnitIndex - 1;

      if (createUnitIndex !== 0 && createUnit === createUnitIndex) {
        prevUnitId = unitsOfProduct[createUnitIndex - 1].unit.id;
      } // достаем id предыдущего юнита
    } // если редактирование юнита

    return (
      <>
        {createUnit === -1 && (
          <div className="catalog__products__units__add-btn">
            <span onClick={() => switchUnitCreating(createUnitIndex)}>
              Добавить ед. изм. <AddPlusSvg />
            </span>
          </div>
        )}
        {createUnit === createUnitIndex && (
          <div className="catalog__products__create-unit">
            <div className="catalog__products__create-unit-row">
              <FormField title="Ед. изм" error={fieldsUnitsErrors.id}>
                <Select
                  placeholder="Ед. изм"
                  value={
                    createUnitParams.unit ? createUnitParams.unit.id : undefined
                  }
                  onChange={(id) => onChangeUnit("id", id)}
                >
                  {(Array.isArray($unitItems.data) ? $unitItems.data : []).map(
                    (item) => (
                      <Option
                        disabled={disableUnitItem(item.id)}
                        value={item.id}
                        key={item.id}
                      >
                        {item.nameRu}
                      </Option>
                    )
                  )}
                </Select>
              </FormField>
              {unitsOfProduct.length > 0 && !createUnitParams.base && (
                <FormField title="Кол-во" error={fieldsUnitsErrors.count}>
                  <div className="form-field__row">
                    <Input
                      placeholder="Кол-во"
                      value={createUnitParams.count}
                      onChange={(count) =>
                        onChangeUnit(
                          "count",
                          count.target.value.replace(/[^0-9.]/g, ""),
                          createUnitIndex
                        )
                      }
                    />
                    {createUnitIndex !== 0 && (
                      <div>{getUnitName(prevUnitId)}</div>
                    )}
                    {createUnitIndex === 0 && (
                      <div>{unitsOfProduct[0].unit.name}</div>
                    )}
                  </div>
                </FormField>
              )}
              <FormField title="Мин. заказ" error={fieldsUnitsErrors.minOrder}>
                <Input
                  placeholder="Мин. заказ"
                  value={createUnitParams.minOrder}
                  onChange={(minOrder) =>
                    onChangeUnit(
                      "minOrder",
                      minOrder.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                />
              </FormField>
            </div>
            <div className="catalog__products__create-unit-button-row">
              <Button
                className="unit-button-success"
                onClick={() => onUnitAdd(createUnitIndex)}
              >
                {createUnit === currentUnitEdit
                  ? "Сохранить"
                  : "Добавить ед. изм."}
              </Button>
              <Button className="unit-button-danger" onClick={onUnitAddCancel}>
                Отменить
              </Button>
            </div>
          </div>
        )}
      </>
    );
  };

  const priceUpCalc = (iIndex, baseIndex, unitCount) => {
    let countMerge = unitCount;

    unitsOfProduct?.forEach((item, index) => {
      if (!item.base && index < baseIndex && index > iIndex) {
        countMerge = countMerge * item.count;
      }
    });

    return countMerge
      ? formFields.salesPrice / countMerge
      : formFields.salesPrice;
  };

  const unitsOfProductRender = () => {
    let price = formFields.salesPrice ? formFields.salesPrice : 0;
    let baseIndex = getBaseUnitIndex();

    return unitsOfProduct?.map((unit, index) => {
      let priceUp =
        index < baseIndex ? priceUpCalc(index, baseIndex, unit.count) : null;
      let prevName = null;
      let nextName = null;

      if (!unit.base) {
        if (index === 0) {
          nextName = unitsOfProduct[index + 1].unit.name;
        } else if (index < baseIndex) {
          nextName = unitsOfProduct[index + 1].unit.name;
        } else {
          prevName = unitsOfProduct[index - 1].unit.name;
          price = unit.count * price;
        }
      }

      return (
        <li key={index}>
          <div
            className={`catalog__products__units__item ${
              unit.base ? "main-unit" : ""
            }`}
          >
            <div className="catalog__products__units__item__left">
              {nextName && `1 ${nextName} - ${unit.count} ${unit.unit.name}`}
              {unit.base && `Основная ед. изм. - ${unit.unit.name}`}
              {prevName && `1 ${unit.unit.name} - ${unit.count} ${prevName}`}
              <div>Мин. заказ {unit.minOrder}</div>
            </div>
            <div className="catalog__products__units__item__right">
              1 {unit.unit.name}
              <span>-</span>
              {formatPrice(
                priceUp
                  ? parseInt(priceUp * 100) / 100
                  : parseInt(price * 100) / 100
              )}
              <Button
                disabled={unit.base && unitsOfProduct.length > 1}
                onClick={() => onEditUnit(index)}
                className="custom-button onlyicon b-r-30 m-l-10"
              >
                <EditPencilSvg />
              </Button>
              {!unit.base && (
                <Popconfirm
                  title="Вы уверены что хотите удалить Ед. изм.?"
                  onConfirm={() => onDeleteUnitOfProduct(index)}
                  okText="Да"
                  cancelText="Нет"
                >
                  <Button className="custom-button trash-button onlyicon b-r-30">
                    <TrashSvg />
                  </Button>
                </Popconfirm>
              )}
            </div>
          </div>
          {unitCreateComponents(index + 1, unit.unit.id)}
        </li>
      );
    });
  };

  const onFormFieldChange = (prop, val) => {
    setFormFields({
      ...formFields,
      [prop]: val,
    });
  };

  const onBarcodeChange = (val) => {
    if (val.length < 14) {
      setFormFields({
        ...formFields,
        barcode: val,
      });
    }
  };

  const onSalesPriceChange = (val) => {
    if (val.length < 14) {
      setFormFields({
        ...formFields,
        salesPrice: val,
      });
    }
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";

    const errors = {};

    if (!formFields.unitId) errors.unitId = "Необходимо выбрать ед. изм.";
    if (!formFields.name) errors.name = notFilledMessage;
    if (!formFields.categoryId) errors.categoryId = notFilledMessage;
    if (!formFields.qtyInPackage) errors.qtyInPackage = notFilledMessage;
    if (!formFields.salesPrice) errors.salesPrice = notFilledMessage;
    if (!formFields.packageType) errors.packageType = notFilledMessage;
    //if (!formFields.capacity) errors.capacity = notFilledMessage;
    if (formFields.hasMark && !formFields.productType)
      errors.productType = notFilledMessage;
    if (!formFields.barcode) errors.barcode = notFilledMessage;
    if (!formFields.vatBarcode) errors.vatBarcode = notFilledMessage;
    if (formFields.vatRate === undefined) errors.vatRate = notFilledMessage;

    return errors;
  };

  const onSubmit = () => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    const catalogName =
      (Array.isArray($companyCatalogItems.data) &&
        $companyCatalogItems.data.find(
          (item) => item.mxikCode === formFields.vatBarcode
        )?.name) ||
      undefined;

    const productType = formFields.hasMark
      ? Array.isArray($productTypeItems.data) &&
        $productTypeItems.data.find(
          (item) => item.code === formFields.productType
        )
      : "";

    // let price = formFields.salesPrice;
    // let baseIndex = getBaseUnitIndex();

    // const sendUnits = unitsOfProduct?.map((item, index) => {
    //   let priceUp =
    //     index < baseIndex ? priceUpCalc(index, baseIndex, item.count) : null;

    //   if (index > baseIndex) {
    //     price = item.count * price;
    //   }

    // const productType = formFields.hasMark
    // ? $productTypeItems.data.find(
    //     (item) => item.code === formFields.productType
    //   )
    // : "";

    //   return {
    //     ...item,
    //     price: parseInt((priceUp ? priceUp : price) * 100) / 100,
    //     count: item.base ? 1 : item.count,
    //     base: item.base,
    //     sorder: index,
    //     coefficient: (priceUp ? priceUp : price) / formFields.salesPrice,
    //   };
    // });

    const data = {
      vatBarcode: formFields.vatBarcode ? formFields.vatBarcode : undefined,
      barcode: formFields.barcode,
      price: formFields.salesPrice,
      branchId: $categoriesFilterProps.branchId,
      catalogName,
      categoryId: formFields.categoryId,
      packageCode: formFields.packageType.code,
      packageName: formFields.packageType.name,
      capacity: formFields.capacity,
      id: product.id,
      favourite: formFields.favourite || false,
      qtyInPackage: formFields.qtyInPackage,
      hasMark: formFields.hasMark || false,
      name: formFields.name,
      vat: { code: formFields.vatRate },
      unitId: formFields.unitId,
    };

    if (productType) data.productType = productType;

    effects.updateDetailsProductEffect(data);
  };

  return (
    <div>
      <FormState
        error={$updateDetailsProduct[product.id] && $updateDetailsProduct.error}
        loading={
          $updateDetailsProduct[product.id] &&
          $updateDetailsProduct[product.id].loading
        }
      />
      <Form>
        <FormField title="Категория" error={fieldsErrors.categoryId}>
          <Select
            className="custom-select"
            loading={$categoriesList.loading}
            placeholder="Выбрать категорию"
            filterOption={false}
            value={
              Array.isArray($categoriesList.data) &&
              $categoriesList.data.find((c) => c.id === formFields.categoryId)
                ? formFields.categoryId || undefined
                : undefined
            }
            onChange={(id) => onFormFieldChange("categoryId", id)}
            showSearch
            onSearch={(input) => {
              clearTimeout(globalVar);
              globalVar = setTimeout(
                () => getCategoryList({ search: input }),
                400
              );
            }}
            allowClear
          >
            {(Array.isArray($categoriesList.data)
              ? $categoriesList.data
              : []
            ).map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </FormField>
        <FormField title="Название товара" error={fieldsErrors.name}>
          <Input
            placeholder="Введите название товара"
            value={formFields.name}
            onChange={(name) => onFormFieldChange("name", name.target.value)}
          />
        </FormField>

        <FormField title="Штрих код" error={fieldsErrors.barcode}>
          <Input
            placeholder="Введите штрих код"
            value={formFields.barcode}
            onChange={(barcode) =>
              onBarcodeChange(barcode.target.value.replace(/[^0-9]/g, ""))
            }
          />
        </FormField>

        <FormField title="ИКПУ" error={fieldsErrors.vatBarcode}>
          <Select
            showSearch
            filterOption={(input, option) =>
              (option.name || "").toLowerCase().includes(input.toLowerCase()) ||
              String(option.value).toLowerCase().includes(input.toLowerCase())
            }
            loading={$companyCatalogItems.loading}
            disabled={$companyCatalogItems.loading}
            placeholder="Выберите продукцию"
            optionLabelProp="label"
            value={formFields.vatBarcode}
            onChange={(percent) => onFormFieldChange("vatBarcode", percent)}
          >
            {(Array.isArray($companyCatalogItems.data)
              ? $companyCatalogItems.data
              : []
            ).map((item) => (
              <Option
                value={item.mxikCode}
                key={item.mxikCode}
                name={item.name}
                label={
                  <div>
                    <strong>ИКПУ: </strong>
                    {item.mxikCode}
                  </div>
                }
              >
                <div>
                  <div>
                    <strong>ИКПУ: </strong>
                    {item.mxikCode}
                  </div>
                  <div>
                    <strong>Каталог: </strong>
                    {item.name}
                  </div>
                </div>
              </Option>
            ))}
          </Select>
        </FormField>

        <Row justify="space-between" align="middle" gutter={[16, 0]}>
          <Col span={16}>
            <FormField title=" Тип упаковки" error={fieldsErrors.packageType}>
              <Select
                placeholder="Выберите тип упаковки"
                value={formFields.packageType?.code || undefined}
                onChange={(code) =>
                  onFormFieldChange(
                    "packageType",
                    packageTypeItems.find((p) => p?.code === code)
                  )
                }
                disabled={!formFields.vatBarcode}
              >
                {packageTypeItems.map((item) => (
                  <Option value={item.code} key={item.code}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </FormField>
          </Col>
          <Col span={8}>
            <FormField
              title="Кол-во в упаковке"
              error={fieldsErrors.qtyInPackage}
            >
              <Input
                placeholder="Введите кол-во в упаковке"
                value={formFields.qtyInPackage}
                type="number"
                onChange={(quantity) =>
                  onFormFieldChange("qtyInPackage", quantity.target.value)
                }
              />
            </FormField>
          </Col>
        </Row>
        <Row justify="space-between" align="middle" gutter={[16, 0]}>
          <Col span={16}>
            <FormField title="Ед. изм" error={fieldsUnitsErrors.unitId}>
              <Select
                placeholder="Ед. изм"
                value={formFields.unitId}
                onChange={(id) => onFormFieldChange("unitId", id)}
              >
                {(Array.isArray($unitItems.data) ? $unitItems.data : []).map(
                  (item) => (
                    <Option
                      disabled={disableUnitItem(item.id)}
                      value={item.id}
                      key={item.id}
                    >
                      {item.name}
                    </Option>
                  )
                )}
              </Select>
            </FormField>
          </Col>
          <Col span={8}>
            <FormField title="Объем" error={fieldsErrors.capacity}>
              <Input
                placeholder="Введите объем"
                value={formFields.capacity ? formFields.capacity : ""}
                onChange={(capacity) =>
                  onFormFieldChange("capacity", capacity.target.value)
                }
              />
            </FormField>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col>
            <Checkbox
              checked={formFields.favourite}
              onChange={(e) => {
                onFormFieldChange("favourite", e.target.checked);
              }}
            >
              Избранный
            </Checkbox>
          </Col>
          <Col>
            <Checkbox
              checked={formFields.hasMark}
              onChange={(e) => {
                onFormFieldChange("hasMark", e.target.checked);
              }}
            >
              Маркировка
            </Checkbox>
          </Col>
        </Row>
        {formFields.hasMark && (
          <FormField title="Тип продукции" error={fieldsErrors.productType}>
            <Select
              placeholder="Выберите тип продукта"
              value={formFields.productType}
              onChange={(code) => onFormFieldChange("productType", code)}
            >
              {(Array.isArray($productTypeItems.data)
                ? $productTypeItems.data
                : []
              ).map((item) => (
                <Option value={item.code} key={item.code}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </FormField>
        )}
        <div className="custom-modal__double-row">
          <div className="custom-modal__double-row-item">
            <FormField
              title="Продажная цена (с НДС)"
              error={fieldsErrors.salesPrice}
            >
              <Input
                placeholder="Введите цену"
                value={formatPriceProduct(
                  formFields.salesPrice ? formFields.salesPrice : ""
                )}
                onChange={(salesPrice) =>
                  onSalesPriceChange(
                    salesPrice.target.value.replace(/[^0-9.]/g, "")
                  )
                }
              />
            </FormField>
          </div>
          <div className="custom-modal__double-row-item">
            <FormField title="НДС" error={fieldsErrors.vatRate}>
              <Select
                loading={$vatItems.loading}
                placeholder="Выберите НДС"
                value={formFields.vatRate}
                onChange={(code) => onFormFieldChange("vatRate", code)}
              >
                {(Array.isArray($vatItems.data) ? $vatItems.data : []).map(
                  (item) => (
                    <Option value={item.code} key={item.code}>
                      {item.name}
                    </Option>
                  )
                )}
              </Select>
            </FormField>
          </div>
        </div>

        {/* <ul className="catalog__products__units">
          <div className="catalog__products__units-error">
            {fieldsErrors.units}
          </div>
          {unitCreateComponents(0)}
          {unitsOfProductRender()}
        </ul> */}
        <div className="catalog__products__buttons">
          <Button
            className="custom-button danger-button small"
            onClick={onCancel}
          >
            Отменить
          </Button>
          <Button
            disabled={createUnit > -1}
            className="custom-button success-button small"
            onClick={onSubmit}
          >
            Сохранить
          </Button>
        </div>
      </Form>
    </div>
  );
};
