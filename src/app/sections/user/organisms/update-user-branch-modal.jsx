import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import InputMask from "react-input-mask";
import { Alert, Form, Input, Modal, Spin, Button, Select } from "antd";

import effector from "../effector";

import { CloseModalSvg } from "svgIcons/svg-icons";
import { FormField } from "ui/molecules/form-field";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";

const { store, effects, events } = effector;

const { Option } = Select;

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

export const UpdateUserBranchModal = (props) => {
  const { $addUserBranch, $updateUserBranch, $regionItems, $districtItems } =
    useStore(store);

  const { modalProps, setModalProps } = props;

  const { branch: branchProps } = modalProps;

  const [formFields, setFormFields] = useState({
    address: {},
    owner: {
      login: "998",
    },
    phone: "998",
  });
  const [fieldsErrors, setFieldsErrors] = useState({});

  useEffect(() => {
    if ($updateUserBranch.success) {
      openNotificationWithIcon("success", "Филиал обновлен");
      closeModal();
    }

    if ($addUserBranch.success) {
      openNotificationWithIcon("success", "Филиал добавлен");
      closeModal();
    }
  }, [$updateUserBranch.success, $addUserBranch.success]);

  useEffect(() => {
    if (branchProps) {
      setFormFields({
        id: branchProps.id,
        name: branchProps.name,
        address: {
          street: branchProps.address ? branchProps.address.street : "",
          districtId: branchProps.address
            ? branchProps.address.district.id
            : "",
          regionId: branchProps.address ? branchProps.address.region.id : "",
        },
        owner: {
          firstName: branchProps.owner
            ? branchProps.owner.firstName
            : undefined,
          lastName: branchProps.owner ? branchProps.owner.lastName : undefined,
          login: branchProps.owner ? branchProps.owner.login : "998",
        },
        phone: branchProps.phone ? branchProps.phone : "998",
      });

      if (branchProps.address && branchProps.address.region.id) {
        effects.getDistrictItemsEffect(branchProps.address.region.id);
      }
    }

    if (!$regionItems.data.length) {
      effects.getRegionItemsEffect();
    }
  }, []);

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

  const onPhoneFieldChange = (prop, val, propChild) => {
    onFormFieldChange(prop, val ? val : "998", propChild);
  };

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    if (branchProps) {
      events.resetUpdateUserBranchEvent();
    } else {
      events.resetAddUserBranchEvent();
    }

    events.resetDistrictItemsEvent();

    setModalProps({ ...modalProps, shouldRender: false, branch: null });
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";

    const errors = {};

    if (!formFields.name) errors.name = notFilledMessage;
    if (!formFields.address?.regionId) errors.regionId = notFilledMessage;
    if (!formFields.address.districtId) errors.districtId = notFilledMessage;
    if (!formFields.address?.street) errors.street = notFilledMessage;
    if (formFields.phone.length < 12) errors.phone = notFilledMessage;

    return errors;
  };

  const onSubmit = () => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    const data = {
      id: formFields.id,
      name: formFields.name,
      address: {
        street: formFields.address?.street,
        districtId: formFields.address.districtId,
        regionId: formFields.address?.regionId,
      },
      phone: formFields.phone,
    };

    if (branchProps) {
      effects.updateUserBranchEffect(data);
    } else {
      effects.addUserBranchEffect(data);
    }
  };

  return (
    <Modal
      className="custom-modal"
      title={branchProps ? "Редактировать филиал" : "Добавить филиал"}
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={464}
      centered={true}
      closeIcon={<CloseModalSvg />}
    >
      <FormState
        error={$addUserBranch.error}
        loading={$addUserBranch.loading}
      />
      <FormState
        error={$updateUserBranch.error}
        loading={$updateUserBranch.loading}
      />
      <Form onFinish={onSubmit}>
        <FormField title="Название филиала" error={fieldsErrors.name}>
          <Input
            placeholder="Введите название филиала"
            value={formFields.name}
            onChange={(name) => onFormFieldChange("name", name.target.value)}
          />
        </FormField>
        <div className="custom-modal__double-row">
          <div className="custom-modal__double-row-item">
            <FormField title="Регион" error={fieldsErrors.regionId}>
              <Select
                loading={$regionItems.loading}
                placeholder="Выбрать регион"
                value={
                  $regionItems.data.length && formFields.address?.regionId
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
        <FormField title="Адрес" error={fieldsErrors.address}>
          <Input
            placeholder="Введите адрес"
            value={formFields.address?.street}
            onChange={(street) =>
              onFormFieldChange("address", street.target.value, "street")
            }
          />
        </FormField>
        <FormField title="Номер телефона" error={fieldsErrors.phone}>
          <InputMask
            className="ant-input"
            mask="+\9\98 (99) 999 99 99"
            maskChar="*"
            value={formFields.phone}
            onChange={(phone) =>
              onPhoneFieldChange(
                "phone",
                phone.target.value.replace(/[^0-9]/g, "")
              )
            }
          />
        </FormField>
        <div className="custom-modal__button-row">
          <Button
            htmlType="submit"
            className="custom-button primary-button fullwidth"
          >
            {branchProps ? "Сохранить" : "Добавить"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
