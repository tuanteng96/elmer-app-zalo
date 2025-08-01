import { openWebview } from "zmp-sdk";
import { formatString } from "./formatString";

export const transferNavigation = ({
  navigate,
  to,
  useLocation,
  data,
  open,
}) => {
  let { pathname, search } = useLocation;
  let splitUrl = to.split("/");
  if (!to) {
    //navigate(`/adv/${data.ID}`);
  }
  else if (to.includes("/wallet/")) {
    if (to.includes("tab=card")) {
      navigate("/user/customer-wallet-card?Type=Card");
    } else {
      navigate("/user/customer-wallet-card");
    }
  } else if (to.includes("/maps/")) {
    navigate("/user/customer-branch");
  } else if (to.includes("/cardservice/")) {
    navigate("/user/customer-service");
  } else if (to.includes("/adv/")) {
    navigate("/adv/" + splitUrl[2]);
  } else if (to.includes("/news-list/")) {
    navigate("/news");
  } else if (to.includes("/news/detail/")) {
    navigate("/news/" + splitUrl[3]);
  } else if (to.includes("/shop/")) {
    if (
      typeof Number(splitUrl[2]) === "number" &&
      !formatString.getParameter({ key: "ids", url: to })
    ) {
      let TypeID = formatString.getParameter({ key: "TypeID", url: to });
      if (TypeID) {
        let urlRemoveParam = formatString.removeParameter("TypeID", to);
        navigate(
          `/catalogue?TypeID=${TypeID}&CateID=${urlRemoveParam.split("/")[2]}`,
          {
            state: {
              prevState: pathname + search,
            },
          },
        );
      } else if (to.includes("/shop/selected/")) {
        navigate(`/catalogue/service/${splitUrl[3]}`, {
          state: {
            prevState: pathname + search,
          },
        });
      } else {
        navigate(`/catalogue?TypeID=${splitUrl[2]}`, {
          state: {
            prevState: pathname + search,
          },
        });
      }
    }
    if (
      typeof Number(splitUrl[2]) === "number" &&
      formatString.getParameter({ key: "ids", url: to })
    ) {
      let dvgocId = formatString.getParameter({ key: "ids", url: to });
      let paramCateId = formatString.getParameter({ key: "cateid", url: to });
      let cateid = splitUrl[2];
      if (Number(splitUrl[2]) === Number(paramCateId)) {
        navigate(`/catalogue?TypeID=${paramCateId}&SheetID=${dvgocId}`, {
          state: {
            prevState: pathname + search,
          },
        });
      } else {
        navigate(
          `/catalogue?TypeID=${paramCateId}&CateID=${cateid}&SheetID=${dvgocId}`,
        );
      }
    }
    if (splitUrl && splitUrl.length > 1 && splitUrl[2] === "detail") {
      navigate(`/catalogue/${splitUrl[3]}`, {
        state: {
          prevState: pathname + search,
        },
      });
    }
    if (to.includes("/shop/list/")) {
      let urlRemoveParam = formatString.removeParameter("cateid", to);
      navigate(
        `catalogue?TypeID=${splitUrl[3]}&CateID=${
          urlRemoveParam.split("/")[4]
        }`,
        {
          state: {
            prevState: pathname + search,
          },
        },
      );
    }
  } else if (to.includes("/voucher")) {
    navigate("/user/customer-voucher");
  } else if (to.includes("/schedule/")) {
    let ID = formatString.getParameter({ key: "SelectedId", url: to });
    navigate("/booking", {
      state: {
        prevState: pathname + search,
        formState: {
          Roots: [
            {
              ID: Number(ID),
            },
          ],
        },
      },
    });
  } else if (to.includes("/pupup-contact/")) {
    open();
    // navigate("/contact", {
    //   state: {
    //     formState: data,
    //   },
    // });
  } else if (formatString.validURL(to)) {
    openWebview({
      url: to,
    });
  }
};
