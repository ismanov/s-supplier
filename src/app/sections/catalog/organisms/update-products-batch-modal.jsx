import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Button, Form, Input, Modal, Radio, Select } from "antd";

import effector from "../effector";

import { FormField } from "ui/molecules/form-field";
import { CloseModalSvg } from "svgIcons/svg-icons";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import { FormState } from "ui/molecules/form-state";

const { store, effects, events } = effector;

const { Option } = Select;

export const UpdateProductsBatchModal = (props) => {
  const $updateProductsBatch = useStore(store.$updateProductsBatch);
  const $productsBatch = useStore(store.$productsBatch);
  const $productListFilterProps = useStore(store.$productListFilterProps);
  const $vatItems = useStore(store.$vatItems);

  const { modalProps, setModalProps } = props;

  const [formFields, setFormFields] = useState({
    ids: $productsBatch,
  });

  const [fieldsErrors, setFieldsErrors] = useState({});

  useEffect(() => {
    if (!$vatItems.data.length) {
      effects.getVatItemsEffect();
    }
  }, []);

  useEffect(() => {
    if ($updateProductsBatch.success) {
      openNotificationWithIcon("success", "Товары обновлены");
      closeModal();

      events.resetProductsBatchEvent();
    }
  }, [$updateProductsBatch.success]);

  const onFormFieldChange = (prop, val) => {
    setFormFields({
      ...formFields,
      [prop]: val,
    });
  };

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    events.resetUpdateProductsBatchEvent();

    setModalProps({ ...modalProps, shouldRender: false });
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";

    const errors = {};

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

    const data = {
      branchId: $productListFilterProps.branchId,
      ids: formFields.ids,
      vatRate: formFields.vatRate,
    };

    effects.updateProductsBatchEffect(data);
  };

  return (
    <Modal
      className="custom-modal batch-update-modal"
      title="Редактирование выбраных товаров"
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={464}
      centered={true}
      closeIcon={<CloseModalSvg />}
    >
      <FormState
        error={$updateProductsBatch.error}
        loading={$updateProductsBatch.loading}
      />
      <Form>
        <div className="custom-modal__checkboxes">
          <div style={{ color: "grey" }}>
            к сожалению эта функция временно не работает <br />
          </div>
          <FormField title="НДС" error={fieldsErrors.vatRate}>
            <Select
              allowClear
              loading={$vatItems.loading}
              placeholder="Выберите НДС"
              value={formFields.vatRate}
              onChange={(percent) => onFormFieldChange("vatRate", percent)}
            >
              {$vatItems.data?.map((item) => (
                <Option value={item.code} key={item.code}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </FormField>
        </div>
        <div className="custom-modal__button-row">
          <Button
            htmlType="submit"
            className="custom-button primary-button fullwidth"
            onClick={onSubmit}
          >
            Сохранить
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
