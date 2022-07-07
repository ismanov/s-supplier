import React, { useState } from "react";
import {Button, Spin} from "antd";

import effector from "../effector";

import { EditPencilSvg } from "svgIcons/svg-icons";
import { UpdateUserPasswordModal } from "../organisms/update-user-password-modal";

const { store, effects, events } = effector;

export const UserSecurity = () => {
  const [ updateUserPasswordProps, setUpdateUserPasswordProps ] = useState({
    visible: false,
    shouldRender: false
  });

  const onUserPasswordEdit = () => {
    setUpdateUserPasswordProps({ visible: true, shouldRender: true })
  };

  return (
    <>
      <div className="user-cabinet__title">
        <span>Безопасность</span>
        <Button htmlType="submit" className="custom-button onlyicon edit-button b-r-30" onClick={onUserPasswordEdit}>
          <EditPencilSvg />
        </Button>
      </div>
      <div className="user-cabinet__info">
        <div className="user-cabinet__info__item">
          <div className="user-cabinet__info__item-title">Пароль</div>
          <div className="user-cabinet__info__item-text">********</div>
        </div>
        {/*<div className="user-cabinet__info__item">*/}
        {/*  <div className="user-cabinet__info__item-title">Аутентификация</div>*/}
        {/*  <div className="user-cabinet__info__item-text">Включена</div>*/}
        {/*</div>*/}
        {/*<div className="user-cabinet__info__item">*/}
        {/*  <div className="user-cabinet__info__item-title">Доступ к Telegram </div>*/}
        {/*  <div className="user-cabinet__info__item-text">Отключен</div>*/}
        {/*</div>*/}
      </div>
      {updateUserPasswordProps.shouldRender && <UpdateUserPasswordModal
        modalProps={updateUserPasswordProps} setModalProps={setUpdateUserPasswordProps}
      />}
    </>
  )
};