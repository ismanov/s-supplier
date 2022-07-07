import React from "react";

import AuthTyped from "../../molecules/typed";

import AuthParticles from "../../molecules/particles";

import "./styles.scss";

const Auth = (props) => {
  return (
    <>
      <AuthParticles />
      <div className="auth-wrapper">
        <div className="auth-wrapper__info">
          <div className="auth-wrapper__info_top">
            <span className="auth-wrapper__title">SMARTPOS </span>
            <AuthTyped />
          </div>
          <div className="auth-wrapper__info_bot">

          </div>
        </div>
        <div className="auth-wrapper__form">
          {props.children}
        </div>
      </div>
    </>
  )
};

export default Auth;