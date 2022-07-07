import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Menu, Spin, Empty, Checkbox } from "antd";

import effector from "../effector";

const { store, events, effects } = effector;

const { SubMenu } = Menu;

const checkAllSubcategories = (children, parents = []) => {
  if (!children || !children.length) return parents;

  return children.reduce(
    (acc, item) => {
      return checkAllSubcategories(item.sub, [...acc, item.id]);
    },
    [...parents]
  );
};

const getCheckedIds = (menu, parents = []) => {
  if (!menu || !menu.length) return parents;

  return (Array.isArray(menu) ? menu : []).reduce(
    (acc, item) => {
      if (item.enabled) {
        return getCheckedIds(item.children, [...acc, item.id]);
      }

      return getCheckedIds(item.children, [...acc]);
    },
    [...parents]
  );
};

const menuData = (categories) => {
  if (!categories.length) return [];

  return (Array.isArray(categories) ? categories : []).map((item) => {
    return {
      id: item.id,
      name: item.name,
      key: item.id,
      count: item.productCount,
      enabled: item.enabled,
      sub: menuData(item.children ? item.children : []),
    };
  });
};

const getMenu = (
  menu,
  onMenuItemCLick,
  onCategoryCheck,
  activeItem,
  selectedIds
) => {
  return menu.map((item) => {
    const menuItem = (
      <div
        className={`catalog-single-menu__item ${
          activeItem === item.key ? "active" : ""
        }`}
        onClick={() => onMenuItemCLick(item.key)}
      >
        <div className="catalog-single-menu__item__checkbox">
          <Checkbox
            checked={selectedIds.includes(item.id)}
            onClick={(e) => onCategoryCheck(e, item)}
          />
        </div>
        <div className="catalog-single-menu__item__title">
          {item.name}
          <i className="ant-menu-submenu-arrow" />
        </div>
        <div className="catalog-single-menu__item__right">
          <div className="c-item-count">{item.count}</div>
        </div>
      </div>
    );

    if (item.sub && item.sub.length) {
      return (
        <SubMenu key={item.key} title={menuItem}>
          {getMenu(
            item.sub,
            onMenuItemCLick,
            onCategoryCheck,
            activeItem,
            selectedIds
          )}
        </SubMenu>
      );
    }

    return <Menu.Item key={item.key}>{menuItem}</Menu.Item>;
  });
};

export const CatalogSingleList = () => {
  const $categoriesSingle = useStore(store.$categoriesSingle);
  const $categoriesSingleFilterProps = useStore(
    store.$categoriesSingleFilterProps
  );
  const $selectedCategoriesSingle = useStore(store.$selectedCategoriesSingle);
  const $saveCategoriesSingleToBranch = useStore(
    store.$saveCategoriesSingleToBranch
  );

  const [activeItem, setActiveItem] = useState("");

  const { data: categoriesSingleMenu, loading: categoriesSingleLoading } =
    $categoriesSingle;

  useEffect(() => {
    if (categoriesSingleMenu.length) {
      const checkedIds = getCheckedIds(categoriesSingleMenu);

      events.updateSelectedCategoriesSingleEvent(checkedIds);
    }
  }, [categoriesSingleMenu]);

  useEffect(() => {
    if (Object.keys($categoriesSingleFilterProps).length) {
      effects.getCategoriesSingleEffect($categoriesSingleFilterProps);
    }
  }, [$categoriesSingleFilterProps]);

  const onMenuItemCLick = (key) => {
    if (activeItem !== key) {
      setActiveItem(key);
    }
  };

  const onCategoryCheck = (event, item) => {
    event.stopPropagation();
    const subIds = [item.id, ...checkAllSubcategories(item.sub)];

    if (event.target.checked) {
      const checkedArr = [...$selectedCategoriesSingle, ...subIds];

      events.updateSelectedCategoriesSingleEvent(checkedArr);
    } else {
      const checkedArr2 = [...$selectedCategoriesSingle];

      subIds.forEach((c) => {
        if (checkedArr2.includes(c)) {
          const indexItem = checkedArr2.indexOf(c);
          checkedArr2.splice(indexItem, 1);
        }
      });

      events.updateSelectedCategoriesSingleEvent(checkedArr2);
    }
  };

  return (
    <div className="catalog-single-menu-wrapper">
      {categoriesSingleLoading || $saveCategoriesSingleToBranch.loading ? (
        <div className="abs-loader">
          <Spin size="large" />
        </div>
      ) : categoriesSingleMenu.length ? (
        <Menu className="catalog-single-menu" mode="inline">
          {getMenu(
            menuData(categoriesSingleMenu),
            onMenuItemCLick,
            onCategoryCheck,
            activeItem,
            $selectedCategoriesSingle
          )}
        </Menu>
      ) : (
        <div className="abs-loader">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      )}
    </div>
  );
};
