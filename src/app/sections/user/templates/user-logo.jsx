import React, { useEffect } from "react";
import { useStore } from "effector-react";
import {Popconfirm, Spin, Upload, message, Button} from "antd";

import effector from "../effector";

import { TrashSvg } from "svgIcons/svg-icons";

const { store, events, effects } = effector;

export const UserLogo = () => {
  const { $userCompanyInfo, $uploadUserCompanyLogo, $deleteUserCompanyLogo } = useStore(store);
  const { logo: companyLogo } = $userCompanyInfo.data;

  const { loading: deleteLoading } = $deleteUserCompanyLogo;
  const { loading: uploadLoading } = $uploadUserCompanyLogo;

  useEffect(() => {
    if ($uploadUserCompanyLogo.success) {
      events.resetUploadUserCompanyLogoEvent();
    }

    if ($deleteUserCompanyLogo.success) {
      events.resetDeleteUserCompanyLogoEvent();
    }
  }, [$uploadUserCompanyLogo, $deleteUserCompanyLogo]);

  const beforeAvatarUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Можно загрузить только JPG/PNG файлы!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Слишком большой размер изображения!');
      return false;
    }

    const data = new FormData();
    data.append('file', file);

    effects.uploadUserCompanyLogoEffect({ file: data });

    return false;
  };

  const onDeletePicture = () => {
    effects.deleteUserCompanyLogoEffect();
  };

  const logoRender = () => {
    let logo;

    if (companyLogo) {
      logo = (
        deleteLoading ?
          <>
            <div className="user-cabinet__title">
              <span></span>
            </div>
            <div className="user-cabinet__logo__pic">
              <div className="abs-loader">
                <Spin size="large"/>
              </div>
            </div>
          </>
        :
        <>
          <div className="user-cabinet__title">
            <span></span>
            <Popconfirm
              title="Вы уверены что хотите удалить лого?"
              onConfirm={onDeletePicture}
              okText="Да"
              cancelText="Нет"
            >
              <Button className="custom-button trash-button onlyicon b-r-30">
                <TrashSvg />
              </Button>
            </Popconfirm>
          </div>
          <div className="user-cabinet__logo__pic">
            <img src={companyLogo.path} alt="company-logo" />
          </div>
        </>
      );
    } else {
      logo = (
        <Upload
          name="file"
          listType="picture-card"
          className="avatar-uploader"
          accept="image/png, image/jpeg"
          showUploadList={false}
          beforeUpload={beforeAvatarUpload}
        >
          {uploadLoading ? <div>
              <Spin />
              <div className="ant-upload-text">Лого</div>
            </div>
            :
            <div>
              <div className="ant-upload-text">Лого</div>
              +
            </div>
          }
        </Upload>
      );
    }

    return logo;
  };

  return (
   <>
     {
       logoRender()
     }
   </>
  )
};