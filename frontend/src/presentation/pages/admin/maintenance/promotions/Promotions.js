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
import { getPromotionsAllsApi, getVendorsApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { Error } from "src/presentation/components";
import { TablePromotions, NewPromotionsForm } from "./components";

const Promotions = () => {
  const [active, setActive] = useState(0);

  const [state, setState] = useState({
    promotions: [],
    vendors: [],
    error: "",
    reload: false,
    loading: false,
    loadingVendors: false,
  });

  const reload = () =>
    setState((old) => ({
      promotions: [],
      vendors: [],
      error: "",
      reload: !old.reload,
      loading: !old.loading,
      loadingVendors: !old.loadingVendors,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Promociones";
    getPromotionsAlls();
    getVendors("ACTIVE");
    // eslint-disable-next-line
  }, [state.reload]);

  const getPromotionsAlls = async () => {
    setState((old) => ({ ...old, loading: true }));

    try {
      const response = await getPromotionsAllsApi();
      setState((old) => ({
        ...old,
        promotions: response,
        loading: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const getVendors = async (status) => {
    setState((old) => ({ ...old, loadingVendors: true }));

    try {
      const response = await getVendorsApi(status);

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
        <CCard>
          <CCardBody>
            <CTabs
              activeTab={active}
              onActiveTabChange={(idx) => setActive(idx)}
            >
              <CNav variant="tabs">
                <CNavItem>
                  <CNavLink>
                    <CIcon name="cil-gift" />
                    {active === 0 && " Lista de promociones"}
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink>
                    <CIcon name="cil-plus" /> Nueva promoción
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane>
                  <TablePromotions data={state} reload={reload} />
                </CTabPane>
                <CTabPane>
                  <NewPromotionsForm reload={reload} data={state} />
                </CTabPane>
              </CTabContent>
            </CTabs>
          </CCardBody>
        </CCard>
      )}
    </div>
  );
};

export default Promotions;
