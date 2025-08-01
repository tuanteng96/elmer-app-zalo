import React from "react";

const MUA_HANG = "MUA_HANG";
const HOAN_TIEN = "HOAN_TIEN";
const NAP_QUY = "NAP_QUY";
function eq(a, b) {
  if (a.Type === NAP_QUY) return false;
  if (
    a.Type === b.Type &&
    a.SourceID === b.SourceID &&
    a.RefOrderID == b.RefOrderID
  )
    return true;

  return false;
}
class WalletMM {
  data = {
    Items: [],
    MemberMoneys: [],
    Form: {},
    Cashs: [],
    Methods: [],
    P: {
      Value: 0,
      MethodPayID: 1,
      Desc: "",
    },
    ShowTable: true,
    Grouped: [],
    remainPayed: {
      OrderIDs: [],
      OrderItemIDs: [],
    },
    //for app21
    KHONG_DATCOC: true,
    KHONG_NAPVI: true,
    ///Mode: _opt && _opt.key && _opt.key.KHONG_DATCOC === false ? 'DAT_COC' : 'NAP_VI',

    //on app
    TypeDesc: {
      MUA_HANG: "Tích lũy mua hàng",
      THANH_TOAN_DH: "Thanh toán đơn hàng",
      NAP_QUY: "Nạp tiền ví điện tử",
    },
  };

  GroupItem() {
    var t = this;
    var data = t.data;
    data.Items.forEach(function (x) {
      var _z = null;
      t.data.Grouped.every(function (z) {
        if (eq(x, z)) _z = z;
        return _z === null;
      });
      if (_z === null) {
        data.Grouped.push(x);
      } else {
        _z.Value += x.Value;
      }

      switch (x.Source) {
        case "OrderEnt":
        case "vOrderEnt":
          if (
            data.remainPayed.OrderIDs &&
            (data.remainPayed.OrderIDs.indexOf(x.SourceID) > -1 ||
              data.remainPayed.OrderIDs.indexOf(x.RefOrderID) > -1)
          )
            x.IsOrderRemainPay = true;
          break;
        case "OrderItemEnt":
        case "vOrderItemEnt":
          if (
            data.remainPayed.OrderItemIDs &&
            (data.remainPayed.OrderItemIDs.indexOf(x.SourceID) > -1 ||
              data.remainPayed.OrderIDs.indexOf(x.RefOrderID) > -1)
          )
            x.IsOrderRemainPay = true;
          break;
      }
    });
  }
  sumAvai(NAP_VI, NoOrderRemainPay) {
    var tt = 0;
    var data = this.data;
    data.Grouped.forEach(function (x) {
      var v = 0;
      if (NAP_VI && x.Desc.indexOf("DATCOC:") !== 0) v = x.Value;
      if (!NAP_VI && x.Desc.indexOf("DATCOC:") === 0) v = x.Value;

      if (x.IsOrderRemainPay && NoOrderRemainPay === undefined) {
        //Đơn hàng chưa thanh toán hết, các khoản tích lũy sẽ ko đc cộng dồn
        //Giá trị có thể âm trong th khấu trừ trả hàng
        v = v > 0 ? 0 : v; //2020-10/20: fixed tạm tích luuyx sẽ ko đc tính, nếu chưa thanh toán hết. các th còn lại đều đc tính
        //* có rất nhiều th cần xem xết cẩn thận
      }

      tt += v;
    });
    return tt;
  }
  totalWallet() {
    return this.data.Grouped.reduce((n, { Value }) => n + Value, 0);
  }
  availableWallet() {
    return this.data.Grouped.filter((item) => {
      if (
        item.Type !== "THANH_TOAN_DH" &&
        item?.ReturnOfID > 0 &&
        item.Order &&
        item.Order.RemainPay !== 0
      ) {
        return false;
      }
      return item.Type === "MUA_HANG" ||
        item.Type === "GIOI_THIEU" ||
        item.Type === "CHIA_SE_MAGIAMGIA"
        ? item.Order?.RemainPay === 0
        : item;
    }).reduce((n, { Value }) => n + Value, 0);
  }
  calc() {
    var data = this.data;
    data.Items.forEach(function (x) {
      var c = null;

      if (data.Cashs)
        data.Cashs.every(function (z) {
          if (z.SourceID === x.ID) c = z.Value;
          return c === null;
        });

      x.CashValue = c || 0;
    });
  }
  constructor(rt) {
    var t = this;
    t.data.Grouped.length = 0;
    t.data.Items = rt.data || [];
    t.data.Cashs = rt.cash || [];
    t.data.remainPayed = rt.remainPayed;
    t.calc();
    t.GroupItem();
  }
}

export default WalletMM;
