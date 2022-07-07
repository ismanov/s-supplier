import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Modal, Form, Alert, Spin, Input, Button } from "antd";

import effector from "../effector";
import currentUserEffector from "../../../screens/main/effector";

const { store, effects, events } = effector;
const { store: currentUserStore } = currentUserEffector;

import { isValidPassword } from "helpers/password-validation";

import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import { FormField } from "ui/molecules/form-field";
import { CloseModalSvg } from "svgIcons/svg-icons";

export const UpdateUserPasswordModal = (props) => {
  const { $updateUserPassword } = useStore(store);
  const { $currentUser } = useStore(currentUserStore);

  const { modalProps, setModalProps } = props;

  const [ formFields, setFormFields ] = useState({});
  const [ fieldsErrors, setFieldsErrors ] = useState({});

  const [ passwordWarning, setPasswordWarning ] = useState("");
  const [ confirmPasswordWarning, setConfirmPasswordWarning ] = useState("");

  useEffect(() => {
    if ($updateUserPassword.success) {
      openNotificationWithIcon('success', 'Пароль изменён');
      closeModal();
    }
  }, [$updateUserPassword.success]);


  const onFormFieldChange = (prop, val) => {
    setFormFields({
      ...formFields,
      [prop]: val
    });
  };

  const onNewPasswordChange = (prop, val) => {
    if (!fieldsErrors[prop]) {
      if (isValidPassword(val)) {
        setPasswordWarning("");
      } else if (val.length > 16) {
        setPasswordWarning('Максимальное количество символов 16');
      } else {
        setPasswordWarning('Пароль должен состоять минимум из 8 символов, включая в себя цифры, строчная и заглавная буквы');
      }
    }

    onFormFieldChange(prop, val);
  };

  const onConfirmNewPasswordChange = (prop, val) => {
    if (!fieldsErrors[prop]) {
      if (formFields.newPassword !== val) {
        setConfirmPasswordWarning("Пароли не совпадают");
      } else {
        setConfirmPasswordWarning("");
      }
    }

    onFormFieldChange(prop, val);
  };

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    events.resetUpdateUserPasswordEvent();

    setModalProps({ ...modalProps, shouldRender: false });
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";
    setPasswordWarning("");
    setConfirmPasswordWarning("");

    const errors = {};

    if (!formFields.currentPassword) errors.currentPassword = notFilledMessage;
    if (!formFields.confirmNewPassword) errors.confirmNewPassword = notFilledMessage;

    if (formFields.newPassword && formFields.newPassword.length > 16 ) {
      errors.newPassword = "Максимальное количество символов 16";
    } else {
      if (!isValidPassword(formFields.newPassword)) {
        errors.newPassword = 'Пароль должен состоять минимум из 8 символов, включая в себя цифры, строчная и заглавная буквы';
      }
    }

    if (formFields.newPassword !== formFields.confirmNewPassword) {
      errors.confirmNewPassword = 'Пароли не совпадают';
    }

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
      id: $currentUser.data.id,
      currentPassword: formFields.currentPassword,
      newPassword: formFields.newPassword
    };

    effects.updateUserPasswordEffect(data);
  };


  return (
    <Modal
      className="custom-modal"
      title="Изменить пароль"
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={464}
      centered={true}
      closeIcon={<CloseModalSvg />}
    >
      {$updateUserPassword.error && <div className="m-b-20">
        <Alert message={$updateUserPassword.error.detail || $updateUserPassword.error.title} type="error" />
      </div>}
      {$updateUserPassword.loading && <div className="abs-loader">
        <Spin size="large"/>
      </div>}
      <Form onFinish={onSubmit}>
        <FormField title="Текущий пароль" error={fieldsErrors.currentPassword}>
          <Input.Password
            placeholder="Введите текущий пароль"
            onChange={(currentPassword) => onFormFieldChange("currentPassword", currentPassword.target.value)}
          />
        </FormField>
        <FormField title="Новый пароль" note={passwordWarning} error={fieldsErrors.newPassword}>
          <Input.Password
            placeholder="Введите новый пароль"
            onChange={(newPassword) => onNewPasswordChange("newPassword", newPassword.target.value)}
          />
        </FormField>
        <FormField title="Подтвердите новый пароль" note={confirmPasswordWarning} error={fieldsErrors.confirmNewPassword}>
          <Input.Password
            placeholder="Подтвердите новый пароль"
            onChange={(confirmNewPassword) => onConfirmNewPasswordChange("confirmNewPassword", confirmNewPassword.target.value)}
          />
        </FormField>
        <div className="custom-modal__button-row">
          <Button htmlType="submit" className="custom-button primary-button fullwidth">Сохранить</Button>
        </div>
      </Form>
    </Modal>
  );
};