import React, {useEffect, useState} from "react";
import { useStore } from "effector-react";
import { Button, Spin } from "antd";

import effector from "../effector";

import { EditPencilSvg } from "svgIcons/svg-icons";
import { UserCompanyBankInfoUpdateModal } from "../organisms/update-user-company-bank-modal";

const { store, events, effects } = effector;

export const UserCompanyBank = () => {
  const { $userCompanyBankInfo, $addUserCompanyBankInfo, $updateUserCompanyBankInfo } = useStore(store);
  const { bank, oked, accountNumber } = $userCompanyBankInfo.data;

  useEffect(() => {
    effects.getUserCompanyBankInfoEffect();
  }, []);

  useEffect(() => {
    if ($addUserCompanyBankInfo.success || $updateUserCompanyBankInfo.success) {
      effects.getUserCompanyBankInfoEffect();
    }
  }, [$addUserCompanyBankInfo.success, $updateUserCompanyBankInfo.success]);

  const [ userCompanyBankInfoEditProps, setUserCompanyBankInfoEditProps ] = useState({
    visible: false,
    shouldRender: false,
    userCompanyBankInfo: null
  });

  const onUserCompanyBankEdit = () => {
    setUserCompanyBankInfoEditProps({ visible: true, shouldRender: true, userCompanyBankInfo: $userCompanyBankInfo.data })
  };

  return (
    <>
      <div className="user-cabinet__title">
        <span>Банк компании</span>
        <Button htmlType="submit" className="custom-button onlyicon edit-button b-r-30" onClick={onUserCompanyBankEdit}>
          <EditPencilSvg />
        </Button>
      </div>
      {$userCompanyBankInfo.loading ?
        <div className="spinner-wrap"><Spin /></div>
        :
        <div className="user-cabinet__info">
          {bank &&
          <div className="user-cabinet__info__item">
            <div className="user-cabinet__info__item-title">Банк</div>
            <div className="user-cabinet__info__item-text">{bank.name}</div>
          </div>
          }
          {accountNumber &&
          <div className="user-cabinet__info__item">
            <div className="user-cabinet__info__item-title">Расчетный счет</div>
            <div className="user-cabinet__info__item-text">{accountNumber}</div>
          </div>
          }
          {oked &&
          <div className="user-cabinet__info__item">
            <div className="user-cabinet__info__item-title">ОКЭД</div>
            <div className="user-cabinet__info__item-text">{oked}</div>
          </div>
          }
        </div>
      }
      {userCompanyBankInfoEditProps.shouldRender && <UserCompanyBankInfoUpdateModal
        modalProps={userCompanyBankInfoEditProps} setModalProps={setUserCompanyBankInfoEditProps}
      />}
    </>
  )
};