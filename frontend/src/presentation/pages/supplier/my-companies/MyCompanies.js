import React, { useState, useEffect } from "react";
import { CRow } from "@coreui/react";
import { getVendorsApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { Error, Loading } from "src/presentation/components";
import useAuth from "src/presentation/hooks/useAuth";
import { ItemMyCompanies } from "./components";

const MyCompanies = () => {
  const user = useAuth();

  const [state, setState] = useState({
    vendors: [],
    error: "",
    reload: false,
    loadingVendors: false,
  });

  const reload = () =>
    setState((old) => ({
      vendors: [],
      error: "",
      reload: !old.reload,
      loadingVendors: !old.loadingVendors,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Mis compañias";
    getAllsVendors({ userId: user.user.id });
    // eslint-disable-next-line
  }, [state.reload]);

  const getAllsVendors = async (status) => {
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
          {state.loadingVendors ? (
            <Loading />
          ) : (
            <CRow>
              {state.vendors.map((item) => (
                <ItemMyCompanies key={item.id} data={item} />
              ))}
            </CRow>
          )}
        </>
      )}
    </div>
  );
};

export default MyCompanies;
