import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLayout } from "../../layout/LayoutProvider";

const ProtectedNavLink = ({ children, to }) => {
  const { AccessToken } = useLayout();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const onNavigate = () => {
    if (!AccessToken) {
      navigate(`${pathname}?fromProtected=${to}`);
    } else {
      navigate(to);
    }
  };
  return (
    <>
      {children({
        onClick: onNavigate,
      })}
    </>
  );
};

export default ProtectedNavLink;
