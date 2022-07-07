import { Button, Checkbox, Col, Form, Row } from "antd";
import React, { useState, useEffect } from "react";
import { FormField } from "ui/molecules/form-field";
import bottomArrow from "../../../../assets/images/bottom-arrow.gif";

export const Offer = () => {
  const [accept, setAccept] = useState();
  const [scrolled, setScrolled] = useState(false);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  useEffect(() => {
    document.querySelector("#documentIFrame").addEventListener("load", (e) => {
      e.target.contentWindow.addEventListener("scroll", (event) => {
        if (!scrolled) setScrolled(true);
        if (
          event.srcElement.scrollingElement.scrollHeight * 0.9 <
          event.srcElement.scrollingElement.scrollTop
        ) {
          setScrolledToEnd(true);
        }
      });
    });
  }, []);
  const onSubmit = () => {};
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <img
        src={bottomArrow}
        style={{
          position: "absolute",
          left: "47vw",
          top: "70vh",
          width: "6vw",
          display: scrolled ? "none" : "block",
        }}
      />
      <Form
        style={{
          width: "70vw",
          display: "flex",
          flexDirection: "column",
        }}
        onFinish={onSubmit}
      >
        <iframe
          width="100%"
          height="800px"
          style={{
            borderBottom: "grey 1px solid",
          }}
          id="documentIFrame"
          srcDoc={offerHtml}
        />
        <Row style={{ marginLeft: 60 }}>
          <FormField className="m-t-20  m-b-20">
            <Checkbox
              className="custom-checkbox-2"
              onChange={(e) => setAccept(e.target.checked)}
              checked={accept}
              disabled={!scrolledToEnd}
            >
              Принимаю публичную оферту
            </Checkbox>
          </FormField>
        </Row>
        <Row justify="space-between" className="m-l-20" gutter={[24, 0]}>
          <Col style={{ marginLeft: 60 }} span={12}>
            <Button className="full-width" type="ghost" size="large">
              Отмена
            </Button>
          </Col>
          <Col span={4} align="flex-end">
            <Button
              className="full-width"
              type="primary"
              size="large"
              htmlType="submit"
              disabled={!accept}
            >
              Принять
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

const offerHtml = `
<!doctype html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <style>
    body {
        overflow: hidden;
        }
        html {
          overflow:   scroll;
        }
        ::-webkit-scrollbar {
            width: 0px;
            background: transparent; /* make scrollbar transparent */
        }
        .container {
            max-width: 1200px;
            margin: 0 auto
        }

        .text-left {
            text-align: left
        }

        .text-center {
            text-align: center
        }

        .text-right {
            text-align: right
        }

        body {
            line-height: 20px;
            font-size: 16px
        }

        table {
            border-collapse: collapse
        }

        .table {
            width: 100%;
            margin-bottom: 1rem;
            color: #212529
        }

        .table td, .table th {
            padding: .75rem;
            vertical-align: top;
            border-top: 1px solid #dee2e6
        }

        .table thead th {
            vertical-align: bottom;
            border-bottom: 2px solid #dee2e6
        }

        .table tbody + tbody {
            border-top: 2px solid #dee2e6
        }

        .table-sm td, .table-sm th {
            padding: .3rem
        }

        .table-bordered {
            border: 1px solid #dee2e6
        }

        .table-bordered td, .table-bordered th {
            border: 1px solid #dee2e6
        }

        .table-bordered thead td, .table-bordered thead th {
            border-bottom-width: 2px
        }

        .table-borderless tbody + tbody, .table-borderless td, .table-borderless th, .table-borderless thead th {
            border: 0
        }

        .table-striped tbody tr:nth-of-type(odd) {
            background-color: rgba(0, 0, 0, .05)
        }

        .table-hover tbody tr:hover {
            color: #212529;
            background-color: rgba(0, 0, 0, .075)
        }

        .table-primary, .table-primary > td, .table-primary > th {
            background-color: #b8daff
        }

        .table-primary tbody + tbody, .table-primary td, .table-primary th, .table-primary thead th {
            border-color: #7abaff
        }

        .table-hover .table-primary:hover {
            background-color: #9fcdff
        }

        .table-hover .table-primary:hover > td, .table-hover .table-primary:hover > th {
            background-color: #9fcdff
        }

        .table-secondary, .table-secondary > td, .table-secondary > th {
            background-color: #d6d8db
        }

        .table-secondary tbody + tbody, .table-secondary td, .table-secondary th, .table-secondary thead th {
            border-color: #b3b7bb
        }

        .table-hover .table-secondary:hover {
            background-color: #c8cbcf
        }

        .table-hover .table-secondary:hover > td, .table-hover .table-secondary:hover > th {
            background-color: #c8cbcf
        }

        .table-success, .table-success > td, .table-success > th {
            background-color: #c3e6cb
        }

        .table-success tbody + tbody, .table-success td, .table-success th, .table-success thead th {
            border-color: #8fd19e
        }

        .table-hover .table-success:hover {
            background-color: #b1dfbb
        }

        .table-hover .table-success:hover > td, .table-hover .table-success:hover > th {
            background-color: #b1dfbb
        }

        .table-info, .table-info > td, .table-info > th {
            background-color: #bee5eb
        }

        .table-info tbody + tbody, .table-info td, .table-info th, .table-info thead th {
            border-color: #86cfda
        }

        .table-hover .table-info:hover {
            background-color: #abdde5
        }

        .table-hover .table-info:hover > td, .table-hover .table-info:hover > th {
            background-color: #abdde5
        }

        .table-warning, .table-warning > td, .table-warning > th {
            background-color: #ffeeba
        }

        .table-warning tbody + tbody, .table-warning td, .table-warning th, .table-warning thead th {
            border-color: #ffdf7e
        }

        .table-hover .table-warning:hover {
            background-color: #ffe8a1
        }

        .table-hover .table-warning:hover > td, .table-hover .table-warning:hover > th {
            background-color: #ffe8a1
        }

        .table-danger, .table-danger > td, .table-danger > th {
            background-color: #f5c6cb
        }

        .table-danger tbody + tbody, .table-danger td, .table-danger th, .table-danger thead th {
            border-color: #ed969e
        }

        .table-hover .table-danger:hover {
            background-color: #f1b0b7
        }

        .table-hover .table-danger:hover > td, .table-hover .table-danger:hover > th {
            background-color: #f1b0b7
        }

        .table-light, .table-light > td, .table-light > th {
            background-color: #fdfdfe
        }

        .table-light tbody + tbody, .table-light td, .table-light th, .table-light thead th {
            border-color: #fbfcfc
        }

        .table-hover .table-light:hover {
            background-color: #ececf6
        }

        .table-hover .table-light:hover > td, .table-hover .table-light:hover > th {
            background-color: #ececf6
        }

        .table-dark, .table-dark > td, .table-dark > th {
            background-color: #c6c8ca
        }

        .table-dark tbody + tbody, .table-dark td, .table-dark th, .table-dark thead th {
            border-color: #95999c
        }

        .table-hover .table-dark:hover {
            background-color: #b9bbbe
        }

        .table-hover .table-dark:hover > td, .table-hover .table-dark:hover > th {
            background-color: #b9bbbe
        }

        .table-active, .table-active > td, .table-active > th {
            background-color: rgba(0, 0, 0, .075)
        }

        .table-hover .table-active:hover {
            background-color: rgba(0, 0, 0, .075)
        }

        .table-hover .table-active:hover > td, .table-hover .table-active:hover > th {
            background-color: rgba(0, 0, 0, .075)
        }

        .table .thead-dark th {
            color: #fff;
            background-color: #343a40;
            border-color: #454d55
        }

        .table .thead-light th {
            color: #495057;
            background-color: #e9ecef;
            border-color: #dee2e6
        }

        .table-dark {
            color: #fff;
            background-color: #343a40
        }

        .table-dark td, .table-dark th, .table-dark thead th {
            border-color: #454d55
        }

        .table-dark.table-bordered {
            border: 0
        }

        .table-dark.table-striped tbody tr:nth-of-type(odd) {
            background-color: rgba(255, 255, 255, .05)
        }

        .table-dark.table-hover tbody tr:hover {
            color: #fff;
            background-color: rgba(255, 255, 255, .075)
        }

        @media (max-width: 575.98px) {
            .table-responsive-sm {
                display: block;
                width: 100%;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch
            }

            .table-responsive-sm > .table-bordered {
                border: 0
            }
        }

        @media (max-width: 767.98px) {
            .table-responsive-md {
                display: block;
                width: 100%;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch
            }

            .table-responsive-md > .table-bordered {
                border: 0
            }
        }

        @media (max-width: 991.98px) {
            .table-responsive-lg {
                display: block;
                width: 100%;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch
            }

            .table-responsive-lg > .table-bordered {
                border: 0
            }
        }

        @media (max-width: 1199.98px) {
            .table-responsive-xl {
                display: block;
                width: 100%;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch
            }

            .table-responsive-xl > .table-bordered {
                border: 0
            }
        }

        .table-responsive {
            display: block;
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch
        }

        .table-responsive > .table-bordered {
            border: 0
        }

        @media print {
            *, ::after, ::before {
                text-shadow: none !important;
                box-shadow: none !important
            }

            a:not(.btn) {
                text-decoration: underline
            }

            abbr[title]::after {
                content: " (" attr(title) ")"
            }

            pre {
                white-space: pre-wrap !important
            }

            blockquote, pre {
                border: 1px solid #adb5bd;
                page-break-inside: avoid
            }

            thead {
                display: table-header-group
            }

            img, tr {
                page-break-inside: avoid
            }

            h2, h3, p {
                orphans: 3;
                widows: 3
            }

            h2, h3 {
                page-break-after: avoid
            }

            @page {
                size: a3
            }

            body {
                min-width: 992px !important
            }

            .container {
                min-width: 992px !important
            }

            .navbar {
                display: none
            }

            .badge {
                border: 1px solid #000
            }

            .table {
                border-collapse: collapse !important
            }

            .table td, .table th {
                background-color: #fff !important
            }

            .table-bordered td, .table-bordered th {
                border: 1px solid #dee2e6 !important
            }

            .table-dark {
                color: inherit
            }

            .table-dark tbody + tbody, .table-dark td, .table-dark th, .table-dark thead th {
                border-color: #dee2e6
            }

            .table .thead-dark th {
                color: inherit;
                border-color: #dee2e6
            }
        }

        .d-flex {
            display: flex !important
        }

        .justify-content-center {
            justify-content: center !important
        }

        .justify-content-between {
            justify-content: space-between !important
        }

        .w-100 {
            width: 100% !important
        }

        .col-12 {
            width: 100%
        }
    </style>
    <style>
        .text-center {
            text-align: center
        }

        body {
            font-size: 16px;
            letter-spacing: 1px;
            margin: 0
        }

        h1, h2, h3, h4, h5, h6 {
            color: #00bfda
        }

        strong {
            display: inline
        }

        ul {
            list-style-type: none;
            padding: 0;
            margin: 0
        }

        ul li {
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            margin-bottom: 15px
        }

        ul li.with-ol {
            padding-left: 15px
        }

        ul li.with-ol ol li {
            display: list-item;
            list-style-position: inside
        }

        ul li ul {
            padding-left: 15px
        }

        ul li span {
            padding-right: 20px
        }

        .first-section {
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -webkit-flex-direction: column;
            -ms-flex-direction: column;
            flex-direction: column;
            -webkit-box-align: center;
            -webkit-align-items: center;
            -ms-flex-align: center;
            align-items: center;
            margin-bottom: 20px;
            background-color: #00bfda;
            color: #fff;
            -webkit-box-flex: 1;
            -webkit-flex: 1;
            -ms-flex: 1;
            flex: 1
        }

        .first-section .logo {
            margin-top: 30px;
            margin-bottom: auto;
            -webkit-box-pack: end;
            -webkit-justify-content: flex-end;
            -ms-flex-pack: end;
            justify-content: flex-end;
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-flex: 1;
            -webkit-flex: 1;
            -ms-flex: 1;
            flex: 1
        }

        .first-section .center-content {
            margin-top: auto;
            margin-bottom: auto;
            -webkit-box-flex: 10;
            -webkit-flex: 10;
            -ms-flex: 10;
            flex: 10;
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -webkit-align-items: center;
            -ms-flex-align: center;
            align-items: center
        }

        .first-section h1, .first-section h2, .first-section h3, .first-section h4, .first-section h5, .first-section h6 {
            color: #fff
        }

        .first-section .pattern-block {
            margin-top: auto;
            margin-bottom: 0;
            background-color: #fff;
            height: 60px;
            width: 100%;
            background-size: contain;
            -webkit-box-flex: 1;
            -webkit-flex: 1;
            -ms-flex: 1;
            flex: 1
        }

        .smartpos-offer .first-section {
            -webkit-box-align: center;
            -webkit-align-items: center;
            -ms-flex-align: center;
            align-items: center;
            background-color: #fff;
            color: #000
        }

        .smartpos-offer ul {
            list-style-type: disc !important
        }

        .smartpos-offer ul li {
            display: list-item
        }

        .smartpos-offer h1, .smartpos-offer h2, .smartpos-offer h3, .smartpos-offer h4, .smartpos-offer h5, .smartpos-offer h6 {
            color: #000
        }

        .smartpos-offer .heading {
            text-align: center
        }

        .smartpos-offer .heading h1 {
            font-size: 40px
        }

        .smartpos-offer .logo {
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -webkit-justify-content: center;
            -ms-flex-pack: center;
            justify-content: center;
            margin-bottom: 60px
        }

        .smartpos-offer .accept-date {
            margin-top: 60px;
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: justify;
            -webkit-justify-content: space-between;
            -ms-flex-pack: justify;
            justify-content: space-between
        }

        .smartpos-offer .child-list {
            margin-top: 20px
        }

        .additional-offer {
            margin-top: 30px
        }

        .additional-offer p {
            max-width: 60%;
            margin: 0 auto
        }

        h2 {
            margin-top: 30px;
            margin-bottom: 30px
        }

        .table td, .table th {
            vertical-align: middle !important
        }import { FormField } from './../../../ui/molecules/form-field';
import { FormField } from 'ui/molecules/form-field';
import { FormField } from 'ui/molecules/form-field';
import { FormField } from 'ui/molecules/form-field';
import { FormField } from 'ui/molecules/form-field';
import { FormField } from 'ui/molecules/form-field';
import { FormField } from 'ui/molecules/form-field';
import { FormField } from 'ui/molecules/form-field';


        @media screen and (max-width: 767px) {
            .smartpos-offer h2 {
                font-size: 20px
            }
        }
    </style>
    <title>Smartpos</title>
</head>
<body class="smartpos-offer">
<div class="first-section text-center">
    <div class="container center-content">
        <div class="row d-flex justify-content-center no-gutters">
            <div class="col-12 col-lg-6 p-0">
                <div class="logo" style="max-width:215px;margin-left:auto;margin-right:auto;">
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                         xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                         viewBox="0 0 927 162" style="enable-background:new 0 0 927 162;" xml:space="preserve">
<style type="text/css">
	.st0 {
        fill: url(#SVGID_1_);
    }

    .st1 {
        fill: url(#SVGID_00000170250702324498381530000007507194088691901874_);
    }

    .st2 {
        fill: url(#SVGID_00000052804949154607059050000010643760211226073779_);
    }

    .st3 {
        fill: url(#SVGID_00000016063752928327631650000010733842218176527243_);
    }
</style>
                        <path d="M310.4,18h46.9c2.6,19.2,5.3,38.4,7.9,57.5h0.6c2.6-19.1,5.1-38.3,7.7-57.5h46.8v58.7h-25V19.2l-0.5-0.1
	c-0.1,0.4-0.2,0.8-0.3,1.2c-2.9,18.3-5.8,36.6-8.7,54.9c-0.1,0.9-0.2,1.6-1.5,1.6c-12.7-0.1-25.4,0-38.1,0c-0.3,0-0.6,0-1.1-0.1
	c-3-19.2-6.1-38.4-9.1-57.6l-0.5,0v57.5h-25.1L310.4,18z"/>
                        <path d="M802.3,78.1c-8.1,0.4-16.1-0.6-23.8-3c-7.9-2.5-14.8-6.7-19.3-13.9c-3.1-5.1-4-10.8-3.3-16.6c1.2-11,7.5-18.3,17.3-22.8
	c11.5-5.2,23.8-5.6,36.2-5c6,0.3,11.9,1.3,17.6,3.2c7.2,2.4,13.5,6.2,17.7,12.8c4.2,6.7,5.1,14,3.4,21.7
	c-1.7,7.3-6.2,12.4-12.4,16.2c-8.2,5.1-17.4,6.8-26.9,7.4C806.5,78.2,804.4,78.1,802.3,78.1z M801.4,60.2c6.9,0,10.4-0.7,14.4-2.9
	c2.4-1.3,4.3-3.4,5.3-6s0.9-5.4-0.1-8c-1.5-3.9-4.4-5.9-8.1-7.1c-6.4-2.1-12.9-2-19.4-0.6c-3.4,0.7-6.6,2.1-8.7,5
	c-4.3,5.7-2.4,13.5,3.9,16.9C792.9,59.7,797.5,60.2,801.4,60.2z"/>
                        <path d="M517.4,76.8c-0.6,0-1,0.1-1.5,0.1c-8.2,0-16.4,0-24.6,0c-1.3,0-1.9-0.5-2.3-1.7c-0.7-2.5-1.6-4.9-2.4-7.4
	c-0.3-1.1-0.8-1.5-1.9-1.5c-9.5,0-18.9,0-28.4,0c-1.2,0-1.8,0.4-2.1,1.5c-0.8,2.6-1.7,5.2-2.5,7.9c-0.2,0.8-0.6,1.2-1.5,1.2
	c-8.6,0-17.3,0-25.9,0c-0.3,0-0.6-0.1-0.8-0.2c0.7-1.9,1.3-3.7,2-5.5c6.5-17.2,12.9-34.5,19.4-51.7c0.1-0.5,0.4-0.9,0.8-1.2
	c0.4-0.3,0.9-0.4,1.4-0.4c15.5,0,31.1,0,46.6,0c0.5-0.1,0.9,0,1.3,0.3s0.7,0.6,0.8,1.1c7.1,18.8,14.2,37.7,21.2,56.5
	C517.2,76,517.3,76.3,517.4,76.8z M480.6,49.5c-3.4-10.2-6.6-20.1-9.9-30h-0.5c-3.3,10-6.6,20-9.9,30.1L480.6,49.5z"/>
                        <path d="M581.8,57.5l16.3,19.3c-0.7,0.1-1.2,0.1-1.7,0.1c-8.2,0-16.4,0-24.7,0c-0.6,0-1.3-0.1-1.8-0.4c-0.6-0.3-1.1-0.7-1.4-1.2
	c-6.9-8.2-13.9-16.4-20.9-24.6c-0.3-0.4-0.7-0.7-1.3-1.4v27.4h-25.7V20c0-2.1,0-2.1,2-2.1c14,0,28-0.1,42,0.1
	c7.4,0.1,14.6,1.3,21.2,4.9c7,3.8,10.9,9.5,10.4,17.7c-0.3,6.4-3.7,11-9.1,14.2C585.5,55.8,583.7,56.5,581.8,57.5z M546.2,46.7
	c5.5,0,10.7,0,16,0c1.1-0.1,2.3-0.3,3.3-0.8c0.9-0.3,1.8-0.8,2.4-1.5c0.7-0.7,1.2-1.5,1.4-2.5c1.1-4-1.2-7.7-5.6-8.1
	c-5.5-0.5-11-0.3-16.5-0.4c-0.3,0-0.9,0.5-1,0.8C546.2,38.4,546.2,42.5,546.2,46.7z"/>
                        <path d="M233.3,56.7c4.8,0.9,9.4,2,14,2.6c9,1.3,18.1,2.1,27.2,1.2c0.9,0,1.7-0.3,2.5-0.6c0.7-0.4,1.6-1.1,1.8-1.8
	c0.3-1.1-0.8-1.8-1.8-2c-2.6-0.6-5.2-1.1-7.8-1.5c-8.8-1.2-17.7-2.1-26-5.4c-2.9-1.1-5.6-2.6-7.6-5c-5-5.8-4-15,2.1-19.7
	c4.3-3.4,9.3-5.2,14.6-6.4c6.2-1.3,12.6-1.9,18.9-1.7c6.9,0.1,13.7,0.4,20.5,1.6c2.7,0.5,5.3,1.2,7.9,1.7c1.1,0.2,1.5,0.6,1.4,1.9
	c-0.6,5.2-1,10.3-1.4,15.5c-0.1,0.4-0.1,0.7-0.3,1c-1.6-0.4-3.2-0.8-4.7-1.2c-9.7-2.7-19.6-3.3-29.5-3c-1.4,0.1-2.8,0.3-4.1,0.7
	c-1.1,0.3-1.9,0.9-1.9,2.1c0,1.2,1.1,1.7,2.1,2c2.4,0.6,4.8,1,7.2,1.4c7.3,1.3,14.6,2.3,21.8,3.8c3.9,0.8,7.7,2.4,10.9,4.9
	c3.7,2.8,5,6.6,4.7,11.1c-0.5,7.8-5.6,11.9-12.2,14.6c-6.7,2.7-13.8,3.6-20.9,3.6c-8.2,0-16.3-0.3-24.5-1c-5-0.4-10-1.9-14.9-2.9
	c-0.5-0.1-1.2-0.8-1.2-1.2C232.4,67.6,232.8,62.1,233.3,56.7z"/>
                        <path d="M921.6,20.2c-0.6,6.1-1.1,12-1.7,18.1c-1.7-0.4-3.4-0.8-5-1.3c-9.7-2.6-19.6-3.2-29.5-2.9c-1.5,0.1-2.9,0.4-4.2,0.9
	c-0.4,0.2-0.7,0.4-1,0.8c-0.3,0.3-0.4,0.7-0.5,1.1c0.1,0.4,0.3,0.8,0.5,1.1c0.3,0.3,0.6,0.6,1,0.7c2.5,0.7,5.1,1.2,7.7,1.6
	c7.3,1.3,14.6,2.4,21.8,3.8c3.8,0.8,7.5,2.4,10.6,4.7c4.4,3.2,6,8.8,4.5,14.4c-1.4,5.1-5,8.3-9.5,10.5c-7.3,3.5-15.1,4.6-23.1,4.6
	c-8.2,0-16.4-0.3-24.6-1c-5-0.4-10-1.9-14.9-3c-0.5-0.1-1.2-0.9-1.1-1.3c0.4-5.4,0.8-10.8,1.3-16.1c0-0.1,0.1-0.2,0.2-0.4
	c1.5,0.4,3,0.9,4.6,1.2c10.6,2.3,21.4,3.4,32.2,3.1c2.2-0.2,4.4-0.5,6.6-0.9c0.5,0,1-0.2,1.3-0.6c0.3-0.4,0.5-0.8,0.6-1.3
	c0-1.2-0.9-1.7-1.9-2c-2.4-0.6-4.8-1-7.2-1.4c-7.4-0.9-14.8-1.8-21.9-3.8c-4-1.1-7.8-2.5-11-5.3c-1.5-1.3-2.6-3-3.4-4.8
	c-0.8-1.8-1.1-3.8-1-5.8c0.1-2,0.6-3.9,1.5-5.7c0.9-1.8,2.2-3.3,3.7-4.6c4.4-3.4,9.4-5.2,14.7-6.4c6.2-1.3,12.6-1.9,18.9-1.7
	c6.9,0.1,13.7,0.4,20.5,1.6C915.3,18.7,918.4,19.5,921.6,20.2z"/>
                        <path d="M702.2,61.1v15.6h-25.6c0-0.6-0.1-1.3-0.1-1.8c0-18.4,0-36.7,0-55c0-2,0-2,2.1-2c14.3,0,28.6-0.1,42.9,0.1
	c6.9,0.1,13.6,1,19.9,4c5.7,2.7,10,6.8,11.2,13.3c1.8,9.8-2,17.7-11.1,21.8c-5.9,2.7-12.2,3.6-18.7,3.8c-6.2,0.2-12.5,0.2-18.7,0.3
	H702.2z M702.2,46.1c5.9,0,11.5,0,17.2,0c1.1-0.1,2.3-0.4,3.3-0.9c2.2-0.8,3.6-2.4,3.7-4.9c0.1-2.5-0.8-4.6-3.3-5.6
	c-1.3-0.6-2.6-1-4-1.1c-5.3-0.2-10.6-0.2-15.9-0.2c-0.2,0-0.4,0.1-0.6,0.3c-0.2,0.1-0.3,0.3-0.4,0.5
	C702.2,38.3,702.2,42.1,702.2,46.1L702.2,46.1z"/>
                        <path d="M599.3,17.9h1.9c23.2,0,46.5,0,69.7,0c1.6,0,1.9,0.5,1.9,1.9c-0.1,4.8-0.1,9.7,0,14.5c0,1.4-0.4,1.8-1.8,1.8
	c-6.9-0.1-13.7,0-20.6,0h-1.7v40.7h-25.6V36h-1.8c-6.8,0-13.5,0-20.3,0c-1.4,0-1.8-0.4-1.7-1.8C599.4,28.9,599.3,23.5,599.3,17.9z"
                        />
                        <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="102.0001" y1="161.1281"
                                        x2="102.0001" y2="-25.4242" gradientTransform="matrix(1 0 0 -1 0 161.8898)">
	<stop offset="1.000000e-04" style="stop-color:#874FFF"/>
                            <stop offset="0.1667" style="stop-color:#5B1EDE"/>
                            <stop offset="1" style="stop-color:#2F1A44"/>
</linearGradient>
                        <path class="st0"
                              d="M97.8,7.4c2-3.1,6.5-3.1,8.4,0l92.9,146.1c2.1,3.3-0.3,7.7-4.2,7.7H9.1c-3.9,0-6.3-4.4-4.2-7.7L97.8,7.4z"/>
                        <linearGradient id="SVGID_00000067232693731010246510000015867387129932818365_"
                                        gradientUnits="userSpaceOnUse" x1="101.9994" y1="115.4972" x2="102.0004"
                                        y2="-17.9772" gradientTransform="matrix(1 0 0 -1 0 161.8898)">
	<stop offset="0" style="stop-color:#7443FF"/>
                            <stop offset="0.276" style="stop-color:#7000FF;stop-opacity:0.57"/>
                            <stop offset="1" style="stop-color:#6100FF;stop-opacity:0"/>
</linearGradient>
                        <path style="fill:url(#SVGID_00000067232693731010246510000015867387129932818365_);" d="M97.8,53c2-3.1,6.5-3.1,8.4,0l64,100.4
	c2.1,3.3-0.3,7.7-4.2,7.7H38c-3.9,0-6.3-4.4-4.2-7.7L97.8,53z"/>
                        <linearGradient id="SVGID_00000170990956271399752880000017480469665413816229_"
                                        gradientUnits="userSpaceOnUse" x1="102.0001" y1="68.5226" x2="102.0001"
                                        y2="-10.3132" gradientTransform="matrix(1 0 0 -1 0 161.8898)">
	<stop offset="0" style="stop-color:#7443FF"/>
                            <stop offset="0.276" style="stop-color:#7000FF;stop-opacity:0.57"/>
                            <stop offset="1" style="stop-color:#6100FF;stop-opacity:0"/>
</linearGradient>
                        <path style="fill:url(#SVGID_00000170990956271399752880000017480469665413816229_);" d="M97.8,100c2-3.1,6.5-3.1,8.4,0l33.9,53.4
	c2.1,3.3-0.3,7.7-4.2,7.7H68.1c-3.9,0-6.3-4.3-4.2-7.7L97.8,100z"/>
                        <linearGradient id="SVGID_00000146484022199083761380000007435523529696278921_"
                                        gradientUnits="userSpaceOnUse" x1="101.9995" y1="32.2858" x2="101.9995"
                                        y2="-4.4002" gradientTransform="matrix(1 0 0 -1 0 161.8898)">
	<stop offset="0" style="stop-color:#7443FF"/>
                            <stop offset="0.276" style="stop-color:#7000FF;stop-opacity:0.57"/>
                            <stop offset="1" style="stop-color:#6100FF;stop-opacity:0"/>
</linearGradient>
                        <path style="fill:url(#SVGID_00000146484022199083761380000007435523529696278921_);" d="M97.7,136.5c2-3.2,6.6-3.2,8.5,0l10.5,17
	c2.1,3.3-0.3,7.6-4.3,7.6h-21c-3.9,0-6.3-4.3-4.3-7.6L97.7,136.5z"/>
                        <path d="M249.7,142.5c-3.8,0-7.1-0.9-9.9-2.7c-2.7-1.8-4.6-4.3-5.7-7.4l4.7-2.7c1.6,5,5.3,7.5,11,7.5c2.8,0,5-0.6,6.5-1.7
	c1.5-1.2,2.2-2.7,2.2-4.6c0-2-0.7-3.4-2.2-4.4s-4-2-7.5-3.1c-1.7-0.5-3-1-3.9-1.3c-0.9-0.4-2-0.9-3.4-1.5c-1.3-0.7-2.3-1.4-3-2.1
	c-0.7-0.7-1.3-1.7-1.8-2.9c-0.5-1.2-0.8-2.5-0.8-4c0-3.6,1.3-6.4,3.8-8.5c2.5-2.1,5.6-3.2,9.2-3.2c3.3,0,6.1,0.8,8.5,2.5
	c2.4,1.6,4.3,3.8,5.5,6.5l-4.6,2.6c-1.8-4.2-4.9-6.4-9.4-6.4c-2.2,0-4,0.6-5.4,1.6c-1.4,1.1-2.1,2.6-2.1,4.5c0,1.8,0.6,3.2,1.9,4.1
	c1.3,0.9,3.5,1.9,6.7,2.9c1.1,0.4,1.9,0.6,2.4,0.8c0.5,0.2,1.2,0.4,2.2,0.8c1,0.4,1.8,0.7,2.2,0.9c0.5,0.2,1.1,0.6,1.9,1
	c0.8,0.4,1.4,0.8,1.8,1.2c0.4,0.4,0.8,0.9,1.4,1.5c0.5,0.5,0.9,1.1,1.2,1.7c0.2,0.6,0.4,1.3,0.6,2.1c0.2,0.7,0.3,1.6,0.3,2.4
	c0,3.6-1.3,6.5-3.9,8.7C257.4,141.5,254,142.5,249.7,142.5z"/>
                        <path d="M296.5,138.6c-2.9,2.6-6.6,3.9-11.1,3.9s-8.3-1.3-11.2-3.9c-2.9-2.7-4.3-6.2-4.3-10.7v-27.4h5.5v27.1c0,2.9,0.9,5.2,2.6,6.9
	c1.7,1.7,4.2,2.5,7.4,2.5s5.7-0.8,7.4-2.5c1.7-1.7,2.6-4,2.6-6.9v-27.1h5.4v27.4C300.8,132.4,299.4,135.9,296.5,138.6z"/>
                        <path d="M324.1,100.6c3.8,0,7,1.3,9.5,3.8c2.6,2.5,3.8,5.7,3.8,9.4c0,3.7-1.3,6.9-3.8,9.4c-2.5,2.6-5.7,3.8-9.5,3.8h-9.5v14.7h-5.5
	v-41.2H324.1z M324.1,121.9c2.3,0,4.2-0.8,5.6-2.3c1.5-1.6,2.2-3.5,2.2-5.8c0-2.4-0.7-4.3-2.2-5.8s-3.4-2.3-5.6-2.3h-9.5v16.2H324.1
	z"/>
                        <path d="M358.8,100.6c3.8,0,7,1.3,9.5,3.8c2.5,2.5,3.8,5.7,3.8,9.4c0,3.7-1.3,6.9-3.8,9.4c-2.5,2.6-5.7,3.8-9.5,3.8h-9.5v14.7h-5.5
	v-41.2H358.8z M358.8,121.9c2.3,0,4.2-0.8,5.6-2.3c1.5-1.6,2.2-3.5,2.2-5.8c0-2.4-0.7-4.3-2.2-5.8c-1.5-1.5-3.4-2.3-5.6-2.3h-9.5
	v16.2H358.8z"/>
                        <path d="M384.1,136.6h17.8v5.2h-23.2v-41.2h5.5V136.6z"/>
                        <path d="M432.6,100.6l-14.6,24.5v16.7h-5.5V125L398,100.6h6.1l11.2,19.3l11.2-19.3H432.6z"/>
</svg>

                </div>
                <div class="heading text-center">
                    <h1>Договор публичной оферты</h1>
                    <p>
                        Порядка использования Системы Smartpos Supply
                    </p>
                </div>
                <div class="accept-date d-flex">
                    <div class="date">
                        Дата утверждения:
                    </div>
                    <div class="city">
                        Город <strong>Ташкент.</strong>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--    <div class="green-rect first" style="background-image: url('green-rectangle.svg')"></div>-->
    <!--    <div class="green-rect second" style="background-image: url('green-rectangle.svg')"></div>-->
</div>
<div class="container">
    <div class="row">
        <div class="col-12">
            <p>
                Настоящая публичная Оферта (далее – Оферта, Договор) определяет порядок оказания Обществом с
                ограниченной ответственностью «CENTER FOR DIGITAL TECHNOLOGY AND INNOVATION» («ЦЕНТР ЦИФРОВЫХ ТЕХНОЛОГИЙ
                И ИННОВАЦИОННЫХ РАЗРАБОТОК» (далее - Оператор) услуг по предоставлению Юридическим лицам и
                Индивидуальным предпринимателям (далее – Пользователь) доступа к функциональным возможностям Системы
                Smartpos Supply ( далее-Система), предоставляющим доступ к информации
                о товарах и их покупке, позволяющим осуществлять сделки купли-продажи товаров, основанные на применении
                технологий с использованием электронной платформы.
            </p>
            <p>
                В соответствии со ст. 367 Гражданского Кодекса Республики Узбекистан данный документ является публичной
                офертой, и в случае принятия изложенных ниже условий, Пользователь, производящий Акцепт данной оферты,
                одним из способов, указанных
                в Оферте, считается равносильным заключившим Договор на условиях, изложенных в Оферте.
            </p>
            <p>
                В связи с этим Пользователю рекомендовано внимательно ознакомится с текстом настоящей Оферты (включая
                правки, вносимые с течением времени), размещенным на официальном Сайте Оператора www.smartpos.uz, (далее
                – Сайт), и в случае несогласия с условиями Оферты не производить Акцепт Оферты.
            </p>
            <p>
                Осуществляя Акцепт оферты, Пользователь гарантирует, что ознакомлен, соглашается полностью и
                безоговорочно, принимает все условия, которые изложены в тексте Оферты. Оператор оставляет за собой
                право изменять условия настоящей Оферты, тарифных планов, опций, функциональных возможностей Системы,
                размещая изменения на Сайте www.smartpos.uz. Изменения настоящей Оферты вступают в силу по истечении 10
                (десять) календарных дней с момента их опубликования Сайте, если иное не указано при размещении.
            </p>
            <p>
                Настоящий Договор не требует двустороннего подписания, считается заключенным с момента его Акцепта
                Пользователем и действителен в электронном виде.
            </p>
            <section>
                <h2>
                    <strong>
                        1. Термины и определения
                    </strong>
                </h2>
                <p>
                    Для целей настоящей Оферты нижеприведенные термины и определения
                    используются в следующем значении:
                </p>
                <ul>
                    <li>
                        <div>
                            <strong>Система Smartpos Supply</strong> — это совокупность связанных между собой
                            веб-страниц,
                            размещенных в сети Интернет, являющейся сервисом, содержащих набор функций, позволяющих
                            Пользователю осуществлять действия: публикация, предоставление необходимой информации о
                            товарах, предназначенных для Пользователей и т.д. Владелец Системы Smartpos Supply — ООО
                            «CENTER FOR DIGITAL TECHNOLO-
                            GY AND INNOVATION» (ИНН: 306 344 019), зарегистрированное в соответствии с законодательством
                            Республики Узбекистан, в лице своих сотрудников осуществляющее администрирование системы.
                        </div>
                    </li>
                    <li>
                        <strong>Пользователь</strong> - Юридическое лицо и\или Индивидуальный предприниматель,
                        принявший условия Оферты и заключивший настоящий Договор использования Сервиса Smartpos
                        Supply.
                    </li>
                    <li>
                        <strong>Логин</strong> — комбинация букв, цифр, символов, используемая для входа
                        Пользователя в Личный кабинет.
                    </li>
                    <li>
                        <div>
                            <strong>Товар</strong> — предмет договора купли-продажи, заключаемого между Покупателем
                            и Продавцом, представленный к продаже на платформе Системы. Все взаимоотношения, связанные с
                            куплей-продажей Товара, возникают исключительно между Продавцом, размещающим Товар в Системе
                            и Покупателем.
                        </div>
                    </li>
                    <li>
                        <div>
                            <strong>Акцепт</strong> — полное и безоговорочное принятие Пользователем условий настоящей
                            Оферты. Акцептом настоящей Оферты является осуществление действий, изложенных в условиях
                            Договора.
                        </div>
                    </li>
                    <li>
                        <div>
                            <strong>Личный кабинет</strong> — совокупность защищенных персонализированных страниц
                            Пользователя в Системе, создаваемых при регистрации, посредством которых осуществляется
                            использование Системы и оформление Заказов. Доступ в личный кабинет осуществляется после
                            регистрации путем ввода аутентификационных данных Пользователя.
                        </div>
                    </li>
                    <li>
                        <div>
                            <strong>Аутентификационные данные</strong> — уникальный идентификатор (логин) и пароль
                            Пользователя, используемые для доступа в личный кабинет.
                        </div>
                    </li>
                    <li>
                        <div>
                            <strong>Персональные данные</strong> — электронные информационные ресурсы Пользователя,
                            обрабатываемые в порядке предоставления услуг, любая информация, относящаяся к юридическому
                            лицу, индивидуальному предпринимателю.
                        </div>
                    </li>
                    <li>
                        <div>
                            <strong>Контент и материалы</strong>— любые размещенные в Системе или содержащиеся в
                            Рассылке объекты интеллектуальной собственности Оператора, изображений, рисунков,
                            фотографий, графиков, видео, программ, звуков, покупательских интерфейсов, логотипов,
                            торговых марок, компьютерных кодов, которые являются содержанием Системы и размещены в
                            Системе.
                            В случае, если в настоящей Оферте используются термины, не нашедшие своего отражения в
                            разделе 1, то они подлежат использованию и толкованию в соответствии с действующим
                            законодательством Узбекистана, и обычаями делового оборота, сложившимися в сети Интернет.
                        </div>
                    </li>
                </ul>
            </section>
            <section>
                <h2>2. Предмет оферты</h2>
                <ul>
                    <li>
                        2.1. Любое юридическое лицо и\или Индивидуальный предприниматель - вправе присоединиться к
                        настоящему
                        Договору и тем самым заключить Лицензионный договор, начав использование ПО, а именно совершив
                        следующие конклюдентные действия:
                    </li>
                    <li>
                        2.2. Пользователь обязуется использовать Сервис в соответствии с условиями настоящего Договора.
                    </li>
                    <li>
                        2.3. Для пользования Сервисом Пользователю необходимо пройти Регистрацию на Сервисе в
                        соответствии с инструкцией, размещенной на сайте www.smartpos.uz. Регистрация Пользователя на
                        Сервисе является Акцептом настоящего Договора и означает, что Пользователь до Регистрации
                        ознакомился с условиями настоящего Договора в полном объеме, принимает все условия настоящего
                        Договора в полном объеме без каких-либо изъятий и ограничений, присоединяется к Договору и
                        обязуется его соблюдать. В случае несогласия Пользователя с положениями Договора, использование
                        Сервиса, а также процедура Регистрации должны быть незамедлительно прекращены.
                    </li>
                    <li>
                        2.4. Акцептируя настоящий Договор, Пользователь подтверждает свою правоспособность и
                        дееспособность, точность, достоверность, актуальность
                        и полноту введенных им при Регистрации данных и принимает на себя всю ответственность за
                        неблагоприятные последствия, вызванные предоставлением недостоверной или неполной информации.
                    </li>
                    <li>
                        2.5. Объем Услуг, предоставляемых Оператором ограничен условиями Оферты. Оператор не является
                        участником, организатором сделки, покупателем, поставщиком, работодателем, посредником, агентом,
                        представителем какого-либо продавца, покупателя, выгодоприобретателем или иным заинтересованным
                        лицом в отношении сделок между Пользователями. Пользователи используют размещённую в Системе
                        информацию, чтобы заключать сделки без прямого или косвенного участия, или контроля со стороны
                        Оператора.
                    </li>
                    <li>
                        2.6. Оператор оказывает услуги при наличии технической возможности. Совершая акцепт Оферты,
                        Пользователь уведомлен и осознает, что оказываемые услуги являются комплексным электронным
                        сервисом, который зависит от массы разных факторов, которые находятся вне зоны контроля
                        Оператора (работоспособность каналов связи, изменения в правилах и API используемых серверов,
                        сервисов доставки уведомлений и т.д.). В связи с чем, беспрерывное оказание услуг не
                        гарантируется, возможны перерывы.
                    </li>
                    <li>
                        2.7. Договор может быть изменен Оператором в одностороннем порядке, без предварительного
                        согласования с Пользователем, путем размещения изменений на сайте www.smartpos.uz не позднее,
                        чем за 10(десять) календарных дней до даты вступления в силу внесенных изменений, если более
                        длительный срок вступления изменений в силу не определен при таком размещении. С момента
                        опубликования изменений на сайте, Пользователь считается уведомленным о внесенных Оператором
                        изменениях. Пользователь вправе отказаться от Договора в случае несогласия с внесенными
                        Оператором изменениями, направив соответствующее заявление до даты вступления в силу таких
                        изменений. Не поступление Оператору в 10-ти дневный срок такого заявления означает безусловное
                        принятие Пользователем измененных условий Договора.
                        Оператор рекомендует Пользователям регулярно проверять условия настоящего Договора на сайте
                        www.smartpos.uz на предмет его изменения и\или дополнения. Пользователь соглашается, что
                        внесение изменений и дополнений в настоящую Оферту влечет за собой внесение изменений и
                        дополнений в уже заключенный путем Акцепта и действующий между Сторонами Договор, и они вступают
                        в
                        силу одновременно с такими изменениями в настоящем Договоре. Под действие настоящей Оферты
                        подпадают все существующие и реально функционирующие функции Системы, а также любые их
                        последующие модификации и появляющиеся в дальнейшем дополнительные услуги.
                    </li>
                    <li>
                        2.8. Исключительные права на все объекты, размещенные на Сайте и в Системе, принадлежат
                        Оператору, что означает, что Оператор обладает исключительными правами на элементы дизайна,
                        текст, графические изображения, иллюстрации, видео, скрипты, программы, и другие объекты
                        (контент). Оператор осуществляет управление Системой, определяет ее структуру, внешний вид,
                        разрешает или ограничивает доступ Пользователей к Системе, осуществляет иные принадлежащие ему
                        права.
                    </li>
                    <li>
                        2.9. Использование Системы допускается на условиях, предусмотренных настоящим Договором. Доступ
                        к
                        Системе предоставляется на возмездной основе. В целях получения полной возможности использования
                        Системы Пользователю необходимо пройти Регистрацию в соответствии с инструкцией, которая
                        является добровольной. Регистрация считается завершенной только в случае успешного прохождения
                        всех этапов. После Регистрации \идентификации Пользователя в Системе, Пользователю
                        предоставляется доступ к Личному кабинету.
                    </li>
                    <li>
                        2.10. Система предоставляет Покупателю возможность поиска информации о Товарах, возможность
                        получения товарных предложений и информации от Поставщиков,
                        а также использование иных функциональных возможностей. В процессе развития Системы список
                        доступных для Пользователя опций может быть изменен Оператором без предварительного уведомления
                        Пользователя.
                    </li>
                    <li>
                        2.11. В Системе запрещено использование ненормативной лексики,грубое общение,размещение
                        информации и товаров, негативно влияющих на имидж Оператора, носящих характер непристойности,
                        нарушающие в той или иной степени честь и достоинство, права и охраняемые законом интересы
                        других лиц, способствующие или содержащие призывы к разжиганию религиозной, расовой и
                        межнациональной розни, а также любых материалов, нарушающих законодательство Узбекистана и
                        авторское право. В случае нарушений всю ответственность несет Пользователь.
                    </li>
                </ul>
            </section>
            <section>
                <h2>
                    3. Права и обязанности сторон
                </h2>
                <ul>
                    <li>
                        3.1. Обязанности Оператора:
                        <ul class="child-list">
                            <li>
                                3.1.1. Предоставить Пользователю после регистрации доступ к Системе, а также
                                оказать Услуги за плату в соответствии с условиями настоящей Оферты.
                            </li>
                            <li>
                                3.1.2. Предоставить Пользователю иные услуги, перечень, описание и стоимость
                                которых установлены в Приложение No 1 к настоящему Договору.
                            </li>
                            <li>
                                3.1.3. Решать все спорные ситуации с Пользователем при обращении Пользователя
                                в службу поддержки Системы. Если какой-либо вопрос не урегулирован настоящей Офертой,
                                Оператор самостоятельно принимает решение о том, как необходимо поступить в той или иной
                                ситуации.
                            </li>
                            <li>
                                3.1.4. Обеспечивать работу Сервиса круглосуточно 7 дней в неделю, включая выходные и
                                праздничные дни, за исключением случаев, оговоренных в настоящей Оферте. А также
                                приложить разумные усилия по обеспечению стабильной работы Системы, постепенному ее
                                совершенствованию, исправлению ошибок в работе.
                            </li>
                            <li>
                                3.1.5. Осуществлять техническую поддержку Пользователя.
                            </li>
                        </ul>
                    </li>
                    <li>
                        3.2. Оператор вправе:
                        <ul class="child-list">
                            <li>
                                3.2.1. Самостоятельно определять способы и методы оказания услуг без предварительного
                                согласования с Пользователем.
                            </li>
                            <li>
                                3.2.2.Требовать своевременной оплаты по настоящему Договору.
                            </li>
                            <li>
                                3.2.3.Приостанавливать, ограничивать или прекращать доступ Пользователя к части
                                или ко всем функциям, опциям, разделам Системы в одностороннем порядке в любое время,
                                без
                                предварительного уведомления Пользователя, в случае нарушения Пользователем условий
                                настоящей Оферты. При этом Оператор не несет ответственности за любой вред, который
                                может
                                быть причинен Пользователю такими действиями (в том числе, удалив данные Пользователя
                            </li>
                            <li>
                                3.2.4. Размещать рекламную и\или иную информацию без согласования
                                с Пользователем, производить запись телефонных разговоров с Пользователем.
                            </li>
                            <li>
                                3.2.5. В любое время в одностороннем порядке изменять, настоящую Оферту, обновлять
                                содержание, функциональные возможности, опубликовав их на сайте www.smartpos.uz без
                                уведомления и получения согласия Пользователя.
                            </li>
                            <li>
                                3.2.6. Приостанавливать работу Системы для проведения необходимых плановых
                                профилактических и
                                ремонтных работ, а также внеплановых работ в аварийных ситуациях.
                            </li>
                            <li>
                                3.2.7. Прерывать работу Системы, если это, в частности, обусловлено действием и\
                                или бездействием третьих лиц, если это непосредственно влияет на работу
                                Системы, в том числе при аварийной ситуации.
                            </li>
                            <li>
                                3.2.8.Оператор оставляет за собой право без предварительного оповещения и без
                                каких-либо обязательств перед Пользователем прекратить функционирование
                                Системы и предоставляемого доступа к Системе.
                            </li>
                            <li>
                                3.2.9. Оператор не несет какой-либо ответственности перед Пользователем и не
                                возмещает ему какие-либо убытки, в том числе понесенные Пользователем из-за разглашения,
                                потери Пользователем или кражи у Пользователя персональных данных, а также возникшие или
                                могущие возникнуть у Пользователя в связи с задержками, перебоями в работе и
                                невозможностью
                                полноценного использования ресурсов Сервиса.
                            </li>
                            <li>
                                3.2.10. Направлять на электронный адрес, мобильный телефон, в личный кабинет
                                Пользователя
                                электронные письма и SMS-сообщения информационного и рекламного характера, редактировать
                                и
                                опубликовывать любую информацию в Системе.
                            </li>
                            <li>
                                3.2.11. После расторжения или прекращения срока действия Оферты, Оператор имеет право
                                удалить все данные Пользователя из Системы без возможности их восстановления. При этом
                                Оператор освобождается от любых обязательств, связанных с аутентификационными данными
                                Пользователя.
                            </li>
                            <li>
                                3.2.12. Удалить учетную запись Пользователя в случае обнаружения факта использования при
                                Регистрации данных третьих лиц без их согласия.
                            </li>
                        </ul>
                    </li>
                    <li>
                        3.3. Оператор предоставляет в пользование Систему по принципу «как есть» и не гарантирует
                        отсутствие ошибок в работе Системы, не несет ответственность
                        за бесперебойную работу Системы и ее совместимость с программным обеспечением и техническими
                        средствами Пользователя, не несет ответственность за потерю данных или за причинение любых
                        убытков, которые возникли или
                        могут возникнуть в связи с использованием Системы, не несет ответственности за неисполнение либо
                        ненадлежащее исполнение своих обязательств вследствие сбоев в телекоммуникационных и
                        энергетических сетях, действий вредоносных программ, а также недобросовестных действий третьих
                        лиц, направленных на несанкционированный доступ и\или выведение из строя программного и\или
                        аппаратного комплекса Системы.
                    </li>
                    <li>
                        3.4. Обязанности Пользователя:
                        <ul class="child-list">
                            <li>
                                3.4.1. До момента акцепта Оферты ознакомиться с содержанием настоящей
                                Оферты и надлежащим образом исполнять условия настоящего Договора.
                            </li>
                            <li>
                                3.4.2. При регистрации в Системе предоставить достоверные данные, а также
                                своевременно их обновлять в процессе использования Системы.
                            </li>
                            <li>
                                3.4.3.Использовать Систему на условиях, определенных Договором.
                            </li>
                            <li>
                                3.4.4. Принять надлежащие меры по настройке своего оборудования.
                            </li>
                            <li>
                                3.4.5.Уведомлять Оператора о каких-либо технических ошибках или нарушениях в
                                Системе Оператора.
                            </li>
                            <li>
                                3.4.6.Самостоятельно следить за вносимыми изменениями и поправками в условия
                                Оферты, публикуемыми на сайте www.smartpos.uz.
                            </li>
                            <li>
                                3.4.7. Соблюдать обязательства перед Оператором, в том числе своевременно
                                вносить плату за услуги доступа и пользования функциональными
                                возможностями Системы.
                            </li>
                            <li>
                                3.4.8. Своевременно обеспечивать Оператора всеми документами и
                                информацией, необходимыми для выполнения своих обязательств по Договору.
                            </li>
                            <li>
                                3.4.9. Нести
                                полную ответственность по убыткам, возникшим у Оператора в случае
                                неисполнении или ненадлежащего исполнения Пользователем обязательств перед Оператором, а
                                также требований законодательства Республики Узбекистан.
                            </li>
                            <li>
                                3.4.10. Нести полную ответственность за хранение паролей для доступа в Систему и не
                                передавать их посторонним лицам, включая сотрудников Оператора.
                            </li>
                            <li>
                                3.4.11. Использовать Систему только для законных целей и законными способами с учетом
                                законодательства Узбекистана.
                            </li>
                            <li>
                                3.4.12. Не декомпилировать, дизассемблировать, любым образом модифицировать код
                                элементов Системы и/или необходимых для функционирования Системы и иным другим образом
                                вмешиваться в работу Системы с целью нарушения ее нормального функционирования.
                            </li>
                            <li>
                                3.4.13. Не оказывать пагубного влияния своими действиями на деловую репутацию Оператора.
                            </li>
                        </ul>
                    </li>
                    <li>
                        3.5. Пользователь вправе:
                        <ul class="child-list">
                            <li>
                                3.5.1. Получать услуги надлежащего качества и пользоваться функциональными
                                возможностями Системы при условии соблюдения законодательства
                                Республики Узбекистан.
                            </li>
                            <li>
                                3.5.2.Обращаться за консультациями к специалисту Оператора по вопросам,
                                связанным с оказанием услуг по Договору или по техническим вопросам.
                            </li>
                            <li>
                                3.5.3.Обратиться к Оператору для выяснения ситуации и принятия необходимых мер
                                в случае возникновения в работе Системы проблем технического характера, а также в случае
                                получения Пользователем сообщений несанкционированной рекламы, либо содержащих угрозы
                                и\или файлы с подозрением на вирус, а также в случае обнаружения фактов, дающих
                                основания полагать, что его доступ к Системе был использован не санкционированно
                                кем-либо.
                            </li>
                            <li>
                                3.5.4.Расторгнуть настоящий Договор в одностороннем порядке при условии отсутствия
                                задолженности перед Оператором и исполнения надлежащим образом обязательств по сделкам,
                                заключенным с использованием Системы.
                            </li>
                        </ul>
                    </li>
                    <li>
                        3.6. Используя Систему, Пользователь признает и соглашается с тем, что все содержимое Системы, в
                        котором хранятся Контент, материалы Оператора, а также структура содержимого их (аудиовизуальные
                        произведения, текстовые и графические материалы, программы для ЭВМ, товарные знаки), защищены
                        авторским правом, и другими правами на результаты интеллектуальной и не переходят к Пользователю
                        в результате использования Системы и заключения настоящего Договора. Без письменного разрешения
                        Оператора запрещается любое изменение, копирование, распространение, создание производных
                        произведений, пересылка, продажа и т.д.
                    </li>
                    <li>
                        3.7. Пользователь уведомлен и согласен, что в случае отсутствия 100% предварительной оплаты
                        услуг по настоящему Договору с момента, когда такие обязательства должны были быть исполнены
                        Пользователем в соответствии с условиями
                        договора, Оператор имеет право блокировать доступ Пользователя к Систему и использованию ее
                        функциональных возможностей.
                    </li>
                </ul>
            </section>
            <section>
                <h2>4. Размер и порядок оплаты</h2>
                <ul>
                    <li>
                        4.1. За оказание услуг по предоставлению Пользователю доступа к функциональным возможностям
                        Сервиса, Оператором взимается плата. Стоимость услуг Оператора формируется исходя из выбранных
                        Пользователем функциональных возможностей Системы, отраженных в Приложении No 1, являющейся
                        неотъемлемой частью настоящего Договора. Пользователь самостоятельно выбирает состав опций
                        (функций), что определяет стоимость услуг по настоящему Договору.
                    </li>
                    <li>
                        4.2. Оператор оставляет за собой право в любой момент изменять стоимость услуг, публикации
                        указанных изменений производятся на сайтеwww.smartpos.uz .
                    </li>
                    <li>
                        4.3. Пользователь оплачивает стоимость услуг путем 100% предварительной оплаты
                        за текущий месяц после Регистрации в Системе. Оплата за последующие месяцы осуществляется
                        Пользователем путем 100% предварительной оплаты к моменту истечения срока действия предыдущего
                        оплаченного расчетного месяца (до последнего календарного числа истекающего оплаченного месяца).
                        Пользователь имеет право произвести предварительную оплату за несколько месяцев.
                    </li>
                    <li>
                        4.4. Оплата по Договору осуществляется в безналичном порядке, расчеты производятся в сумах
                        Республики Узбекистан. Датой оплаты считается дата поступления денежных средств на расчетный
                        счет Оператора.
                    </li>
                    <li>
                        4.5. Отсутствие 100% предварительной оплаты Пользователем с момента, когда
                        такие обязательства должны были быть исполнены Пользователем в соответствии
                        с условиями настоящего Договора, является основанием для блокирования Оператором доступа к
                        Системе и использованию функциональных возможностей Системы. Частичная или полная блокировка
                        доступа к Системе и использованию ее функциональных возможностей не является нарушением
                        обязательств Оператора по настоящему Договору. Возобновление доступа к Системе и использованию
                        ее функциональных возможностей возможно только при полном погашении задолженности и исполнении
                        Пользователем своих обязательств по настоящему Договору.
                    </li>
                    <li>
                        4.6. В период действия настоящего Договора Стороны согласовывают финансовые условия путем
                        выставления счетов-фактур. Выставление и оплата счетов-фактур в рамках настоящего Договора может
                        осуществляться неограниченное количество раз.
                    </li>
                    <li>
                        4.7. В случае неполучения Оператором в срок до 5 (пяти) календарных дней с момента окончания
                        Отчетного периода претензий по качеству оказанных услуг, обязательства Оператора считаются
                        выполненными надлежащим образом, принятыми Пользователем в полном объёме без замечаний.
                    </li>
                </ul>
            </section>
            <section>
                <h2>
                    5. Ответственность сторон
                </h2>
                <ul>
                    <li>
                        5.1. За неисполнение или ненадлежащее исполнение настоящего Договора, Стороны несут
                        ответственность в соответствии с нормами законодательства Республики Узбекистан и условиями
                        Договора.
                    </li>
                    <li>
                        5.2. За нарушение авторских и исключительных прав Оператора предусмотрена уголовная и
                        гражданская ответственность. Любые нарушения преследуются Оператором в судебном порядке. В
                        случае нарушения Пользователями исключительных прав Оператора, Оператор вправе отказать
                        Пользователю в оказании Услуг, а также предъявить требование об уплате компенсации в размере 200
                        (двести) БРВ (базовых расчетных величин) за каждый случай нарушения, а также компенсации всех
                        причиненных убытков, включая упущенную выгоду.
                    </li>
                    <li>
                        5.3. Пользователь несет ответственность за риски и возможный ущерб, возникший в результате
                        предоставления им недостоверных сведений о себе при Регистрации
                        в Системе, несвоевременное обновление указанных данных в процессе использования Системы, а также
                        за их передачу третьим лицам и\или совершение действий или бездействия, повлекших
                        несанкционированный доступ третьих лиц к указанным данным или Системе.
                    </li>
                    <li>
                        5.4. В случае нарушения Пользователем условий Договора, Оператор имеет право в любой момент
                        ограничить или заблокировать доступ Пользователя к Системе без уведомления. В случае нарушения
                        Пользователем условий Договора, Пользователь обязуется возместить Оператору вред, причиненный
                        такими действиями, включая прямые и косвенные убытки.
                    </li>
                    <li>
                        5.5. Оператор не несет ответственности за любые убытки, включая упущенную выгоду, причиненные
                        Пользователю в результате невозможности для Пользователя воспользоваться предоставленными ему
                        Оператором услугами, включая, но не ограничиваясь при следующих обстоятельствах: технические
                        временные сбои
                        и перерывы в работе Системы и ее компонентов, плановые и внеплановые мероприятия по обслуживанию
                        Системы и ее компонентов, программные или аппаратные ошибки, сбои, пропуски, перерывы в работе,
                        удаление файлов, изменение функций, дефекты на компьютере или ином техническом оборудовании
                        Пользователя, задержки в работе при передаче данных или иные обстоятельства, связанные с
                        недостатками качества услуг связи, электрических услуг, в том
                        числе перерывы, нестабильная связь, недостаточная скорость передачи данных, некорректная работа
                        сети Интернет. В данном случае услуги считаются оказанными надлежащим образом и подлежат оплате
                        в полном объеме.
                    </li>
                    <li>
                        5.6. Оператор не несет ответственности за любые убытки, включая любой прямой, косвенный ущерб,
                        упущенную выгоду, возникшие вследствие использования Системы и ее компонентов, возникшие по
                        причине несанкционированного использования третьими лицами Сервиса, Личного кабинета
                        Пользователя, идентификационных данных Пользователя, возникших в результате некорректных
                        действий Пользователя по использованию Системы и управлению услугами, а также
                        несанкционированного доступа третьих лиц к услугам Оператора.
                    </li>
                    <li>
                        5.7. Оператор не несет ответственности за несоответствие предоставленных
                        Товаров необоснованным ожиданиям Пользователей и их субъективной оценке, за ненадлежащее
                        использование Товара Пользователем, в случае неправильного выбора Пользователем характеристик
                        или модификации Товара, за качество Товара, реализуемое Поставщиками, а также за исполнение ими
                        своих обязательств по передаче Товара Пользователю, Пользователь соглашается, что любые
                        претензии по качеству, количеству, комплектности Товара, срокам доставки Товара, подлежат
                        направлению Поставщику, у которого Товар был заказан.
                    </li>
                    <li>
                        5.8. В случае несоблюдения Пользователем условий настоящего Договора, а также ненадлежащего
                        исполнения обязательств, Оператор вправе расторгнуть настоящий Договор Публичной Оферты в
                        одностороннем порядке и обратиться в суд с целью взыскания с Пользователя убытков, понесенных в
                        результате неисполнения Пользователем своих обязательств, включая судебные издержки.
                    </li>
                    <li>
                        5.9. Пользователь полностью отвечает за всю информацию, которую загружает, посылает, передает
                        или каким- либо другим способом делает доступной в Системе.
                    </li>
                    <li>
                        5.10. В случае несвоевременной оплаты Пользователем предоставляемых Оператором услуг в
                        соответствии с условиями Договора, Пользователь обязуется выплатить Оператору пени из расчета
                        0,4 % от стоимости несвоевременного платежа, за каждый день просрочки, но не более 40 % от суммы
                        задолженности. Уплата пени и\или штрафа не освобождает Пользователя от надлежащего исполнения
                        принятых на себя обязательств.
                    </li>
                    <li>
                        5.11. Стороны освобождаются от ответственности за неисполнение или ненадлежащее исполнение своих
                        обязательств по настоящему Договору в случае действия обстоятельств непреодолимой силы, прямо
                        или косвенно препятствующих исполнению Договора, то есть таких обстоятельств, которые независимы
                        от
                        воли Сторон, не могли быть ими предвидены в момент заключения Договора и предотвращены разумными
                        средствами при их наступлении. К обстоятельствам непреодолимой силы в том числе относятся:
                        война, военные действия, восстание, эпидемии, землетрясения, наводнения, природные пожары,
                        ураганы, изменение санитарно-эпидемиологической обстановки, катастрофы, акты органов власти,
                        непосредственное затрагивающие предмет Договора. Сторона, попавшая под действие непреодолимой
                        силы, при первой возможности, не позднее 5 (пяти) календарных дней, уведомляет другую Сторону в
                        письменном виде о случившемся. В случае, если обстоятельства непреодолимой силы длятся более 60
                        (шестьдесят) дней, Стороны совместно определяют дальнейшую юридическую судьбу настоящего
                        Договора.
                    </li>
                </ul>
            </section>
            <section>
                <h2>
                    6. Срок действия договора, порядок изменения и расторжения договора
                </h2>
                <ul>
                    <li>
                        6.1. Договор вступает в силу с момента его Акцепта Пользователем. Настоящий Договор заключен на
                        неопределенный срок. Право на использование Системы и ее функциональных возможностей
                        предоставляется
                        на срок оплаты Пользователем услуг Оператора.
                    </li>
                    <li>
                        6.2. Оператор оставляет за собой право в одностороннем порядке, без предварительного
                        согласования с Пользователем вносить изменения в условия Оферты, отозвать Оферту в любой момент
                        по своему усмотрению. Все изменения публикуются Оператором на официальном сайте www.smartpos.uz,
                        не позднее, чем за 10(десять) календарных дней до даты вступления в силу внесенных изменений,
                        если более длительный срок вступления изменений в силу не определен при
                        таком размещении. С момента опубликования изменений на сайте, Пользователь считается
                        уведомленным о внесенных Оператором изменениях. Пользователь вправе отказаться от Договора в
                        случае несогласия с внесенными Оператором изменениями, направив соответствующее заявление до
                        даты вступления в силу таких изменений. Не поступление Оператору в 10-ти дневный срок такого
                        заявления означает безусловное принятие Пользователем измененных условий Договора.
                    </li>
                    <li>
                        6.3. Пользователь вправе в любое время в одностороннем порядке отказаться от услуг Оператора и
                        расторгнуть Договор, направив письменное уведомление заказным почтовым письмом, а также на
                        электронный адрес Оператора за
                        30 (тридцать) календарных дней до даты расторжения Договора. Настоящий Договор прекращается по
                        истечении 30 календарных дней с даты направления Пользователем Оператору письменного уведомления
                        об одностороннем отказе от исполнения настоящего Договора. Расторжение Договора не освобождает
                        Пользователя от исполнения финансовых обязательств.
                    </li>
                    <li>
                        6.4. В случае досрочного прекращения Договора по любой причине, уплаченный
                        Пользователем в соответствии с настоящим Договором платеж, не подлежит
                        возврату.
                    </li>
                    <li>
                        6.5. Оператор вправе в любой момент отказаться от исполнения Договора, полностью
                        блокировать доступ к Системе и ее использованию в случае нарушения (в том числе однократного)
                        Пользователем условий настоящей Оферты. При этом письменное уведомление Пользователя не
                        требуется. При указанных обстоятельствах уплаченный Пользователем в соответствии с настоящим
                        Договором платеж
                        не подлежит возврату.
                    </li>
                    <li>
                        6.6. Оператор вправе в одностороннем порядке расторгнуть настоящий договор
                        без объяснения причин и в любое время, путем направления Пользователю соответствующего
                        уведомления за десять календарных дней до предполагаемой даты расторжения любым доступным
                        способом, в том числе и на адрес электронной почты, в личный кабинет. При этом Стороны
                        установили, что уведомление будет считаться направленным, а Пользователь надлежаще извещенным об
                        этом
                        с момента отправки заказного письма на адрес Пользователя без подтверждения
                        и получения уведомления о получении письма от Пользователя и\или электронного письма с текстом
                        уведомления с электронного адреса Оператора без подтверждения уведомления о получении письма от
                        Пользователя.
                    </li>
                </ul>
            </section>
            <section>
                <h2>7. Урегулирование споров</h2>
                <ul>
                    <li>
                        7.1. В случае возникновения любых споров или разногласий, связанных с исполнением Договора,
                        Стороны приложат все усилия для их разрешения путем проведения переговоров между уполномоченными
                        представителями Сторон.
                    </li>
                    <li>
                        7.2. Все споры между Сторонами подлежат разрешению путем переговоров.
                        При не достижении между Сторонами соглашения в ходе переговоров споры разрешаются в судебном
                        порядке в Ташкентском межрайонном экономическом суде с соблюдением обязательного претензионного
                        порядка. Сторона, получившая претензию, обязана ее рассмотреть и направить письменный
                        мотивированный ответ другой стороне в течение 10 (десяти) календарных дней с момента получения
                        претензии.
                    </li>
                </ul>
            </section>
            <section>
                <h2>
                    8. Персональные данные
                </h2>
                <ul>
                    <li>
                        8.1. Пользователь дает согласие Оператору на сбор и обработку своих Персональных данных,
                        введенных
                        при Регистрации в Системе, а также в процессе использования Системы и ее функциональных
                        возможностей. Сбор и обработка Персональных данных Пользователя осуществляется в целях:
                        предоставления Пользователю прав на пользование Системой; для связи с Пользователем, в том числе
                        направления уведомлений, запросов и информации, касающихся использования Системы и оказания
                        Услуг;
                        проведения маркетинговых, аналитических и иных исследований.
                    </li>
                    <li>
                        8.2. Согласие Пользователя на обработку Персональных данных предоставляет Оператору право на:
                        сбор,
                        систематизацию с/без применения автоматизированных средств обработки данных, накопление,
                        хранение,
                        уточнение (обновление, изменение), использование и распространение в случаях и в объеме,
                        предусмотренных законодательством Республики Узбекистан, обезличивание, блокирование,
                        уничтожение
                        Персональных данных.
                    </li>
                    <li>
                        8.3. Оператор обязуется осуществлять обработку Персональных данных Пользователя, а также
                        обеспечить
                        конфиденциальность и защиту обрабатываемых Персональных данных в соответствии с
                        законодательством
                        Республики Узбекистан и Договором. При обработке персональных данных Оператор принимает
                        необходимые
                        правовые, организационные и технические меры для защиты получаемых от Пользователя персональных
                        данных от неправомерного или случайного доступа
                        к ним, уничтожения, изменения, блокирования, копирования, предоставления, распространения
                        персональных данных, а также от иных неправомерных действий в отношении получаемых от
                        Пользователя
                        Персональных данных.
                    </li>
                    <li>
                        8.4. Оператор вправе использовать персональные данные Пользователя в маркетинговых, рекламных и
                        информационных целях, включая: информирование о рекламных акциях, рассылка новостей и
                        бизнес-предложений и т.д.
                    </li>
                    <li>
                        8.5. Согласие Пользователя на обработку Персональных данных действует в течение всего срока
                        использования Системы, а также в течение 3 (трех) лет с даты прекращения использования
                        Пользователем
                        Системы.
                    </li>
                </ul>
            </section>
            <section>
                <h2>
                    9. Прочие условия
                </h2>
                <ul>
                    <li>
                        9.1. Стороны признают юридическую силу текстов документов, направленных по электронной почте
                        наравне
                        с документами, исполненными в простой письменной форме на бумажном носителе. Стороны
                        соглашаются,
                        что вся переписка, извещения, уведомления, полученные на адреса электронной почты, в личный
                        кабинет
                        считаются доставленными в надлежащей форме. Стороны обязуются своевременно вносить изменения
                        адреса
                        электронной почты, контактных данных в случае их изменения, своевременно проверять
                        корреспонденцию,
                        поступающую на их адреса электронной почты.
                    </li>
                    <li>
                        9.2. В случае изменении реквизитов, Стороны обязуются письменно извещать друг друга о таких
                        изменениях в 2-х дневный срок. В противном случае, сообщения, переданные по последнему
                        известному
                        адресу, считаются переданными надлежащим образом.
                    </li>
                    <li>
                        9.3. Стороны признают, что, если какое-либо из положений Договора становится недействительным в
                        течение срока его действия вследствие изменения законодательства или по иным причинам, остальные
                        положения Договора обязательны для Сторон в течение срока действия Договора. Недействительность
                        какого-либо из положений Договора не влечет за собой недействительность Оферты в целом.
                    </li>
                    <li>
                        9.4. Настоящий Договор остается в силе в случае изменения реквизитов Сторон, изменения их
                        учредительных документов, организационно-правовой формы, смены собственника Сторон. В случае
                        изменения реквизитов одной из Сторон Договора, такая Сторона обязуется уведомить об этом другую
                        сторону в течение 3 (трех) рабочих дней.
                    </li>
                    <li>
                        9.5. Во всем остальном, что не предусмотрено настоящим Договором, Стороны руководствуются
                        действующим законодательством Республики Узбекистан.
                    </li>
                </ul>
            </section>
            <section>
                <h2>
                    10.Оператор
                </h2>
                <p>
                    ООО «CENTER FOR DIGITAL TECHNOLOGY AND INNOVATION»<br/>
                    100090, Республика Узбекистан,<br/>г.Ташкент,Яккасарайский район,<br/>ул. А.Каххара, 9-й проезд
                    1а<br/><strong>ИНН:</strong> 306 344 019<br/><strong>р/с:</strong> 2020 8000 4050 6594 4001<br/>в
                    ОПЕРУ ЧАБ «Трастбанк»<br/><strong>МФО:</strong>
                    00491,<br/><strong>ИНН банка:</strong> 201 055 090<br/><strong>ОКЭД:</strong>
                    58290<br/><strong>Тел:</strong> (+99855) 500 11 10<br/>
                    <strong>e-mail</strong>:info@smartpos.uz<br/>
                    <strong>www.smartpos.uz</strong><br/>
                    <strong>Директор Ко А.Н.</strong>
                </p>
            </section>
            <section class="additional-offer">
                <div class="text-center">
                    <h2>
                        <strong>
                            ПРИЛОЖЕНИЕ No 1 К ПУБЛИЧНОЙ ОФЕРТЕ
                        </strong>
                    </h2>
                    <p>
                        порядка использования Системы Smartpos Supply
                    </p>
                    <h2>
                        <strong>
                            ФУНКЦИОНАЛЬНЫЕ ВОЗМОЖНОСТИ
                        </strong>
                    </h2>
                </div>
                <table class="table table-bordered table-responsive">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">ОПЦИЯ</th>
                        <th scope="col">СТОИМОСТЬ(сум в месяц)</th>
                        <th scope="col">ПОЯСНЕНИЕ</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>
                            Пользование кабинетом Smartpos Supply
                        </td>
                        <td>
                            Бесплатно
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>
                            Услуга «Агрегация товара»
                        </td>
                        <td>
                            5 (пять) БРВ (базовых расчетных величин)
                        </td>
                        <td>Ежемесячная абонентская плата</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>
                            Услуга «Работа с маркировкой»
                        </td>
                        <td>
                            в стадии разработки
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <th scope="row">4</th>
                        <td>
                            Услуга «Отгрузка товара по заявке»
                        </td>
                        <td>
                            в стадии разработки
                        </td>
                        <td>Сканирование агрегации, автоматическое формирование ЭСФ</td>
                    </tr>
                    <tr>
                        <th scope="row">5</th>
                        <td>
                            Услуга «Складской учет»
                        </td>
                        <td>
                            в стадии разработки
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <th scope="row">6</th>
                        <td>
                            Услуга «Электронные счета-фактуры»
                        </td>
                        <td>
                            500 (пятьсот) сум
                        </td>
                        <td>
                            За каждую подписанную ЭСФ
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">7</th>
                        <td>
                            Услуга «Интеграция с 1С»
                        </td>
                        <td>
                            в стадии разработки
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <th scope="row">8</th>
                        <td>
                            Услуга «Инвентаризация»
                        </td>
                        <td>
                            в стадии разработки
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <th scope="row">9</th>
                        <td>
                            Услуга «Печать маркировки»
                        </td>
                        <td>
                            в стадии разработки
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <th scope="row">10</th>
                        <td>
                            Услуга «Заказы и клиенты»
                        </td>
                        <td>
                            в стадии разработки
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <th scope="row">11</th>
                        <td>
                            Дополнительные услуги
                        </td>
                        <td>
                            в стадии разработки
                        </td>
                        <td></td>
                    </tr>
                    </tbody>
                </table>
            </section>
            <section style="margin-top:50px">
                <strong>
                    Оператор<br/>
                    ООО «CENTER FOR DIGITAL TECHNOLOGY AND INNOVATION»<br/>
                    Ко А.Н.
                </strong>
            </section>
        </div>
    </div>
</div>
</body>
</html>
`;
