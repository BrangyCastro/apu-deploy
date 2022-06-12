import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from "@coreui/react";
import ApuLogo from "src/presentation/assets/svg/apu-logo-blanco.svg";
import useAuth from "../hooks/useAuth";

// sidebar nav config
import { _navGeneral, _navAdmin, _navProve, _navComun } from "./_nav";

const TheSidebar = () => {
  const user = useAuth();
  const dispatch = useDispatch();
  const show = useSelector((state) => state.sidebarShow);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    setMenu((searches) => searches.concat(_navComun));
    if (user.user.roles.find((item) => item.role === "GENERAL")) {
      setMenu((searches) => searches.concat(_navGeneral));
    }
    if (user.user.roles.find((item) => item.role === "PROVE")) {
      setMenu((searches) => searches.concat(_navProve));
    }
    if (user.user.roles.find((item) => item.role === "ADMIN")) {
      setMenu((searches) => searches.concat(_navAdmin));
    }
    // eslint-disable-next-line
  }, []);

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({ type: "set", sidebarShow: val })}
      colorScheme="primary"
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        <img
          src={ApuLogo}
          height={80}
          className="c-sidebar-brand-full"
          alt="Logo"
        />
        <img
          src={ApuLogo}
          height={20}
          className="c-sidebar-brand-minimized"
          alt="Logo"
        />
      </CSidebarBrand>
      <CSidebarNav>
        <CCreateElement
          items={menu}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
