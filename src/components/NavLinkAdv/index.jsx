import React from "react";
import { useLocation } from "react-router";
import { useNavigate } from "zmp-ui";
import { transferNavigation } from "../../utils/transferNavigation";
import { PickerContact } from "../PickerContact/PickerContact";

const NavLinkAdv = ({ children, to, data, ...props }) => {
  const navigate = useNavigate();
  let { pathname, search } = useLocation();

  return (
    <PickerContact initialValues={data}>
      {({ open }) => (
        <div
          {...props}
          data-href={to}
          onClick={() =>
            transferNavigation({
              useLocation: { pathname, search },
              to,
              navigate,
              data,
              open,
            })
          }
        >
          {children}
        </div>
      )}
    </PickerContact>
  );
};

export { NavLinkAdv };
