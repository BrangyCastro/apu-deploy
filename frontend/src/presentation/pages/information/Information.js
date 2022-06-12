import React, { useState, useEffect } from "react";
import { CRow } from "@coreui/react";
import { getInformationPublicAllsApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { Error, Loading } from "src/presentation/components";
import { ItemInformation } from "./components";

const Information = () => {
  const [state, setState] = useState({
    information: [],
    error: "",
    reload: false,
    loading: false,
  });

  const reload = () =>
    setState((old) => ({
      information: [],
      error: "",
      reload: !old.reload,
      loading: !old.loading,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Informes";
    getInformationPublicAlls();
    // eslint-disable-next-line
  }, [state.reload]);

  const getInformationPublicAlls = async () => {
    setState((old) => ({ ...old, loading: true }));
    try {
      const response = await getInformationPublicAllsApi();
      setState((old) => ({
        ...old,
        information: response,
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
            <CRow>
              {state.information.map((item) => (
                <ItemInformation data={item} key={item.id} />
              ))}
            </CRow>
          )}
        </>
      )}
    </div>
  );
};

export default Information;
