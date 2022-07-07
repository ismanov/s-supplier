import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Modal, Button, Form, Upload } from "antd";

import effector from "../effector";

import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import { FormState } from "ui/molecules/form-state";
import { FormField } from "ui/molecules/form-field";
import { CloseModalSvg } from "svgIcons/svg-icons";

const { store, events, effects } = effector;

export const UploadProductListModal = (props) => {
  const $uploadProductListExcel = useStore(store.$uploadProductListExcel);
  const $categoriesFilterProps = useStore(store.$categoriesFilterProps);
  const $productListFilterProps = useStore(store.$productListFilterProps);

  const { modalProps, setModalProps } = props;

  const categoryId = modalProps.categoryId;

  const [formFields, setFormFields] = useState({});

  const [fieldsErrors, setFieldsErrors] = useState({});

  useEffect(() => {
    if ($uploadProductListExcel.success) {
      openNotificationWithIcon('success', 'Список добавлен');

      closeModal();
      effects.getCategoriesEffect($categoriesFilterProps);

      if (categoryId) {
        effects.getProductListEffect($productListFilterProps);
      }
    }
  }, [$uploadProductListExcel.success]);


  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    events.resetUploadProductListExcelEvent();

    setModalProps({ ...modalProps, shouldRender: false });
  };


  const uploadProps = {
    onRemove: () => {
      setFormFields({ ...formFields, files: [] });
    },
    beforeUpload: (file) => {
      setFormFields({ ...formFields, files: [file] });

      return false;
    },
    fileList: formFields.files,
  };


  const validateForm = () => {
    const notFilledMessage = "Выберите файл";

    const errors = {};

    if (!formFields.files) errors.files = notFilledMessage;

    return errors;
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    const formData = new FormData();
    formData.append('file', formFields.files[0]);

    const data = {
      branchId: $categoriesFilterProps.branchId,
      categoryId: categoryId ? categoryId : undefined,
      file: formData
    };

    effects.uploadProductListExcelEffect(data);
  };

  return (
    <Modal
      className="custom-modal"
      title="Загрузка списка с товарами"
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={464}
      centered={true}
      closeIcon={<CloseModalSvg />}
    >
      <FormState error={$uploadProductListExcel.error} loading={$uploadProductListExcel.loading} />
      <Form>
        <FormField error={fieldsErrors.files}>
          <Upload {...uploadProps}>
            <Button>Выбрать файл</Button>
          </Upload>
        </FormField>
        <div className="custom-modal__button-row">
          <Button onClick={onSubmit} htmlType="submit" className="custom-button primary-button fullwidth">
            Загрузить
          </Button>
        </div>
      </Form>
    </Modal>
  );
};