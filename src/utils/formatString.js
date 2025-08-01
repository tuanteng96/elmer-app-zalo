import { ProcessENV } from "./process";

export const formatString = {
  htmlDecode: (content = "") => {
    let e = document.createElement("div");
    e.innerHTML = content;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  },
  formatVND: (price) => {
    if (!price || price === 0) {
      return "0";
    } else {
      return price.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + "đ";
    }
  },
  formatVNDPositive: (price) => {
    if (!price || price === 0) {
      return "0";
    } else {
      return (
        Math.abs(price)
          .toFixed(0)
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + "đ"
      );
    }
  },
  fixedContentDomain: (content) => {
    if (!content) return "";
    return Array.isArray(content)
      ? content.join("").replace(/src=\"\//g, 'src="' + ProcessENV.URL + "/")
      : content.replace(/src=\"\//g, 'src="' + ProcessENV.URL + "/");
  },
  getIdParams: (url) => {
    return url && url.substring(url.lastIndexOf("/") + 1).split("?")[0];
  },
  getNameBank: (item) => {
    let names = item.ngan_hang.split("-");
    return names[names.length - 1];
  },
  getGroupsName: (Auth, InitialValues = "Thông tin cá nhân") => {
    if (
      Auth?.acc_type === "M" &&
      Auth?.acc_group > 0 &&
      Auth?.MemberGroups.length > 0
    ) {
      return Auth?.MemberGroups[0].Title;
    } else if (Auth?.ID === 1) {
      return "Quản trị viên";
    } else {
      return InitialValues;
    }
  },
  getStockName: (ID, Stocks) => {
    const index = Stocks && Stocks.findIndex((x) => x.ID === ID);
    if (index > -1) {
      return Stocks[index].Title;
    }
    return "Không xác định";
  },
  getParameter: ({ key = "", url = "" }) => {
    key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regexS = "[\\?&]" + key + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
  },
  removeParameter: (key, sourceURL) => {
    var rtn = sourceURL.split("?")[0],
      param,
      params_arr = [],
      queryString =
        sourceURL.indexOf("?") !== -1 ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
      params_arr = queryString.split("&");
      for (var i = params_arr.length - 1; i >= 0; i -= 1) {
        param = params_arr[i].split("=")[0];
        if (param === key) {
          params_arr.splice(i, 1);
        }
      }
      if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
  },
  validURL: (url) => {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i",
    ); // fragment locator
    return !!pattern.test(url);
  },
  getServiceStockStr: (str) => {
    let obj = {
      Service: "",
      Stock: ""
    }
    let htmlString = ""
    if(str) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = str;
      htmlString = tempDiv.textContent;
    }
    const text = htmlString || "";
    const regex = /\[(.*?)\]/g;
    const matches = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1]); // Push the captured group
    }
    if(matches && matches.length > 0) {
      obj.Service = matches[0]
    }
    if(matches && matches.length > 1) {
      obj.Stock = matches[1]
    }
    return obj
  }
};
