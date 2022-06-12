import React, { useEffect, useState } from "react";
import { CRow } from "@coreui/react";
import { getExtensionApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { Error, Loading } from "src/presentation/components";
import { ItemExtension } from "./components/ItemExtension";

const Extension = () => {
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
    getExtensionAlls("ACTIVE");
    // eslint-disable-next-line
  }, [state.reload]);

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
        <>
          {state.loading ? (
            <Loading />
          ) : (
            <CRow>
              {state.extension.map((item) => (
                <ItemExtension data={item} key={item.id} />
              ))}
            </CRow>
          )}
        </>
      )}
    </div>
  );
};

export default Extension;
