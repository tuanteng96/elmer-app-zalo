import React from "react";
import { useLocation } from "react-router";
import { openWebview } from "zmp-sdk";
import { useNavigate } from "zmp-ui";
import { formatString } from "../../utils/formatString";
import { transferNavigation } from "../../utils/transferNavigation";

const HtmlParser = ({ children }) => {
  const navigate = useNavigate();
  let { pathname, search } = useLocation();

  const clickHandler = (e) => {
    const el = e.target.closest("a");
    if (el && e.currentTarget.contains(el)) {
      e.preventDefault();
      let href = el.getAttribute("href");

      if (formatString.validURL(href)) {
        openWebview({
          url: href,
        });
      } else {
        transferNavigation({
          to: href,
          useLocation: { pathname, search },
          navigate,
          data: null,
        });
      }
    }
  };

  return (
    <div
      onClick={clickHandler}
      dangerouslySetInnerHTML={{
        __html: formatString.fixedContentDomain(children),
      }}
    />
  );
};

export { HtmlParser };
