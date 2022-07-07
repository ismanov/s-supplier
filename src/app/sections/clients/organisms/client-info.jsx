import React, { useState } from "react";
import { Button } from "antd";

import { formatPhoneNumber } from "helpers/format-phone";


export const ClientInfo = (props) => {
  const { currentClient } = props;

  return (
    <div className="content-cart__info">
      <div className="content-cart__info__item">
        <div className="content-cart__info__item-title">Инн</div>
        <div className="content-cart__info__item-body">{currentClient.tin}</div>
      </div>
      <div className="content-cart__info__item">
        <div className="content-cart__info__item-title">Бренд</div>
        <div className="content-cart__info__item-body">{currentClient.brand}</div>
      </div>
      <div className="content-cart__info__item">
        <div className="content-cart__info__item-title">Регион</div>
        <div className="content-cart__info__item-body">{currentClient.address.region.name}</div>
      </div>
      <div className="content-cart__info__item">
        <div className="content-cart__info__item-title">Район</div>
        <div className="content-cart__info__item-body">{currentClient.address.city.name}</div>
      </div>
      <div className="content-cart__info__item">
        <div className="content-cart__info__item-title">Адрес</div>
        <div className="content-cart__info__item-body">{currentClient.address.address}</div>
      </div>
      <div className="content-cart__info__item">
        <div className="content-cart__info__item-title">Телефон</div>
        <div className="content-cart__info__item-body">{formatPhoneNumber(currentClient.phone)}</div>
      </div>
      <div className="content-cart__info__item">
        <div className="content-cart__info__item-title">Банк</div>
        <div className="content-cart__info__item-body">{currentClient.bankAccount.bankName}</div>
      </div>
      <div className="content-cart__info__item">
        <div className="content-cart__info__item-title">Расчетный счет</div>
        <div className="content-cart__info__item-body">{currentClient.bankAccount.number}</div>
      </div>
    </div>
  )
};