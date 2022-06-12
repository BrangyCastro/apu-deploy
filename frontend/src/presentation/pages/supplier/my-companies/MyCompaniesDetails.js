import React, { useState, useEffect } from "react";
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
import { getVendorsAndUserIdApi } from "src/domain/services";
import { Error, Loading } from "src/presentation/components";
import { useErrorHandler } from "src/presentation/hooks";
import useAuth from "src/presentation/hooks/useAuth";
import {
  MyCompaniesPreview,
  EditMyCompanies,
  EditAvatarMyCompanies,
} from "./components";

export const MyCompaniesDetails = ({ match }) => {
  const { params } = match;
  const user = useAuth();
  const [active, setActive] = useState(0);
  const [state, setState] = useState({
    vendors: {},
    error: "",
    reload: false,
    loadingVendors: true,
  });

  const reload = () =>
    setState((old) => ({
      vendors: {},
      error: "",
      reload: !old.reload,
      loadingVendors: !old.loadingVendors,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Mis compañias";
    getVendorsAndUserId(params.id, user.user.id);
    // eslint-disable-next-line
  }, [params.id, state.reload]);

  const getVendorsAndUserId = async (id, userId) => {
    setState((old) => ({ ...old, loadingVendors: true }));
    try {
      const response = await getVendorsAndUserIdApi(id, userId);
      setState((old) => ({
        ...old,
        vendors: response,
        loadingVendors: false,
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
          {state.loadingVendors ? (
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
                        <CIcon name="cil-pencil" />
                        {active === 0 && " Editar datos"}
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
                        <CIcon name="cil-building" /> Datos de la empresa
                      </CNavLink>
                    </CNavItem>
                  </CNav>
                  <CTabContent>
                    <CTabPane>
                      <EditMyCompanies data={state} reload={reload} />
                    </CTabPane>
                    <CTabPane>
                      <EditAvatarMyCompanies data={state} reload={reload} />
                    </CTabPane>
                    <CTabPane>
                      <MyCompaniesPreview data={state} />
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

export default withRouter(MyCompaniesDetails);
