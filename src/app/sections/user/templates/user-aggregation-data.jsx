import React, { useState } from "react";
import { Button } from "antd";

import effector from "../effector";

import { EditPencilSvg } from "svgIcons/svg-icons";
import { UserAggregationUpdateModal } from "../organisms/update-user-aggregation-modal";
import { useStore } from "effector-react";

const { store } = effector;

export const UserAggregation = () => {
  const { $userCompanyInfo } = useStore(store)
  const [updateUserAggregationProps, setUpdateUserAggregationProps] = useState({
    visible: false,
    shouldRender: false,
    userAggregationData: null
  });

  const onUserAggregationEdit = () => {
    const { gcp, omsId, turonToken, id } = $userCompanyInfo.data;
    setUpdateUserAggregationProps({
      visible: true,
      shouldRender: true,
      userAggregationData: { gcp, omsId, turonToken, id }
    })
  };
  const { gcp, omsId, turonToken } = $userCompanyInfo.data;

  return (
    <>
      <div className="user-cabinet__title">
        <span>Данные агрегации</span>
        <Button htmlType="submit" className="custom-button onlyicon edit-button b-r-30" onClick={onUserAggregationEdit}>
          <EditPencilSvg/>
        </Button>
      </div>
      <div className="user-cabinet__info">
        {gcp && (
          <div className="user-cabinet__info__item">
            <div className="user-cabinet__info__item-title">CS1 код</div>
            <div className="user-cabinet__info__item-text">{gcp}</div>
          </div>
        )}
        {omsId && (
          <div className="user-cabinet__info__item">
            <div className="user-cabinet__info__item-title">OMSID</div>
            <div className="user-cabinet__info__item-text">{omsId}</div>
          </div>
        )}
        {turonToken && (
          <div className="user-cabinet__info__item">
            <div className="user-cabinet__info__item-title">Turon token</div>
            <div className="user-cabinet__info__item-text">{turonToken}</div>
          </div>
        )}
      </div>
      {updateUserAggregationProps.shouldRender && <UserAggregationUpdateModal
        modalProps={updateUserAggregationProps} setModalProps={setUpdateUserAggregationProps}
      />}
    </>
  )
};