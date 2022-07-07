import React, { useState, useEffect } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Menu } from "antd";

import effector from "../effector";

import { onPaths } from "helpers/path";

import {
  GeneralInfoSvg,
  CatalogSvg,
  OrdersSvg,
  MainSvg,
  WarehouseSvg,
  InvoiceSvg,
  AggregationIconSvg
} from "svgIcons/svg-icons";

import * as constants from "../constants";
import { useStore } from "effector-react";

const { store, events, effects } = effector;

const { SubMenu } = Menu;

const findOpenKeysInTree = (tree, path, parents) => {
  if (!tree || !tree.length) {
    return null;
  }

  for (let i = 0; i < tree.length; i++) {
    const item = tree[i];
    const newParents = [...parents];

    newParents.push(item.path);

    if (item.path === path) {
      return newParents;
    }

    const subParents = findOpenKeysInTree(item.sub, path, newParents);

    if (subParents) {
      return subParents;
    }
  }

  return null;
};

const getMenu = (menu, level = 1, onSubMenuClick) => {
  const className = level === 1 ? "left-menu__item" : "left-menu__sub-item";

  return menu.map((item) => {
    const menuItem = (
      <div className={className}>
        <NavLink to={item.path} {...item.linkProps}>
          {item.icon}
          <span>{item.name}</span>
        </NavLink>
      </div>
    );

    const subMenuItem = (
      <div onClick={() => onSubMenuClick(item.path)} className={className}>
        <div className="left-menu__sub-item-link">
          {item.icon}
          <span>{item.name}</span>
        </div>
      </div>
    );

    if (item.sub && item.sub.length) {
      return (
        <SubMenu key={item.path} title={subMenuItem}>
          {getMenu(item.sub, level + 1)}
        </SubMenu>
      );
    }

    return <Menu.Item key={item.path}>{menuItem}</Menu.Item>;
  });
};

const findOpenKeysInSubPath = (pathname, menuData) => {
  const arrayPath = pathname.split("/");
  arrayPath.splice(-1, 1);

  if (arrayPath <= 1) {
    return null;
  }

  const newPath = arrayPath.join("/");

  const openKeys = findOpenKeysInTree(menuData, newPath, []);

  if (openKeys) {
    return openKeys;
  }

  return findOpenKeysInSubPath(newPath, menuData);
};

const SideNavigationView = (props) => {
  const { $currentUser } = useStore(store);

  const { roles } = $currentUser.data;

  const { location, menuType } = props;

  const menuDataDefault = [
    {
      name: "Главная",
      path: "/",
      icon: <MainSvg />,
      linkProps: { exact: true },
    },
    {
      name: "Компания",
      path: "/user",
      icon: <GeneralInfoSvg />,
      sub: [
        {
          name: "Общая информация",
          path: "/user/information",
        },
        {
          name: "Филиалы",
          path: "/user/branches",
        },
        {
          name: "Пользователи",
          path: "/user/employees",
        },
      ],
    },
    {
      name: "Каталог",
      path: "/catalog",
      icon: <CatalogSvg />,
      sub: [
        {
          name: "Мой каталог",
          path: "/catalog/all",
        },
        {
          name: "Единый каталог",
          path: "/catalog/single",
        },
      ],
    },
    {
      name: "Склад",
      path: "/warehouse",
      icon: <WarehouseSvg />,
      sub: [
        {
          name: "Приход товара",
          path: "/warehouse/stock",
        },
        {
          name: "Заказы",
          path: "/warehouse/orders",
        },
        {
          name: "Отгрузка товара",
          path: "/warehouse/shipment",
        },
        {
          name: "Общие остатки",
          path: "/warehouse/stock-balance",
        },
        {
          name: "Склады",
          path: "/warehouse/all",
        },
        {
          name: "Поставщики",
          path: "/warehouse/suppliers",
        },
        {
          name: "Клиенты",
          path: "/warehouse/customers",
        },
      ],
    },
    {
      name: "Агрегация",
      path: "/aggregation",
      icon: <AggregationIconSvg />,
      sub: [
        {
          name: "Список",
          path: "/aggregation/list",
        },
        {
          name: "Заказ КА",
          path: "/aggregation/orders",
        },
      ],
    },
    {
      name: "Счет-фактуры",
      path: "/invoices",
      icon: <InvoiceSvg />,
      sub: [
        {
          name: "Полученные",
          path: "/invoices/incoming ",
        },
        {
          name: "Отправленные",
          path: "/invoices/outgoing",
        },
      ],
    },
    // {
    //   name: "Клиенты",
    //   path: "/clients",
    //   icon: <ClientsSvg />,
    //   sub: [
    //     {
    //       name: "Мои клиенты",
    //       path: "/clients/list"
    //     }
    //   ]
    // },
    // {
    //   name: "Заказы",
    //   path: "/orders",
    //   icon: <OrdersSvg />,
    //   sub: [
    //     {
    //       name: "Мой заказы",
    //       path: "/orders/list"
    //     }
    //   ]
    // },
    // {
    //   name: "Отчеты заказов",
    //   path: "/reports",
    //   icon: <ReportsSvg />,
    //   sub: [
    //     {
    //       name: "По заказам",
    //       path: "/reports/orders"
    //     },
    //     {
    //       name: "По клиентам",
    //       path: "/reports/clients"
    //     },
    //     {
    //       name: "По филиалам",
    //       path: "/reports/branches"
    //     }
    //   ]
    // }
  ];

  let menuData = [];

  if (roles.includes("ROLE_BUSINESS_OWNER")) {
    menuData = menuDataDefault;
  } else if (roles.includes("ROLE_BRANCH_ADMIN")) {
    menuData = menuDataDefault.map((item) => {
      let curItem = { ...item };

      if (curItem.path === "/user") {
        curItem = {
          name: "Компания",
          path: "/user",
          icon: <GeneralInfoSvg />,
          sub: [
            {
              name: "Пользователи",
              path: "/user/employees",
            },
          ],
        };
      }

      return curItem;
    });
  } else if (roles.includes("ROLE_AGENT")) {
    menuData = menuDataDefault.filter(
      (item) =>
        item.path !== "/user" &&
        item.path !== "/catalog" &&
        item.path !== "/clients" &&
        item.path !== "/reports"
    );
  } else {
    menuData = menuDataDefault.filter(
      (item) =>
        item.path !== "/" &&
        item.path !== "/user" &&
        item.path !== "/catalog" &&
        item.path !== "/clients" &&
        item.path !== "/reports"
    );
  }

  const [openKeys, setOpenKeys] = useState(
    findOpenKeysInTree(menuData, location.pathname, [])
  );

  useEffect(() => {
    let oKeys = findOpenKeysInTree(menuData, location.pathname, []);

    if (!oKeys) {
      oKeys = findOpenKeysInSubPath(location.pathname, menuData);
    }

    setOpenKeys(oKeys);
  }, [location.pathname]);

  const onSubMenuClick = (sub) => {
    const oKeys = openKeys.includes(sub) ? [] : [sub];

    setOpenKeys(oKeys);
  };

  const menuProps = {
    ...(menuType === constants.MENU_TYPE_COLLAPSED || window.innerWidth < 1025
      ? { inlineCollapsed: true }
      : { openKeys }),
  };
  const menuClass =
    menuType === constants.MENU_TYPE_COLLAPSED || window.innerWidth < 1025
      ? "vertical"
      : "inline";

  return (
    <div className={`left-menu-wrapper main-navigation-${menuClass}`}>
      <Menu mode="inline" className="left-menu" {...menuProps}>
        {getMenu(menuData, 1, onSubMenuClick)}
      </Menu>
    </div>
  );
};

export const SideNavigation = withRouter(SideNavigationView);
