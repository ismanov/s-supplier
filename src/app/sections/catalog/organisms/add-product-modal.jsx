import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import {
  Alert,
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Spin,
} from "antd";

import { FormField } from "ui/molecules/form-field";

import effector from "../effector";

import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import { formatPrice, formatPriceProduct } from "helpers/format-price";

import {
  AddPlusSvg,
  CloseModalSvg,
  EditPencilSvg,
  TrashSvg,
} from "svgIcons/svg-icons";

const { store, effects, events } = effector;

const { Option } = Select;

var globalVar;

const FormState = ({ error, loading }) => {
  return (
    <div>
      {error && (
        <div className="m-b-20">
          <Alert message={error.detail || error.title} type="error" />
        </div>
      )}
      {loading && (
        <div className="abs-loader">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export const AddProductModal = (props) => {
  const $addProduct = useStore(store.$addProduct);
  const $categoriesFilterProps = useStore(store.$categoriesFilterProps);
  const $unitItems = useStore(store.$unitItems);
  const $companyCatalogItems = useStore(store.$companyCatalogItems);
  const $productTypeItems = useStore(store.$productTypeItems);
  const $categoriesList = useStore(store.$categoriesList);
  const $categories = useStore(store.$categories);
  const $productList = useStore(store.$productList);
  const $vatItems = useStore(store.$vatItems);

  const { modalProps, setModalProps } = props;

  const [formFields, setFormFields] = useState({
    favourite: false,
    hasMark: false,
  });

  const [fieldsErrors, setFieldsErrors] = useState({});
  const [fieldsUnitsErrors, setFieldsUnitsErrors] = useState({});

  const [unitsOfProduct, setUnitsOfProduct] = useState([]); // Массив единиц измерения
  const [createUnit, setCreateUnit] = useState(-1); // Index создаваемого элемента
  const [currentUnitEdit, setCurrentUnitEdit] = useState(-2); // Index редактируемого элемента
  const [createUnitParams, setCreateUnitParams] = useState({}); // Параметры создаваемого элемента

  const [packageTypeItems, setPackageTypeItems] = useState([]);

  useEffect(() => {
    effects.getUnitItemsEffect();
    effects.getCompanyCatalogItemsEffect();
    effects.getProductTypeItemsEffect();
    events.resetCategoriesListEvent();
    getCategoryList();
    effects.getVatItemsEffect();
    onFormFieldChange("categoryId", $productList.categoryId);
  }, []);

  useEffect(() => {
    if ($addProduct.success) {
      openNotificationWithIcon("success", "Товар добавлен");
      closeModal();
    }
  }, [$addProduct.success]);

  useEffect(() => {
    if (formFields.vatBarcode) {
      setPackageTypeItems(
        $companyCatalogItems.data?.find(
          (item) => item.mxikCode === formFields.vatBarcode
        )?.packageNames || []
      );
    }
  }, [formFields.vatBarcode]);

  const getCategoryList = (params) => {
    effects.getCategoriesListEffect({
      ...params,
      branchId: $categoriesFilterProps.branchId,
    });
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
        name = item.name;
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
                        {item.name}
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

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    events.resetAddProductEvent();

    setModalProps({ ...modalProps, shouldRender: false });
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";

    const errors = {};

    if (!formFields.unitId) errors.unitId = "Необходимо выбрать ед. изм.";
    if (!formFields.name) errors.name = notFilledMessage;
    if (!formFields.qtyInPackage) errors.qtyInPackage = notFilledMessage;
    if (
      !(
        formFields.categoryId &&
        Array.isArray($categoriesList.data) &&
        $categoriesList.data.find((c) => c.id === formFields.categoryId)
      )
    )
      errors.categoryId = notFilledMessage;
    if (!formFields.salesPrice) errors.salesPrice = notFilledMessage;
    if (!formFields.barcode) errors.barcode = notFilledMessage;
    //if (!formFields.capacity) errors.capacity = notFilledMessage;
    if (!formFields.packageType) errors.packageType = notFilledMessage;
    if (formFields.hasMark && !formFields.productType)
      errors.productType = notFilledMessage;
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
      $companyCatalogItems.data?.find(
        (item) => item.mxikCode === formFields.vatBarcode
      )?.name || undefined;

    const productType = formFields.hasMark
      ? $productTypeItems.data.find(
          (item) => item.code === formFields.productType
        )
      : "";

    const data = {
      vatBarcode: formFields.vatBarcode ? formFields.vatBarcode : undefined,
      barcode: formFields.barcode,
      branchId: $categoriesFilterProps.branchId,
      categoryId: formFields.categoryId,
      name: formFields.name,
      packageCode: formFields.packageType.code,
      packageName: formFields.packageType.name,
      catalogName,
      qtyInPackage: formFields.qtyInPackage,
      favourite: formFields.favourite || false,
      hasMark: formFields.hasMark || false,
      price: formFields.salesPrice,
      capacity: formFields.capacity,
      vat: { code: formFields.vatRate },
      unitId: formFields.unitId,
    };

    if (productType) data.productType = productType;

    effects.addProductEffect(data);
  };

  const getCategoryName = () => {
    const category =
      Array.isArray($categories.data) &&
      $categories.data.find((c) => c.id === formFields.categoryId);
    if (category) return " в категорию " + category.name;
    return "";
  };

  return (
    <Modal
      className="custom-modal"
      title={`Создание товара ${getCategoryName()}`}
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={464}
      centered={true}
      closeIcon={<CloseModalSvg />}
    >
      <FormState error={$addProduct.error} loading={$addProduct.loading} />
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
              option.name.toLowerCase().includes(input.toLowerCase()) ||
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
            <FormField title="Ед. изм" error={fieldsErrors.unitId}>
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
              value={formFields.favourite}
              onChange={(e) => {
                onFormFieldChange("favourite", e.target.checked);
              }}
            >
              Избранный
            </Checkbox>
          </Col>
          <Col>
            <Checkbox
              value={formFields.hasMark}
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
              onChange={(id) => onFormFieldChange("productType", id)}
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
        <Row justify="space-between" align="middle" gutter={[16, 0]}>
          <Col span={14}>
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
          </Col>
          <Col span={10}>
            <FormField title="НДС" error={fieldsErrors.vatRate}>
              <Select
                loading={$vatItems.loading}
                placeholder="Выберите НДС"
                value={formFields.vatRate}
                onChange={(percent) => onFormFieldChange("vatRate", percent)}
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
          </Col>
        </Row>
        {/* <ul className="catalog__products__units">
          <div className="catalog__products__units-error">
            {fieldsErrors.units}
          </div>
          {unitCreateComponents(0)}
          {unitsOfProductRender()}
        </ul> */}
        <div className="custom-modal__button-row">
          <Button
            disabled={createUnit > -1}
            htmlType="submit"
            className="custom-button primary-button fullwidth"
            onClick={onSubmit}
          >
            Создать товар
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
