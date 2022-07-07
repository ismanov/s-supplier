import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import {Button, Spin} from "antd";

import effector from "../effector";

import { EditPencilSvg } from "svgIcons/svg-icons";
import { UserInfoUpdateModal } from "../organisms/update-user-data-modal";
import { formatPhoneNumber } from "helpers/format-phone";

const { store, effects, events } = effector;

export const UserDetails = () => {
  const { $userInfo, $updateUserInfo } = useStore(store);
  const { firstName, lastName, patronymic, phone } = $userInfo.data;

  const [ userInfoEditProps, setUserInfoEditProps ] = useState({
    visible: false,
    shouldRender: false,
    userInfo: null
  });

  useEffect(() => {
    effects.getUserInfoEffect();
  }, []);

  useEffect(() => {
    if ($updateUserInfo.success) {
      effects.getUserInfoEffect();
    }
  }, [$updateUserInfo.success]);

  const onUserInfoEditClick = () => {
    setUserInfoEditProps({ visible: true, shouldRender: true, userInfo: {...$userInfo.data} })
  };

  return (
    <>
      <div className="user-cabinet__title">
        <span>Данные пользователя</span>
        <Button htmlType="submit" className="custom-button onlyicon edit-button b-r-30" onClick={onUserInfoEditClick}>
          <EditPencilSvg />
        </Button>
      </div>
      {$userInfo.loading ?
        <div className="spinner-wrap"><Spin /></div>
        :
        <div className="user-cabinet__info">
          {lastName &&
            <div className="user-cabinet__info__item">
              <div className="user-cabinet__info__item-title">Фамилия</div>
              <div className="user-cabinet__info__item-text">{lastName}</div>
            </div>
          }
          {firstName &&
            <div className="user-cabinet__info__item">
              <div className="user-cabinet__info__item-title">Имя</div>
              <div className="user-cabinet__info__item-text">{firstName}</div>
            </div>
          }
          {patronymic &&
            <div className="user-cabinet__info__item">
              <div className="user-cabinet__info__item-title">Отчество</div>
              <div className="user-cabinet__info__item-text">{patronymic}</div>
            </div>
          }
          {phone &&
            <div className="user-cabinet__info__item">
              <div className="user-cabinet__info__item-title">Номер телефона</div>
              <div className="user-cabinet__info__item-text">{formatPhoneNumber(phone)}</div>
            </div>
          }
        </div>
      }
      {userInfoEditProps.shouldRender && <UserInfoUpdateModal
        modalProps={userInfoEditProps} setModalProps={setUserInfoEditProps}
      />}
    </>
  )
};