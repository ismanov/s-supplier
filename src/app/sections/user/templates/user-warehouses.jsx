import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Link } from "react-router-dom";
import {Button, Collapse, Spin} from 'antd';

import effector from "../effector";

import { EditPencilSvg } from "svgIcons/svg-icons";
import { formatPhoneNumber } from "helpers/format-phone";
import { UpdateUserBranchModal } from "../organisms/update-user-branch-modal";

const { store, effects, events } = effector;

const { Panel } = Collapse;

export const UserWarehouses = () => {
  const { $userBranches, $addUserBranch, $updateUserBranch } = useStore(store);
  const [ userBranchEditProps, setUserWarehouseEditProps ] = useState({
    visible: false,
    shouldRender: false,
    branch: null
  });

  useEffect(() => {
    effects.getUserBranchesEffect({
      size: 10
    });
  }, []);

  useEffect(() => {
    if ($updateUserBranch.success || $addUserBranch.success) {
      effects.getUserBranchesEffect({
        orderBy: "id",
        size: 10
      });
    }
  }, [$updateUserBranch.success, $addUserBranch.success]);

  const onWarehouseEditClick = (item) => {
    setUserWarehouseEditProps({ visible: true, shouldRender: true, branch: item })
  };

  const renderWarehouses = (arr) => {
    return arr.map((item, index) => {
      return (
        <Panel header={item.name} key={index + 1}>
          <div className="user-cabinet__info__item edit-item">
            <Button htmlType="submit" className="custom-button onlyicon edit-button b-r-30" onClick={() => onWarehouseEditClick(item)}>
              <EditPencilSvg />
            </Button>
          </div>
          {item.address &&
          <div className="user-cabinet__info__item">
            <div className="user-cabinet__info__item-title">Адрес</div>
            <div className="user-cabinet__info__item-text">{item.address.street}</div>
          </div>
          }
          {item.phone &&
          <div className="user-cabinet__info__item">
            <div className="user-cabinet__info__item-title">Телефон</div>
            <div className="user-cabinet__info__item-text">+{item.phone}</div>
          </div>
          }
          {item.owner &&
          <div className="user-cabinet__info__item">
            <div className="user-cabinet__info__item-title">Ответственное лицо</div>
            <div className="user-cabinet__info__item-text">
              Администратор: {item.owner.lastName} {item.owner.firstName} <br/>
              {formatPhoneNumber(item.owner.login)}
            </div>
          </div>
          }
        </Panel>
      )
    });
  };

  return (
    <>
      <div className="user-cabinet__title user-cabinet__title-branches">
        <span>Филиалы ({$userBranches.data.totalElements})</span>
        <Link to="/user/branches">Все филиалы</Link>
      </div>
      {$userBranches.loading ?
        <div className="spinner-wrap"><Spin/></div>
        :
        <div className="user-cabinet__info">
          <Collapse accordion>
            {renderWarehouses($userBranches.data.content)}
          </Collapse>
        </div>
      }
      {userBranchEditProps.shouldRender && <UpdateUserBranchModal
        modalProps={userBranchEditProps} setModalProps={setUserWarehouseEditProps}
      />}
    </>
  )
};