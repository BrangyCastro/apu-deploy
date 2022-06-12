import React, { useState, useEffect } from "react";
import { CCard, CCardBody } from "@coreui/react";
import { withRouter } from "react-router-dom";
import { getExtensionIdApi } from "src/domain/services";
import { Error, Loading } from "src/presentation/components";
import { useErrorHandler } from "src/presentation/hooks";
import { EditExtensionForm } from "./components";

const ExtensionDetails = ({ match }) => {
  const { params } = match;
  const [state, setState] = useState({
    extension: {},
    error: "",
    reload: false,
    loading: true,
  });

  const reload = () =>
    setState((old) => ({
      extension: {},
      error: "",
      reload: !old.reload,
      loading: !old.loading,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Extension";
    getPromotionsId(params.id);
    // eslint-disable-next-line
  }, [params.id, state.reload]);

  const getPromotionsId = async (id) => {
    setState((old) => ({ ...old, loading: true }));

    try {
      const response = await getExtensionIdApi(id);
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
        <>
          {state.loading ? (
            <Loading />
          ) : (
            <CCard>
              <CCardBody>
                <EditExtensionForm data={state} />
              </CCardBody>
            </CCard>
          )}
        </>
      )}
    </div>
  );
};

export default withRouter(ExtensionDetails);
