import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import InputMask from "react-input-mask";
import { Alert, Form, Input, Modal, Spin, Button, Select } from "antd";
import { debounce } from "helpers/debounce";

import effector from "../effector";

import { CloseModalSvg } from "svgIcons/svg-icons";
import { FormField } from "ui/molecules/form-field";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import { isValidPassword } from "helpers/password-validation";

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

const updateFilterSearch = debounce((action) => {
  action();
}, 400);

export const AddUserEmployeeModal = (props) => {
  const { $addUserEmployee, $updateUserEmployee, $branchesItems, $rolesItems } =
    useStore(store);

  const { modalProps, setModalProps } = props;

  const { employee: employeeProps, isEmployeeEdit } = modalProps;

  const [formFields, setFormFields] = useState({
    login: "998",
  });
  const [fieldsErrors, setFieldsErrors] = useState({});
  const [passwordWarning, setPasswordWarning] = useState("");
  const [confirmPasswordWarning, setConfirmPasswordWarning] = useState("");

  useEffect(() => {
    if ($updateUserEmployee.success) {
      openNotificationWithIcon("success", "Пользователь обновлен");
      closeModal();
    }

    if ($addUserEmployee.success) {
      openNotificationWithIcon("success", "Пользователь добавлен");
      closeModal();
    }
  }, [$updateUserEmployee.success, $addUserEmployee.success]);

  useEffect(() => {
    if (employeeProps) {
      setFormFields({
        id: employeeProps.id,
        branchId: employeeProps.branch.id,
        login: employeeProps.login,
        firstName: employeeProps.firstName,
        lastName: employeeProps.lastName,
        patronymic: employeeProps.patronymic,
        roles: employeeProps.roles.map((role) => role.code),
      });
    }

    if (!isEmployeeEdit) {
      effects.getBranchesItemsEffect();
      effects.getRolesItemsEffect();
    }
  }, []);

  const onFormFieldChange = (prop, val) => {
    setFormFields({
      ...formFields,
      [prop]: val,
    });
  };

  const onBranchesSearch = (value) => {
    updateFilterSearch(() => {
      effects.getBranchesItemsEffect({
        search: value,
      });
    });
  };

  const onLoginChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    onFormFieldChange("login", value ? value : "998");
  };

  const onPasswordChange = (prop, val) => {
    if (fieldsErrors[prop]) {
      setFieldsErrors({
        ...fieldsErrors,
        password: "",
      });
    }

    if (isValidPassword(val)) {
      setPasswordWarning("");
    } else if (val.length > 16) {
      setPasswordWarning("Максимальное количество символов 16");
    } else {
      setPasswordWarning(
        "Пароль должен состоять минимум из 8 символов, включая в себя цифры, строчная и заглавная буквы"
      );
    }

    onFormFieldChange(prop, val);
  };

  const onConfirmPasswordChange = (prop, val) => {
    if (fieldsErrors[prop]) {
      setFieldsErrors({
        ...fieldsErrors,
        confirmPassword: "",
      });
    }

    if (formFields.password !== val) {
      setConfirmPasswordWarning("Пароли не совпадают");
    } else {
      setConfirmPasswordWarning("");
    }

    onFormFieldChange(prop, val);
  };

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    events.resetAddUserEmployeeEvent();
    events.resetUpdateUserEmployeeEvent();

    setModalProps({
      ...modalProps,
      shouldRender: false,
      employee: null,
      isEmployeeEdit: null,
    });
  };

  const validateForm = () => {
    setPasswordWarning("");
    setConfirmPasswordWarning("");

    const notFilledMessage = "Не заполнено поле";

    const errors = {};

    if (!formFields.branchId) errors.branchId = notFilledMessage;
    if (!formFields.firstName) errors.firstName = notFilledMessage;
    if (!formFields.lastName) errors.lastName = notFilledMessage;
    if (!formFields.patronymic) errors.patronymic = notFilledMessage;
    if (!formFields.roles) errors.roles = notFilledMessage;

    if (formFields.login.length < 12 && formFields.login.length > 3)
      errors.login = "Некорректно введен логин";
    if (formFields.login.length === 3) errors.login = notFilledMessage;

    if (!employeeProps) {
      if (formFields.password) {
        if (formFields.password.length > 16) {
          errors.password = "Максимальное количество символов 16";
        } else {
          if (!isValidPassword(formFields.password)) {
            errors.password =
              "Пароль должен состоять минимум из 8 символов, включая в себя цифры, строчная и заглавная буквы";
          }
        }
      } else {
        errors.password = notFilledMessage;
      }

      if (formFields.confirmPassword) {
        if (formFields.password !== formFields.confirmPassword) {
          errors.confirmPassword = "Пароли не совпадают";
        }
      } else {
        errors.confirmPassword = notFilledMessage;
      }
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
      ...formFields,
      roles: formFields.roles.map((roleCode) => {
        return {
          code: roleCode,
        };
      }),
      confirmPassword: undefined,
      login: !employeeProps ? formFields.login : undefined,
    };

    if (employeeProps) {
      effects.updateUserEmployeeEffect(data);
    } else {
      effects.addUserEmployeeEffect(data);
    }
  };

  return (
    <Modal
      className="custom-modal"
      title={
        employeeProps ? "Редактировать пользователя" : "Добавить пользователя"
      }
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={464}
      centered={true}
      closeIcon={<CloseModalSvg />}
    >
      <FormState
        error={$addUserEmployee.error}
        loading={$addUserEmployee.loading}
      />
      <FormState
        error={$updateUserEmployee.error}
        loading={$updateUserEmployee.loading}
      />
      <Form onFinish={onSubmit}>
        {!isEmployeeEdit && (
          <FormField title="Филиал" error={fieldsErrors.branchId}>
            <Select
              showSearch
              loading={$branchesItems.loading}
              placeholder="Выбрать филиал"
              onSearch={onBranchesSearch}
              value={
                ($branchesItems.data || []).length && formFields.branchId
                  ? formFields.branchId
                  : undefined
              }
              onChange={(branchId) => onFormFieldChange("branchId", branchId)}
              filterOption={false}
              defaultActiveFirstOption={false}
            >
              {($branchesItems.data || []).map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </FormField>
        )}
        <FormField title="Имя" error={fieldsErrors.firstName}>
          <Input
            placeholder="Введите имя"
            value={formFields.firstName}
            onChange={(firstName) =>
              onFormFieldChange("firstName", firstName.target.value)
            }
          />
        </FormField>
        <FormField title="Фамилия" error={fieldsErrors.lastName}>
          <Input
            placeholder="Введите фамилию"
            value={formFields.lastName}
            onChange={(lastName) =>
              onFormFieldChange("lastName", lastName.target.value)
            }
          />
        </FormField>
        <FormField title="Отчество" error={fieldsErrors.patronymic}>
          <Input
            placeholder="Введите отчество"
            value={formFields.patronymic}
            onChange={(patronymic) =>
              onFormFieldChange("patronymic", patronymic.target.value)
            }
          />
        </FormField>
        {!isEmployeeEdit && (
          <>
            <FormField title="Роли" error={fieldsErrors.roles}>
              <Select
                showArrow
                showSearch={false}
                mode="multiple"
                loading={$rolesItems.loading}
                placeholder="Выбрать роли"
                value={
                  ($rolesItems.data || []).length && formFields.roles
                    ? formFields.roles
                    : undefined
                }
                onChange={(roles) => onFormFieldChange("roles", roles)}
              >
                {(Array.isArray($rolesItems.data) ? $rolesItems.data : []).map(
                  (item) => (
                    <Option value={item.code} key={item.code}>
                      {item.name}
                    </Option>
                  )
                )}
              </Select>
            </FormField>
          </>
        )}
        {!employeeProps && (
          <>
            <FormField title="Логин" error={fieldsErrors.login}>
              <InputMask
                className="ant-input custom-input"
                mask="+\9\98 (99) 999 99 99"
                maskChar="*"
                placeholder="Введите логин"
                value={formFields.login}
                onChange={onLoginChange}
              />
            </FormField>
            <FormField
              className="m-b-25"
              title="Пароль"
              note={passwordWarning}
              error={fieldsErrors.password}
            >
              <Input.Password
                autoComplete="new-password"
                className="auth-input"
                placeholder="Введите пароль"
                onChange={(password) =>
                  onPasswordChange("password", password.target.value)
                }
              />
            </FormField>
            <FormField
              className="m-b-25"
              title="Подтверждение пароля"
              note={confirmPasswordWarning}
              error={fieldsErrors.confirmPassword}
            >
              <Input.Password
                className="auth-input"
                placeholder="Введите пароль"
                onChange={(confirmPassword) =>
                  onConfirmPasswordChange(
                    "confirmPassword",
                    confirmPassword.target.value
                  )
                }
              />
            </FormField>
          </>
        )}
        <div className="custom-modal__button-row">
          <Button
            htmlType="submit"
            className="custom-button primary-button fullwidth"
          >
            {employeeProps ? "Сохранить" : "Добавить"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
