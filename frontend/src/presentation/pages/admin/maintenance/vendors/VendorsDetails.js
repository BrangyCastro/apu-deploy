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
import { withRouter } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { getVendorsIdApi, getAllsUserProveApi } from "src/domain/services";
import { Error, Loading } from "src/presentation/components";
import { useErrorHandler } from "src/presentation/hooks";
import {
  EditVendorsForm,
  EditAvatarVendors,
  ListConvention,
} from "./components";

const VendorsDetails = ({ match }) => {
  const { params } = match;

  const [active, setActive] = useState(0);
  const [state, setState] = useState({
    vendors: {},
    user: [],
    error: "",
    reload: false,
    loadingVendors: true,
    loadingUser: true,
  });

  const reload = () =>
    setState((old) => ({
      vendors: {},
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
    document.title = "APU | Proveedor";
    getVendorsId(params.id);
    getAllsUser("PROVE");

    // eslint-disable-next-line
  }, [params.id, state.reload]);

  const getVendorsId = async (id) => {
    setState((old) => ({ ...old, loadingVendors: true }));
    try {
      const response = await getVendorsIdApi(id);
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
      const response = await getAllsUserProveApi(status);
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
        <>
          {state.loadingVendors || state.loadingUser ? (
            <Loading />
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
                        {active === 0 && " Datos de la empresa"}
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink>
                        <CIcon name="cil-contact" />
                        {active === 1 && " Fotos"}
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink>
                        <CIcon name="cil-library" />
                        {active === 2 && " Convenios"}
                      </CNavLink>
                    </CNavItem>
                  </CNav>
                  <CTabContent>
                    <CTabPane>
                      <EditVendorsForm data={state} reload={reload} />
                    </CTabPane>
                    <CTabPane>
                      <EditAvatarVendors data={state} reload={reload} />
                    </CTabPane>
                    <CTabPane>
                      <ListConvention data={state} />
                    </CTabPane>
                  </CTabContent>
                </CTabs>
              </CCardBody>
            </CCard>
          )}
        </>
      )}
    </div>
  );
};

export default withRouter(VendorsDetails);
