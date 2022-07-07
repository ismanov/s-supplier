import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Button, Menu, Spin, Empty, Popconfirm, Popover } from "antd";

import effector from "../effector";

import { UpdateCategoryModal } from "./update-category-modal";
import { SettingsSvg } from "svgIcons/svg-icons";
import { UploadProductListModal } from "./upload-product-list-modal";

const { store, events, effects } = effector;

const { SubMenu } = Menu;

const menuData = (categories, search, deletedItems) => {
  if (!categories.length) return null;

  return (Array.isArray(categories) ? categories : []).map((item) => {
    return {
      id: item.id,
      deleted: deletedItems[item.id],
      name: item.name,
      count: item.productCount,
      search: search
        ? item.name.toLowerCase().includes(search.toLowerCase())
        : false,
      children: menuData(
        item.children ? item.children : [],
        search,
        deletedItems
      ),
    };
  });
};

const findInTree = (menu, val, parents = {}, res = {}) => {
  (Array.isArray(menu) ? menu : []).forEach((item) => {
    if (item.name.toLowerCase().includes(val.toLowerCase())) {
      const children = {};
      if (item.children) {
        item.children
          .map((child) => child.id)
          .forEach((id) => {
            children[id] = true;
          });
      }
      res = { ...res, [item.id]: true, ...parents, ...children };
    }
    if (item.children) {
      const subRes = findInTree(
        item.children,
        val,
        { [item.id]: true, ...parents },
        res
      );
      res = { ...res, ...subRes };
    }
  });

  return res;
};

const filterTree = (menu, res) => {
  return (Array.isArray(menu) ? menu : [])
    .filter((item) => {
      return !!res[item.id];
    })
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: filterTree(item.children, res),
        };
      }
    });
};

const getMenu = (menuParams) => {
  const {
    activeItem,
    onMenuTitleCLick,
    onMenuArrCLick,
    onAddSubCategory,
    onCategoryUpdate,
    downloadCategories,
    onCategoryUploadExcel,
    onCategoryDelete,
    menu,
    parents = [],
  } = menuParams;

  const actions = (category) => {
    return (
      <div>
        <div className="custom__popover__item">
          <div>
            <Button
              onClick={() => onAddSubCategory(category)}
              className="custom-button primary-button"
            >
              Добавить подкатегорию
            </Button>
          </div>
          <div>
            <Button
              onClick={() => onCategoryUpdate(category)}
              className="custom-button primary-button"
            >
              Редактировать
            </Button>
          </div>
          <div>
            <Button
              loading={downloadCategories.loading}
              onClick={() =>
                downloadCategories.onDownloadCategories(category.id)
              }
              className="custom-button primary-button"
            >
              Скачать шаблон
            </Button>
          </div>
          <div>
            <Button
              onClick={() => onCategoryUploadExcel(category.id)}
              className="custom-button primary-button"
            >
              Загрузить шаблон
            </Button>
          </div>
          {/* to do >>>>>>>> */}
          {/* <Popconfirm
            title="Вы уверены?"
            onConfirm={() => onCategoryDelete(category)}
            okText="Да"
            cancelText="Нет"
          >
            <Button type="danger">Удалить</Button>
          </Popconfirm> */}
        </div>
      </div>
    );
  };

  return menu.map((item) => {
    const menuItemClassName = item.deleted ? "hide-item" : "";

    const menuItem = (
      <div
        className={`categories-menu__item ${
          activeItem === item.id ? "active" : ""
        }`}
      >
        <div className="categories-menu__item__left">
          <div className="categories-menu__item__arr">
            {item.children && (
              <div
                className="categories-menu__item__arr-in"
                onClick={() => onMenuArrCLick(item.id, parents)}
              >
                <i className="ant-menu-submenu-arrow" />
              </div>
            )}
          </div>
          <div
            className="categories-menu__item__title"
            onClick={() => {
              window.scrollTo(0, 0);
              onMenuTitleCLick(item.id);
            }}
          >
            <span className={`c-item-name ${item.search ? "active" : ""}`}>
              <span>{item.name}</span>
            </span>
            <span className="c-item-count">{item.count}</span>
          </div>
        </div>
        <div className="categories-menu__item__right">
          {!item.deleted && (
            <Popover
              overlayClassName="custom__popover"
              placement="bottomRight"
              trigger="click"
              content={actions(item)}
            >
              <Button className="custom-button settings-button onlyicon b-r-30">
                <SettingsSvg />
              </Button>
            </Popover>
          )}
        </div>
      </div>
    );

    if (item.children) {
      return (
        <SubMenu className={menuItemClassName} key={item.id} title={menuItem}>
          {getMenu({
            ...menuParams,
            menu: item.children,
            parents: [...parents, item.id.toString()],
          })}
        </SubMenu>
      );
    }

    return (
      <Menu.Item className={menuItemClassName} key={item.id}>
        {menuItem}
      </Menu.Item>
    );
  });
};

export const Categories = () => {
  const $categories = useStore(store.$categories);
  const $categoriesFilterProps = useStore(store.$categoriesFilterProps);
  const $categoriesSearch = useStore(store.$categoriesSearch);
  const $addCategory = useStore(store.$addCategory);
  const $updateCategory = useStore(store.$updateCategory);
  const $addProduct = useStore(store.$addProduct);
  const $deleteProduct = useStore(store.$deleteProduct);
  const $downloadCategoriesExcel = useStore(store.$downloadCategoriesExcel);

  const { data: categoriesData, loading: categoriesLoading } = $categories;

  const [categories, setCategories] = useState(categoriesData);

  const [activeItem, setActiveItem] = useState(null);

  const [defaultOpenCategories, setDefaultOpenCategories] = useState({});

  const [deletedItems, setDeletedItems] = useState({});

  const [categoryEditProps, setCategoryEditProps] = useState({
    visible: false,
    shouldRender: false,
  });

  const [productListUploadModalProps, setProductListUploadModalProps] =
    useState({
      visible: false,
      shouldRender: false,
      categoryId: null,
    });

  useEffect(() => {
    return () => {
      events.resetCategoriesFilterPropsEvent();
      events.resetCategoriesEvent();
    };
  }, []);

  useEffect(() => {
    if (Object.keys($categoriesFilterProps).length) {
      effects.getCategoriesEffect($categoriesFilterProps);
      events.resetCategoriesSearchEvent();
    }
  }, [$categoriesFilterProps]);

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  useEffect(() => {
    if ($categoriesSearch !== null) {
      if ($categoriesSearch) {
        const res = findInTree(categoriesData, $categoriesSearch);
        const newTree = filterTree(categoriesData, res);

        setDefaultOpenCategories(res);
        setCategories(newTree);
      } else {
        setCategories(categoriesData);
        setDefaultOpenCategories({});
      }
    }
  }, [$categoriesSearch]);

  useEffect(() => {
    if (
      $addCategory.success ||
      $updateCategory.success ||
      $deleteProduct.success ||
      $addProduct.success
    ) {
      effects.getCategoriesEffect($categoriesFilterProps);
    }
  }, [
    $addCategory.success,
    $updateCategory.success,
    $deleteProduct.success,
    $addProduct.success,
  ]);

  useEffect(() => {
    if ($downloadCategoriesExcel.data) {
      const data = $downloadCategoriesExcel.data;
      const urlCreator = window.URL || window.webkitURL;
      const fileUrl = urlCreator.createObjectURL(data);
      window.open(fileUrl);
    }
  }, [$downloadCategoriesExcel.data]);

  const menuParams = {
    activeItem,
    onMenuTitleCLick: (id) => {
      if (activeItem !== id) {
        events.updateProductListFilterPropsEvent({
          page: 0,
          branchId: $categoriesFilterProps.branchId,
          categoryId: id,
        });

        setActiveItem(id);
      }
    },
    onMenuArrCLick: (id, parents) => {
      const newOpenKeys = { ...defaultOpenCategories };

      if (!defaultOpenCategories[id]) {
        parents.forEach((itemId) => {
          newOpenKeys[itemId] = true;
        });

        newOpenKeys[id] = true;
      } else {
        delete newOpenKeys[id];
      }

      setDefaultOpenCategories(newOpenKeys);
    },
    onAddSubCategory: (category) => {
      setCategoryEditProps({
        visible: true,
        shouldRender: true,
        category: null,
        parentCategory: category,
      });
    },
    onCategoryUpdate: (category) => {
      setCategoryEditProps({ visible: true, shouldRender: true, category });
    },
    downloadCategories: {
      onDownloadCategories: (categoryId) => {
        effects.downloadCategoriesExcelEffect({
          branchId: $categoriesFilterProps.branchId,
          categoryId,
        });
      },
      loading: $downloadCategoriesExcel.loading,
    },
    onCategoryUploadExcel: (categoryId) => {
      setProductListUploadModalProps({
        visible: true,
        shouldRender: true,
        categoryId,
      });
    },
    onCategoryDelete: (category) => {
      effects.deleteCategoryEffect({
        id: category.id,
        branchId: $categoriesFilterProps.branchId,
      });

      setDeletedItems({
        ...deletedItems,
        [category.id]: true,
      });
    },
    menu: menuData(categories, $categoriesSearch, deletedItems),
  };

  return (
    <div className="categories-menu-wrapper catalog__row">
      {categories.length ? (
        <Menu
          className="categories-menu"
          mode="inline"
          openKeys={Object.keys(defaultOpenCategories)}
        >
          {getMenu(menuParams)}
        </Menu>
      ) : (
        <div className="abs-loader">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      )}
      {categoriesLoading && (
        <div className="abs-loader">
          <Spin size="large" />
        </div>
      )}
      {categoryEditProps.shouldRender && (
        <UpdateCategoryModal
          modalProps={categoryEditProps}
          setModalProps={setCategoryEditProps}
        />
      )}
      {productListUploadModalProps.shouldRender && (
        <UploadProductListModal
          modalProps={productListUploadModalProps}
          setModalProps={setProductListUploadModalProps}
        />
      )}
    </div>
  );
};
