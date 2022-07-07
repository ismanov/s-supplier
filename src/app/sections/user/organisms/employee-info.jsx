import React, { useState } from "react";
import { Button, Popover } from "antd";

import { AddUserEmployeeModal } from "./add-user-employee-modal";
import { EditUserEmployeePasswordModal } from "./edit-user-employee-password-modal";

import { formatPhoneNumber } from "helpers/format-phone";
import { EditPencilSvg } from "svgIcons/svg-icons";


export const EmployeeInfo = (props) => {
  const { currentEmployee } = props;

  const [ userEmployeeEditProps, setUserEmployeeEditProps ] = useState({
    visible: false,
    shouldRender: false,
    employee: null,
    isEmployeeEdit: null
  });

  const [ userEmployeePasswordEditProps, setUserEmployeePasswordEditProps ] = useState({
    visible: false,
    shouldRender: false,
    employee: null
  });

  const onEmployeeEditClick = () => {
    setUserEmployeeEditProps({ visible: true, shouldRender: true, employee: currentEmployee, isEmployeeEdit: true })
  };

  const onEmployeePasswordEditClick = () => {
    setUserEmployeePasswordEditProps({ visible: true, shouldRender: true, employee: currentEmployee })
  };

  const actionsContent = () => {
    return (
      <div>
        <div className="custom__popover__item">
          <Button className="custom-button primary-button" onClick={onEmployeeEditClick}>
            Редактировать
          </Button>
        </div>
        <div className="custom__popover__item">
          <Button className="custom-button primary-button" onClick={onEmployeePasswordEditClick}>
            Редактировать пароль
          </Button>
        </div>
      </div>
    )
  };

  return (
    <div className="content-cart__info">
      <div className="content-cart__info__edit">
        <Popover
          overlayClassName="custom__popover"
          placement="bottomRight"
          trigger="click"
          content={actionsContent()}
        >
          <Button className="custom-button edit-button onlyicon b-r-30">
            <EditPencilSvg />
          </Button>
        </Popover>
      </div>
      <div className="content-cart__info__item">
        <div className="content-cart__info__item-title">Филиал</div>
        <div className="content-cart__info__item-body">{currentEmployee.branch.name}</div>
      </div>
      <div className="content-cart__info__item">
        <div className="content-cart__info__item-title">Роли</div>
        <div className="content-cart__info__item-body">
          { currentEmployee.roles.map((role, roleIndex) => `${role.nameRu}${currentEmployee.roles.length > roleIndex + 1 ? "," : ""}`) }
        </div>
      </div>
      <div className="content-cart__info__item">
        <div className="content-cart__info__item-title">Телефон</div>
        <div className="content-cart__info__item-body">{formatPhoneNumber(currentEmployee.login)}</div>
      </div>
      {userEmployeeEditProps.shouldRender && <AddUserEmployeeModal
        modalProps={userEmployeeEditProps} setModalProps={setUserEmployeeEditProps}
      />}
      {userEmployeePasswordEditProps.shouldRender && <EditUserEmployeePasswordModal
        modalProps={userEmployeePasswordEditProps} setModalProps={setUserEmployeePasswordEditProps}
      />}
    </div>
  )
};