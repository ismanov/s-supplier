import React, { useState } from "react";
import { Button } from "antd";

import { LikeSvg } from "svgIcons/svg-icons";

const LikeButton = (props) => {
  const [ active, setActive ] = useState(!!props.isLiked);

  const onLikedProduct = () => {
    setActive(!active);
  };

  return (
    <Button
      htmlType="submit"
      className={`custom-button onlyicon like-button b-r-4${active ? " active": ""}`}
      onClick={onLikedProduct}
    >
      <LikeSvg />
    </Button>
  )
};

export const CatalogMainProducts = () => {
  return (
    <div className="catalog-main__products">
      <div className="catalog-main__products__col">
        <div className="catalog-main__products__item">
          <div className="catalog-main__products__item-pic">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/1200px-Coca-Cola_logo.svg.png" alt=""/>
            <LikeButton />
          </div>
          <div className="catalog-main__products__item-info">
            <div className="catalog-main__products__item-info-title">
              Название товара, полность, возможно в 2 строки
            </div>
            <ul>
              <li>Минимальный заказ: 10шт</li>
              <li>Доставка: Включена в стоимость</li>
              <li>Самовывоз: Есть</li>
              <li>Есть срочная доставка</li>
            </ul>
            <div className="catalog-main__products__item-info-price">
              26 000 сум/шт
            </div>
          </div>
        </div>
      </div>
      <div className="catalog-main__products__col">
        <div className="catalog-main__products__item">
          <div className="catalog-main__products__item-pic">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/1200px-Coca-Cola_logo.svg.png" alt=""/>
            <LikeButton isLiked={true} />
          </div>
          <div className="catalog-main__products__item-info">
            <div className="catalog-main__products__item-info-title">
              Название товара, полность, возможно в 2 строки
            </div>
            <ul>
              <li>Минимальный заказ: 10шт</li>
              <li>Доставка: Включена в стоимость</li>
              <li>Самовывоз: Есть</li>
              <li>Есть срочная доставка</li>
            </ul>
            <div className="catalog-main__products__item-info-price">
              26 000 сум/шт
            </div>
          </div>
        </div>
      </div>
      <div className="catalog-main__products__col">
        <div className="catalog-main__products__item">
          <div className="catalog-main__products__item-pic">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/1200px-Coca-Cola_logo.svg.png" alt=""/>
            <LikeButton isLiked={true} />
          </div>
          <div className="catalog-main__products__item-info">
            <div className="catalog-main__products__item-info-title">
              Название товара, полность, возможно в 2 строки
            </div>
            <ul>
              <li>Минимальный заказ: 10шт</li>
              <li>Доставка: Включена в стоимость</li>
              <li>Самовывоз: Есть</li>
              <li>Есть срочная доставка</li>
            </ul>
            <div className="catalog-main__products__item-info-price">
              26 000 сум/шт
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};