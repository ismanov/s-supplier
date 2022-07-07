import React from "react";

import { UserLogo } from "../templates/user-logo";
import { UserDetails } from "../templates/user-details";
import { UserSecurity } from "../templates/user-security";
import { UserCompany } from "../templates/user-company";
import { UserBranches } from "../templates/user-branches";
import { UserEntitys } from "../templates/user-entitys";
import { UserCompanyBank } from "../templates/user-company-bank";
import { UserAggregation } from "../templates/user-aggregation-data";
// import {UserWarehouses} from "../templates/user-warehouses";

import "../styles.scss";

export const UserInfo = () => {
  return (
    <div className="user-cabinet">
      <div className="user-cabinet__left">
        <div className="user-cabinet__logo user-block">
          <UserLogo />
        </div>
        <div className="user-cabinet__data user-block">
          <UserDetails />
        </div>
        <div className="user-cabinet__security user-block">
          <UserSecurity />
        </div>
      </div>
      <div className="user-cabinet__middle">
        <div className="user-cabinet__company user-block">
          <UserCompany />
        </div>
        <div className="user-cabinet__bank user-block">
          <UserCompanyBank />
        </div>
        <div className="user-cabinet__bank user-block">
          <UserAggregation />
        </div>
      </div>
      <div className="user-cabinet__right">
        <div className="user-cabinet__branch user-block">
          <UserBranches />
        </div>
        {/*<div className="user-cabinet__branch user-block">*/}
        {/*  <UserWarehouses />*/}
        {/*</div>*/}
        <UserEntitys />
      </div>
    </div>
  );
};