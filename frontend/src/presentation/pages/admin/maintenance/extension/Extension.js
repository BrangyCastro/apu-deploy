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
import { getExtensionApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { Error } from "src/presentation/components";
import {
  TableExtension,
  NewExtensionForm,
  TableDeleteExtension,
} from "./components";

const Extension = () => {
  const [active, setActive] = useState(0);

  const [state, setState] = useState({
    extension: [],
    error: "",
    reload: false,
    loading: false,
  });

  const reload = () =>
    setState((old) => ({
      extension: [],
      error: "",
      reload: !old.reload,
      loading: !old.loading,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Extensiones";
    if (active === 0) {
      getExtensionAlls("ACTIVE");
      return;
    }
    if (active === 1) {
      getExtensionAlls("INACTIVE");
      return;
    }
    // eslint-disable-next-line
  }, [state.reload, active]);

  const getExtensionAlls = async (status) => {
    setState((old) => ({ ...old, loading: true }));

    try {
      const response = await getExtensionApi(status);
      setState((old) => ({
        ...old,
        extension: response,
        loading: false,
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
                    {active === 0 && " Lista de extensiones"}
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink>
                    <CIcon name="cil-factory-slash" />
                    {active === 1 && " Extensiones eliminados"}
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink>
                    <CIcon name="cil-plus" /> Nueva extensión
                  </CNavLink>
                </CNavItem>
                {/* <CNavItem>
                  <CNavLink>
                    <CIcon name="cil-newspaper" /> Nueva noticia
                  </CNavLink>
                </CNavItem> */}
              </CNav>
              <CTabContent>
                <CTabPane>
                  <TableExtension data={state} reload={reload} />
                </CTabPane>
                <CTabPane>
                  <TableDeleteExtension data={state} reload={reload} />
                </CTabPane>
                <CTabPane>
                  <NewExtensionForm reload={reload} />
                </CTabPane>
                {/* <CTabPane>
                  <NewPromotionsForm reload={reload} data={state} />
                </CTabPane> */}
              </CTabContent>
            </CTabs>
          </CCardBody>
        </CCard>
      )}
    </div>
  );
};

export default Extension;
