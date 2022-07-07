import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { Button, Popover, Spin, Avatar } from 'antd';

import { UserEditModal } from "./user-edit-modal";

import { ArrowSvg, UserAvatarSvg } from "svgIcons/svg-icons";

export const CurrentUserDropdown = (props) => {
  const history = useHistory();

  const { $currentUser } = props;
  const { loading: currentUserLoading, data: currentUserData } = $currentUser;

  const [ userEditProps, setUserEditProps ] = useState({
    visible: false,
    shouldRender: false
  });

  const onSignOutClick = () => {
    history.push("/sign-in");
  };

  const onEditUserClick = () => {
    setUserEditProps({ visible: true, shouldRender: true })
  };

  const dropdownMenu = () => {
    return (
      <div className="site-header-user__dropdown">
        <div className="site-header-user__dropdown__logout">
          <div className="site-header-user__dropdown__item">
            <Button type="link" onClick={onEditUserClick}>Редактировать профиль</Button>
          </div>
          <div className="site-header-user__dropdown__item">
            <Button type="link" onClick={onSignOutClick}>Выйти</Button>
          </div>
        </div>
      </div>
    );
  };

  const renderInner = () => {
    if (currentUserLoading) {
      return (
        <div className="site-header-user__loading">
          <Spin />
        </div>
      );
    } else if (currentUserData) {
      return (
        <div className="site-header-user__name">
          {currentUserData.firstName ?
            `${currentUserData.lastName} ${currentUserData.firstName}`
            :
            "Пользователь"
          }
        </div>
      );
    }
  };

  return (
    <div className="site-header-user">
      <Popover placement="bottomRight" content={dropdownMenu()} trigger="click">
        <div className="site-header-user__row">
          <div className="site-header-user__row__left">
            <Avatar size={40} icon={<UserAvatarSvg />} />
          </div>
          <div className="site-header-user__row__middle">
            {renderInner()}
          </div>
          <div className="site-header-user__row__right">
            <ArrowSvg />
          </div>
        </div>
      </Popover>
      {userEditProps.shouldRender && <UserEditModal
        modalProps={userEditProps} setModalProps={setUserEditProps}
      />}
    </div>
  )
};
