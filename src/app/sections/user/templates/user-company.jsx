import React, {useEffect, useState} from "react";
import { useStore } from "effector-react";

import effector from "../effector";

import { EditPencilSvg } from "svgIcons/svg-icons";
import {UserCompanyInfoUpdateModal} from "../organisms/update-user-company-modal";
import {Button, Spin} from "antd";

const { store, events, effects } = effector;

export const UserCompany = () => {
  const { $userCompanyInfo, $updateUserCompanyInfo } = useStore(store);
  const { name, businessType, brand, tin, activityTypes, deliveryTypes, paymentTypes } = $userCompanyInfo.data;

  useEffect(() => {
    effects.getUserCompanyInfoEffect();
  }, []);

  useEffect(() => {
    if ($updateUserCompanyInfo.success) {
      effects.getUserCompanyInfoEffect();
    }
  }, [$updateUserCompanyInfo.success]);

  const [ userCompanyInfoEditProps, setUserCompanyInfoEditProps ] = useState({
    visible: false,
    shouldRender: false,
    userCompanyInfo: null
  });

  const onUserCompanyEdit = () => {
    setUserCompanyInfoEditProps({ visible: true, shouldRender: true, userCompanyInfo: {...$userCompanyInfo.data} })
  };

  const myDelivery = [];
  const myPayments = [];

  if (Object.keys($userCompanyInfo.data).length) {
    deliveryTypes.forEach((item) => {
      if (item.selected) {
        myDelivery.push(item);
      }
    });

    paymentTypes.forEach((item) => {
      if (item.selected) {
        myPayments.push(item);
      }
    });
  }

  return (
    <>
      <div className="user-cabinet__title">
        <span>Данные компании</span>
        <Button htmlType="submit" className="custom-button onlyicon edit-button b-r-30" onClick={onUserCompanyEdit}>
          <EditPencilSvg />
        </Button>
      </div>
      {$userCompanyInfo.loading && <div className="spinner-wrap"><Spin /></div>}
      {Object.keys($userCompanyInfo.data).length > 0 &&
        <div className="user-cabinet__info">
          {name &&
            <div className="user-cabinet__info__item">
              <div className="user-cabinet__info__item-title">Название</div>
              <div className="user-cabinet__info__item-text">{businessType ? businessType.nameRu : ""} “{name}”</div>
            </div>
          }
          {brand &&
            <div className="user-cabinet__info__item">
              <div className="user-cabinet__info__item-title">Бренд</div>
              <div className="user-cabinet__info__item-text">{brand}</div>
            </div>
          }
          {tin &&
            <div className="user-cabinet__info__item">
              <div className="user-cabinet__info__item-title">ИНН</div>
              <div className="user-cabinet__info__item-text">{tin}</div>
            </div>
          }
          {(activityTypes || []).length > 0 &&
            <div className="user-cabinet__info__item">
              <div className="user-cabinet__info__item-title">Сферы деятельности</div>
              <div className="user-cabinet__info__item-text">
                {activityTypes.map((item, index) =>
                  <span key={item.id}>{item.name}{activityTypes.length > index + 1 && ", "}</span>
                )}
              </div>
            </div>
          }
          {(myDelivery || []).length > 0 &&
            <div className="user-cabinet__info__item">
              <div className="user-cabinet__info__item-title">Способы доставки</div>
              <div className="user-cabinet__info__item-text">
                {myDelivery.map((item, index) =>
                  <span key={item.code}>{item.name}{myDelivery.length > index + 1 && ", "}</span>
                )}
              </div>
            </div>
          }
          {(myPayments || []).length > 0 &&
            <div className="user-cabinet__info__item">
              <div className="user-cabinet__info__item-title">Способы оплаты</div>
              <div className="user-cabinet__info__item-text">
                {myPayments.map((item, index) =>
                  <span key={item.code}>{item.name}{myPayments.length > index + 1 && ", "}</span>
                )}
              </div>
            </div>
          }
        </div>
      }
      {userCompanyInfoEditProps.shouldRender && <UserCompanyInfoUpdateModal
        modalProps={userCompanyInfoEditProps} setModalProps={setUserCompanyInfoEditProps}
      />}
    </>
  )
};