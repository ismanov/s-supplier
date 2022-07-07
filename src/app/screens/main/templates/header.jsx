import React, {useEffect, useState} from "react";
import { useStore } from "effector-react";
import { Link } from "react-router-dom";

import effector from "../effector";

import { CurrentUserDropdown } from "../organisms/current-user-dropdown";
import { SideNavigation } from "../organisms/side-navigation";

import logo from "images/logo.svg";
import { BurgerMenuSvg } from "svgIcons/svg-icons";
import {Button} from "antd";
import * as constants from "../constants";

const { store, events, effects } = effector;

const Header = () => {
  const { $currentUser } = useStore(store);

  const initialMenuType = localStorage.getItem("menuCollapsed") ? localStorage.getItem("menuCollapsed") : constants.MENU_TYPE_NOT_COLLAPSED;

  const [ menuType, setMenuType ] = useState(initialMenuType);

  const onChangeMenuMode = () => {
    const type = menuType === constants.MENU_TYPE_COLLAPSED ? constants.MENU_TYPE_NOT_COLLAPSED : constants.MENU_TYPE_COLLAPSED;

    localStorage.setItem('menuCollapsed', type);
    setMenuType(type);
  };

  return (
    <>
      <header className="site-header">
        <div className="site-header__left">
          <Button className="custom-button add-button onlyicon b-r-30 m-r-15" onClick={onChangeMenuMode}>
            <BurgerMenuSvg />
          </Button>
          <div className="site-logo">
            <Link to="/"><img src={logo} alt=""/></Link>
          </div>
        </div>
        <div className="site-header__right">
          <CurrentUserDropdown $currentUser={$currentUser} />
        </div>
      </header>
      <SideNavigation menuType={menuType} />
    </>
  )
};

export default Header;