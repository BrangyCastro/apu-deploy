import React, { useState, useEffect } from "react";
import { CCard, CCardBody } from "@coreui/react";
import { getAllsUserApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { Error, Loading } from "src/presentation/components";
import { TableAffiliates } from "./components";

const Affiliates = () => {
  const [state, setState] = useState({
    user: [],
    error: "",
    reload: false,
    loadingUser: false,
  });

  const reload = () =>
    setState((old) => ({
      user: [],
      error: "",
      reload: !old.reload,
      loadingUser: !old.loadingUser,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Afiliados";
    getAllsUser("ACTIVE");
    // eslint-disable-next-line
  }, [state.reload]);

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
        <>
          {state.loadingUser ? (
            <Loading />
          ) : (
            <CCard>
              <CCardBody>
                <TableAffiliates data={state} />
              </CCardBody>
            </CCard>
          )}
        </>
      )}
    </div>
  );
};

export default Affiliates;
