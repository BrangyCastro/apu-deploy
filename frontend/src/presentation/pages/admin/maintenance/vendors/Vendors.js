import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CTabContent,
  CTabPane,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { getVendorsApi, getAllsUserApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { Error } from "src/presentation/components";
import { TableVendors, NewVendorsForm, TableDeleteVendors } from "./components";

const Vendors = () => {
  const [active, setActive] = useState(0);
  const [state, setState] = useState({
    vendors: [],
    user: [],
    error: "",
    reload: false,
    loadingVendors: false,
    loadingUser: false,
  });

  const reload = () =>
    setState((old) => ({
      faculty: [],
      user: [],
      error: "",
      reload: !old.reload,
      loadingVendors: !old.loadingVendors,
      loadingUser: !old.loadingUser,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Proveedores";
    // eslint-disable-next-line
  }, [state.reload]);

  useEffect(() => {
    if (active === 0) {
      getVendors("ACTIVE");
      return;
    }
    if (active === 2) {
      getAllsUser("PROVE");
      return;
    }
    if (active === 1) {
      getVendors("INACTIVE");
      return;
    }
    // eslint-disable-next-line
  }, [state.reload, active]);

  const getVendors = async (status) => {
    setState((old) => ({ ...old, loadingVendors: true }));

    try {
      const response = await getVendorsApi({ status });
      setState((old) => ({
        ...old,
        vendors: response,
        loadingVendors: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const getAllsUser = async (status) => {
    setState((old) => ({ ...old, loadingUser: true }));

    try {
      const response = await getAllsUserApi(status);
      setState((old) => ({
        ...old,
        user: response,
        loadingUser: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  return (
    <div>
      {state.error ? (
        <Error error={state.error} reload={reload} />
      ) : (
        <CCard>
          <CCardBody>
            <CTabs
              activeTab={active}
              onActiveTabChange={(idx) => setActive(idx)}
            >
              <CNav variant="tabs">
                <CNavItem>
                  <CNavLink>
                    <CIcon name="cil-building" />
                    {active === 0 && " Lista de proveedores"}
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink>
                    <CIcon name="cil-factory-slash" />
                    {active === 1 && " Proveedores eliminados"}
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink>
                    <CIcon name="cil-plus" /> Nuevo proveedor
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane>
                  <TableVendors data={state} reload={reload} />
                </CTabPane>
                <CTabPane>
                  <TableDeleteVendors data={state} reload={reload} />
                </CTabPane>
                <CTabPane>
                  <NewVendorsForm data={state} reload={reload} />
                </CTabPane>
              </CTabContent>
            </CTabs>
          </CCardBody>
        </CCard>
      )}
    </div>
  );
};

export default Vendors;
