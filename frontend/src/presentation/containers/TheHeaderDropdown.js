import React from "react";
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { logoutApi } from "src/domain/services";
import useAuth from "src/presentation/hooks/useAuth";
import { Avatar } from "src/presentation/components";

const TheHeaderDropdown = ({ setRefreshCheckLogin }) => {
  const user = useAuth();

  const logout = () => {
    logoutApi();
    setRefreshCheckLogin(true);
  };

  return (
    <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <Avatar size="small" name={user.user.nombres} />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem to="/perfil">
          <CIcon name="cil-user" className="mfe-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem onClick={logout}>
          <CIcon name="cil-lock-locked" className="mfe-2" />
          Cerrar sesión
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default TheHeaderDropdown;
