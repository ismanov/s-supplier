import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Link } from "react-router-dom";

import userEffector from "../../user/effector";

import { UserCompany } from "../../user/templates/user-company";
import { UserBranches } from "../../user/templates/user-branches";
import { CatalogMainProducts } from "../organisms/catalog-main-products";

const { store: userStore, effects: userEffects, events: userEvents } = userEffector;

export const CatalogMain = () => {
  const { $userCompanyInfo } = useStore(userStore);
  const { logo: companyLogo, name: companyName, businessType } = $userCompanyInfo.data;

  useEffect(() => {
    if ( !Object.keys($userCompanyInfo.data).length ) {
      userEffects.getUserCompanyInfoEffect();
    }
  }, []);

  return (
    <div className="catalog-main">
      <h1>Каталог</h1>
      <div className="catalog-main__title">
        <h2>
          {businessType ? businessType.nameRu : ""} “{companyName ? companyName : ""}”
        </h2>
        <Link to="/catalog/all">Посмотреть все товары</Link>
      </div>
      <div className="catalog-main__row">
        <div className="catalog-main__row__left">
          {companyLogo &&
          <div className="catalog-main__block">
            <div className="catalog-main__logo">
              <img src={companyLogo.path} alt="company-logo"/>
            </div>
          </div>
          }
          <div className="catalog-main__block">
            <UserCompany />
          </div>
          <div className="catalog-main__block">
            <UserBranches />
          </div>
        </div>
        <div className="catalog-main__row__right">
          {/*<CatalogMainProducts />*/}
        </div>
      </div>
    </div>
  )
};