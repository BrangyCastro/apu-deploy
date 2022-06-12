import React, { useState, useEffect } from "react";
import { CCard, CCardBody } from "@coreui/react";
import { withRouter } from "react-router-dom";
import { getPromotionsApi, getVendorsApi } from "src/domain/services";
import { Error, Loading } from "src/presentation/components";
import { useErrorHandler } from "src/presentation/hooks";
import { EditPromotionsForm } from "./components";

const PromotionsDetails = ({ match }) => {
  const { params } = match;
  const [state, setState] = useState({
    promotions: {},
    vendors: [],
    error: "",
    reload: false,
    loading: true,
    loadingVendors: false,
  });

  const reload = () =>
    setState((old) => ({
      promotions: {},
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
    document.title = "APU | Promoción";
    getPromotionsId(params.id);
    getVendors("ACTIVE");
    // eslint-disable-next-line
  }, [params.id, state.reload]);

  const getPromotionsId = async (id) => {
    setState((old) => ({ ...old, loading: true }));

    try {
      const response = await getPromotionsApi({ id });
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
        <>
          {state.loading ? (
            <Loading />
          ) : (
            <CCard>
              <CCardBody>
                <EditPromotionsForm data={state} />
              </CCardBody>
            </CCard>
          )}
        </>
      )}
    </div>
  );
};

export default withRouter(PromotionsDetails);
