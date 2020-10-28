/*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved.
 *************************************************************************/
export const isSettingDisabled = type => {
  let obj = {
    font: false,
    align: false,
    area: false
  };
  if (!type) {
    return obj;
  }
  if (type == "multiple") {
    obj = {
      xy: true,
      font: false,
      align: false,
      area: false
    };
    return obj;
  }
  if (type == "presetText" || type == "textComponent" || type == "title") {
    obj = { font: true, align: true, area: true, xy: true };
    return obj;
  }
  if (
    type == "presetImg" ||
    type == "imgComponent" ||
    type == "presetMedia" ||
    type == "mediaComponent"
  ) {
    obj = {
      font: false,
      align: false,
      area: true,
      xy: true
    };
    return obj;
  }
  if (type == "qrcode") {
    obj = {
      font: false,
      align: false,
      area: false,
      xy: true
    };
    return obj;
  }
  return obj;
};
//记录上一步的内容
