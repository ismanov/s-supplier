import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import InputMask from "react-input-mask";
import {Alert, Form, Input, Modal, Spin, Button, Select} from "antd";

import effector from "../effector";

import { CloseModalSvg } from "svgIcons/svg-icons";
import { FormField } from "ui/molecules/form-field";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";

const { store, effects, events } = effector;

const { Option } = Select;

const FormState = ({ error, loading }) => {
  return (
    <div>
      {error && <div className="m-b-20">
        <Alert message={error.detail || error.title} type="error"/>
      </div>}
      {loading && <div className="abs-loader">
        <Spin size="large"/>
      </div>}
    </div>
  )
};

export const UpdateCategoryModal = (props) => {
  const $addCategory = useStore(store.$addCategory);
  const $updateCategory = useStore(store.$updateCategory);
  const $categoriesFilterProps = useStore(store.$categoriesFilterProps);

  const { modalProps, setModalProps } = props;

  const { category: categoryProps, parentCategory: categoryParentProps } = modalProps;

  const [ formFields, setFormFields ] = useState({
    branchId: $categoriesFilterProps.branchId
  });
  const [ fieldsErrors, setFieldsErrors ] = useState({});

  useEffect(() => {
    if ($addCategory.success) {
      openNotificationWithIcon('success', 'Категория добавлена');
      closeModal();
    }

    if ($updateCategory.success) {
      openNotificationWithIcon('success', 'Категория обновлена');
      closeModal();
    }
  }, [$addCategory.success, $updateCategory.success]);

  useEffect(() => {
    if (categoryProps) {
      setFormFields({
        id: categoryProps.id,
        branchId: $categoriesFilterProps.branchId,
        name: categoryProps.name
      });
    }

    if (categoryParentProps) {
      setFormFields({
        parentId: categoryParentProps.id,
        branchId: $categoriesFilterProps.branchId
      });
    }
  }, []);

  const onFormFieldChange = (prop, val) => {
    setFormFields({
      ...formFields,
      [prop]: val
    });
  };

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    if (categoryProps) {
      events.resetUpdateCategoryEvent();
    } else {
      events.resetAddCategoryEvent();
    }

    setModalProps({ ...modalProps, shouldRender: false, category: null });
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";

    const errors = {};

    if (!formFields.name) errors.name = notFilledMessage;

    return errors;
  };

  const onSubmit = () => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    if (categoryProps) {
      effects.updateCategoryEffect(formFields);
    } else {
      effects.addCategoryEffect(formFields);
    }
  };

  return (
    <Modal
      className="custom-modal"
      title={categoryProps ? "Редактировать категорию" : `Добавить категорию ${categoryParentProps ? `в ${categoryParentProps.name}` : ""}`}
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={464}
      centered={true}
      closeIcon={<CloseModalSvg />}
    >
      <FormState error={$addCategory.error} loading={$addCategory.loading} />
      <FormState error={$updateCategory.error} loading={$updateCategory.loading} />
      <Form onFinish={onSubmit}>
        <FormField title="Название категории" error={fieldsErrors.name}>
          <Input
            placeholder="Введите название категории"
            value={formFields.name}
            onChange={(name) => onFormFieldChange("name", name.target.value)}
          />
        </FormField>
        <div className="custom-modal__button-row">
          <Button htmlType="submit" className="custom-button primary-button fullwidth">{categoryProps ? "Сохранить": "Добавить"}</Button>
        </div>
      </Form>
    </Modal>
  )
};