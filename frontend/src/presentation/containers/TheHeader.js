import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CBreadcrumbRouter,
} from "@coreui/react";
import ApuLogo from "../assets/svg/apu-logo-horizontal.svg";
import useAuth from "src/presentation/hooks/useAuth";

// routes config
import {
  _routesGeneral,
  _routesComun,
  _routesAdmin,
  _routesProve,
} from "src/main/router/router";

import { TheHeaderDropdown } from "./index";

const TheHeader = ({ setRefreshCheckLogin }) => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const user = useAuth();

  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    setRoutes((searches) => searches.concat(_routesComun));
    if (user.user.roles.find((item) => item.role === "GENERAL")) {
      setRoutes((searches) => searches.concat(_routesGeneral));
    }
    if (user.user.roles.find((item) => item.role === "PROVE")) {
      setRoutes((searches) => searches.concat(_routesProve));
    }
    if (user.user.roles.find((item) => item.role === "ADMIN")) {
      setRoutes((searches) => searches.concat(_routesAdmin));
    }
    // eslint-disable-next-line
  }, []);

  const toggleSidebar = () => {
    const val = [true, "responsive"].includes(sidebarShow)
      ? false
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow)
      ? true
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="mx-auto d-lg-none" to="/">
        <img src={ApuLogo} height={50} alt="Logo" />
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto">
        {user.user.status === "PROVE" ? (
          <></>
        ) : (
          <>
            <CHeaderNavItem className="px-3">
              <CHeaderNavLink
                href="https://apptalentohumano.uleam.edu.ec/menu/"
                target="_blank"
              >
                Rol de pago
              </CHeaderNavLink>
            </CHeaderNavItem>
            <CHeaderNavItem className="px-3">
              <CHeaderNavLink to="/presupuesto">
                Presupuesto Anuales
              </CHeaderNavLink>
            </CHeaderNavItem>
            <CHeaderNavItem className="px-3">
              <CHeaderNavLink to="/informes">Informe de gestión</CHeaderNavLink>
            </CHeaderNavItem>
          </>
        )}
      </CHeaderNav>

      <CHeaderNav className="px-3">
        <TheHeaderDropdown setRefreshCheckLogin={setRefreshCheckLogin} />
      </CHeaderNav>

      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter
          className="border-0 c-subheader-nav m-0 px-0 px-md-3"
          routes={routes}
        />
      </CSubheader>
    </CHeader>
  );
};

export default TheHeader;
