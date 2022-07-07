import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import InputMask from "react-input-mask";
import {
  Modal,
  Form,
  Alert,
  Spin,
  Input,
  Select,
  Button,
  Checkbox,
} from "antd";
import IC from "helpers/EIMZOClient";
import effector from "../effector";

const { store, effects, events } = effector;

import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import { FormField } from "ui/molecules/form-field";
import { CloseModalSvg, DoneSvg } from "svgIcons/svg-icons";
import Cookies from "js-cookie";

const { Option } = Select;

const getSelectedOptions = (options) => {
  const selelctedOptions = [];

  (Array.isArray(options) ? options : []).forEach((option) => {
    if (option.selected) {
      selelctedOptions.push(option.code);
    }
  });

  return selelctedOptions;
};

export const UserCompanyInfoUpdateModal = (props) => {
  const {
    $updateUserCompanyInfo,
    $activityTypeItems,
    $userCompanyInfo,
    $userCompanyInfoByTin,
    $businessTypeItems,
    $regionItems,
    $districtItems,
    $eImzoLogin,
  } = useStore(store);
  const {
    name: companyName,
    address: companyAddress,
    businessType: companyBusinessType,
  } = $userCompanyInfoByTin.data;

  const { modalProps, setModalProps } = props;

  const { userCompanyInfo: userCompanyInfoProps } = modalProps;

  const [certKeys, setCertKeys] = useState([]);
  const [formFields, setFormFields] = useState({});

  const [fieldsErrors, setFieldsErrors] = useState({});

  useEffect(() => {
    if ($updateUserCompanyInfo.success) {
      openNotificationWithIcon("success", "Данные компании обновлены");
      closeModal();
    }
  }, [$updateUserCompanyInfo.success]);

  useEffect(() => {
    console.log(userCompanyInfoProps);
    if (userCompanyInfoProps)
      setFormFields({
        id: userCompanyInfoProps.id,
        activityTypes: userCompanyInfoProps.activityTypes
          ? userCompanyInfoProps.activityTypes
          : [],
        tin: userCompanyInfoProps.tin,
        name: userCompanyInfoProps.name,
        businessType: {
          code: userCompanyInfoProps.businessType
            ? userCompanyInfoProps.businessType.code
            : undefined,
        },
        address: {
          street: userCompanyInfoProps.address
            ? userCompanyInfoProps.address?.street
            : undefined,
          districtId: userCompanyInfoProps.district
            ? userCompanyInfoProps.address.district.id
            : undefined,
          regionId: userCompanyInfoProps.region
            ? userCompanyInfoProps.address.region.id
            : undefined,
        },
        // brand: userCompanyInfoProps.brand ? userCompanyInfoProps.brand : undefined,
        deliveryTypes: getSelectedOptions(userCompanyInfoProps.deliveryTypes),
        paymentTypes: getSelectedOptions(userCompanyInfoProps.paymentTypes),
      });
  }, [userCompanyInfoProps]);

  useEffect(() => {
    if (Object.keys($userCompanyInfoByTin.data).length > 0) {
      setFormFields({
        ...formFields,
        name: companyName,
        businessType: {
          code: companyBusinessType ? companyBusinessType.code : undefined,
        },
        address: {
          street: companyAddress?.street,
          regionId: companyAddress?.region?.id,
          districtId: companyAddress?.district?.id,
        },
      });

      if (companyAddress.region.id) {
        effects.getDistrictItemsEffect(companyAddress?.region?.id);
      }
    }
  }, [$userCompanyInfoByTin.data]);

  useEffect(() => {
    const { tin } = $userCompanyInfo.data;
    if (tin) {
      effects.getUserCompanyInfoByTinEffect(tin);
    }
    effects.getActivityTypeItemsEffect();

    effects.getBusinessTypeItemsEffect();

    effects.getRegionItemsEffect();

    IC.loadEImzoApiKeys((items, firstId) => {
      if (!items) return;
      setCertKeys(items);
    });

    if (formFields.address?.regionId) {
      effects.getDistrictItemsEffect(formFields.address.regionId);
    }
  }, []);

  useEffect(() => {
    if ($eImzoLogin.data?.access_token && $eImzoLogin.data.tin) {
      Cookies.set("access-token", $eImzoLogin.data.access_token);
      onTinChange($eImzoLogin.data.tin, true);
      events.resetEImzoLoginEvent();
    }
  }, [$eImzoLogin.data]);

  const onActivityTypesChange = (selectedValue) => {
    let value = [];
    selectedValue.forEach((selectedActivityTypeId) => {
      $activityTypeItems.data.forEach((activityType) => {
        if (activityType.id === selectedActivityTypeId) {
          value.push(activityType);
        }
      });
    });

    setFormFields({
      ...formFields,
      activityTypes: value,
    });
  };

  const onDeliveryCheck = (deliveryCode, value) => {
    let deliveryTypesArr = [...formFields.deliveryTypes];

    if (value) {
      deliveryTypesArr.push(deliveryCode);
    } else {
      deliveryTypesArr = deliveryTypesArr.filter(
        (item) => item !== deliveryCode
      );
    }

    setFormFields({
      ...formFields,
      deliveryTypes: deliveryTypesArr,
    });
  };

  const onPaymentCheck = (paymentCode, value) => {
    let paymentTypesArr = [...formFields.paymentTypes];

    if (value) {
      paymentTypesArr.push(paymentCode);
    } else {
      paymentTypesArr = paymentTypesArr.filter((item) => item !== paymentCode);
    }

    setFormFields({
      ...formFields,
      paymentTypes: paymentTypesArr,
    });
  };

  const onFormFieldChange = (prop, val, propChild) => {
    if (propChild) {
      setFormFields({
        ...formFields,
        [prop]: {
          ...formFields[prop],
          [propChild]: val,
        },
      });
    } else {
      setFormFields({
        ...formFields,
        [prop]: val,
      });
    }
  };

  const onTinChange = (e, withEImzo) => {
    const value = withEImzo ? e : e.target.value.replace(/[^0-9]/g, "");

    if (value.length === 9 && formFields.tin !== value) {
      effects.getUserCompanyInfoByTinEffect(value);
    }

    onFormFieldChange("tin", value);
  };

  const onRegionChange = (regionId) => {
    setFormFields({
      ...formFields,
      address: {
        ...formFields.address,
        regionId,
        districtId: undefined,
      },
    });

    effects.getDistrictItemsEffect(regionId);
  };

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    events.resetUpdateUserCompanyInfoEvent();
    events.resetUserCompanyInfoByTinEvent();
    events.resetDistrictItemsEvent();

    setModalProps({
      ...modalProps,
      shouldRender: false,
      userCompanyInfo: null,
    });
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";
    const notFilledPaymetntTypesMessage = "Необходимо выбрать способ оплаты";
    const notFilledDeliveryTypesMessage = "Необходимо выбрать способ доставки";

    const errors = {};

    if (!formFields.activityTypes.length)
      errors.activityTypes = notFilledMessage;
    if (!formFields.tin) errors.tin = notFilledMessage;
    if (!formFields.name) errors.name = notFilledMessage;
    if (!formFields.businessType?.code) errors.businessType = notFilledMessage;
    if (!formFields.address?.regionId) errors.regionId = notFilledMessage;
    if (!formFields.address?.districtId) errors.districtId = notFilledMessage;

    if (!formFields.deliveryTypes.length)
      errors.deliveryTypes = notFilledDeliveryTypesMessage;
    if (!formFields.paymentTypes.length)
      errors.paymentTypes = notFilledPaymetntTypesMessage;

    return errors;
  };

  const editWithKey = (cert) => {
    if (cert)
      IC.loadKey(cert.data, async (id) => {
        IC.createEImzoPkcs7(
          id,
          cert.data,
          (pkcs7) => {
            effects.eImzoLoginEffect({ sign: pkcs7 });
          },
          () => {
            openNotificationWithIcon(
              "error",
              "Ошибка!",
              "Неверный пароль или ввод пароля отменен"
            );
          }
        );
      });
  };

  const onSubmit = () => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    effects.updateUserCompanyInfoEffect(formFields);
  };
  return (
    <Modal
      className="custom-modal"
      title="Редактирование компании"
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={464}
      centered={true}
      closeIcon={<CloseModalSvg />}
    >
      {$updateUserCompanyInfo.error && (
        <div className="m-b-20">
          <Alert
            message={
              $updateUserCompanyInfo.error.detail ||
              $updateUserCompanyInfo.error.title
            }
            type="error"
          />
        </div>
      )}
      {$updateUserCompanyInfo.loading && (
        <div className="abs-loader">
          <Spin size="large" />
        </div>
      )}
      <Form onFinish={onSubmit}>
        <FormField title="Выберите ключ" error={""}>
          <Select
            placeholder="Выберите ключ"
            style={{ width: "100%" }}
            onChange={(key) =>
              editWithKey(certKeys.find((cert) => cert.key === key))
            }
            allowClear
          >
            {certKeys?.map((item) => (
              <Option value={item.key} key={item.key}>
                {item.data
                  ? `${item.data.TIN} - ${item.data.O}(${item.data.CN})`
                  : "Выберите ключ"}
              </Option>
            ))}
          </Select>
        </FormField>
        {/* {!userCompanyInfoProps.tin && ( */}
        <FormField
          title="ИНН"
          error={
            $userCompanyInfoByTin.error
              ? $userCompanyInfoByTin.error.title
              : fieldsErrors.tin
              ? fieldsErrors.tin
              : ""
          }
        >
          <div className="input-with-state">
            <InputMask
              className="ant-input"
              mask="999 999 999"
              maskChar="*"
              value={formFields.tin}
              disabled={true}
              placeholder="ИНН"
              onChange={onTinChange}
            />
            <div className="input-state">
              {$userCompanyInfoByTin.loading && <Spin size="small" />}
              {Object.keys($userCompanyInfoByTin.data).length > 0 && (
                <div className="success-icon">
                  <DoneSvg />
                </div>
              )}
            </div>
          </div>
        </FormField>
        {/* )} */}
        <FormField title="Название компании" error={fieldsErrors.name}>
          <Input
            type="text"
            placeholder="Введите название компании"
            value={formFields.name}
            onChange={(name) => onFormFieldChange("name", name.target.value)}
          />
        </FormField>
        {/*<FormField title="Бренд">*/}
        {/*  <Input*/}
        {/*    type="text"*/}
        {/*    placeholder="Введите название бренда"*/}
        {/*    value={formFields.brand}*/}
        {/*    onChange={(brand) => onFormFieldChange("brand", brand.target.value)}*/}
        {/*  />*/}
        {/*</FormField>*/}
        <div className="custom-modal__double-row">
          <div className="custom-modal__double-row-item">
            <FormField title="Вид компании" error={fieldsErrors.businessType}>
              <Select
                loading={$businessTypeItems.loading}
                placeholder="Выбрать вид компании"
                value={formFields.businessType?.code || undefined}
                onChange={(businessType) =>
                  onFormFieldChange("businessType", businessType, "code")
                }
              >
                {Array.isArray($businessTypeItems.data) &&
                  $businessTypeItems.data?.map((item) => (
                    <Option value={item.code} key={item.code}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </FormField>
          </div>
          <div className="custom-modal__double-row-item">
            <FormField
              title="Сферы деятельности"
              error={fieldsErrors.activityTypes}
            >
              <Select
                loading={$activityTypeItems.loading}
                allowClear
                mode="multiple"
                placeholder="Выберите сферы деятельности"
                value={
                  $activityTypeItems.data.length &&
                  formFields.activityTypes.length
                    ? formFields.activityTypes.map((item) => item.id)
                    : undefined
                }
                onChange={onActivityTypesChange}
              >
                {Array.isArray($activityTypeItems.data) &&
                  $activityTypeItems.data.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </FormField>
          </div>
        </div>
        <div className="custom-modal__double-row">
          <div className="custom-modal__double-row-item">
            <FormField title="Регион" error={fieldsErrors.regionId}>
              <Select
                loading={$regionItems.loading}
                placeholder="Выбрать регион"
                value={
                  $regionItems.data.length && formFields
                    ? formFields.address?.regionId
                    : undefined
                }
                onChange={onRegionChange}
              >
                {Array.isArray($regionItems.data) &&
                  $regionItems.data.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </FormField>
          </div>
          <div className="custom-modal__double-row-item">
            <FormField title="Район" error={fieldsErrors.districtId}>
              <Select
                loading={$districtItems.loading}
                placeholder="Выбрать район"
                value={
                  $districtItems.data.length && formFields
                    ? formFields.address.districtId
                    : undefined
                }
                onChange={(districtId) =>
                  onFormFieldChange("address", districtId, "districtId")
                }
              >
                {Array.isArray($districtItems.data) &&
                  $districtItems.data.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </FormField>
          </div>
        </div>
        <FormField title="Адрес">
          <Input
            type="text"
            placeholder="Введите адрес"
            value={formFields.address?.street}
            onChange={(street) =>
              onFormFieldChange("address", street.target.value, "street")
            }
          />
        </FormField>
        <div className="custom-modal__double-row">
          <div className="custom-modal__double-row-item">
            <div className="form-field m-b-10">
              <div className="form-field__title">Способы доставки</div>
              <div className="form-field__error">
                {fieldsErrors.deliveryTypes}
              </div>
            </div>
            <div>
              {(Array.isArray(userCompanyInfoProps.deliveryTypes)
                ? userCompanyInfoProps.deliveryTypes
                : []
              ).map((item) => (
                <div key={item.code}>
                  <FormField className="m-b-10">
                    <Checkbox
                      className="custom-checkbox-2"
                      onChange={(e) =>
                        onDeliveryCheck(item.code, e.target.checked)
                      }
                      checked={formFields.deliveryTypes?.includes(
                        item.code || ""
                      )}
                    >
                      {item.name}
                    </Checkbox>
                  </FormField>
                </div>
              ))}
            </div>
          </div>
          <div className="custom-modal__double-row-item">
            <div className="form-field m-b-10">
              <div className="form-field__title">Способы оплаты</div>
              <div className="form-field__error">
                {fieldsErrors.paymentTypes}
              </div>
            </div>
            <div>
              {userCompanyInfoProps.paymentTypes?.map((item) => (
                <div key={item.code}>
                  <FormField className="m-b-10">
                    <Checkbox
                      className="custom-checkbox-2"
                      onChange={(e) =>
                        onPaymentCheck(item.code, e.target.checked)
                      }
                      checked={formFields.paymentTypes?.includes(
                        item.code || ""
                      )}
                    >
                      {item.name}
                    </Checkbox>
                  </FormField>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="custom-modal__button-row">
          <Button
            htmlType="submit"
            className="custom-button primary-button fullwidth"
          >
            Сохранить
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
