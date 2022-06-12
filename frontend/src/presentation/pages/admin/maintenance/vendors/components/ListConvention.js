import React, { useState, useEffect } from "react";
import { CCol, CRow } from "@coreui/react";
import { getConventionIdApi } from "src/domain/services";
import { Error, Loading } from "src/presentation/components";
import { useErrorHandler } from "src/presentation/hooks";
import { NewConventionForm } from "./NewConventionForm";
import { EditConventionForm } from "./EditConventionForm";
import { TableConvention } from "./TableConvention";

export const ListConvention = ({ data }) => {
  const { id } = data.vendors;

  const [activeEdit, setActiveEdit] = useState(false);
  const [dataEdit, setDataEdit] = useState(null);
  const [state, setState] = useState({
    convention: [],
    error: "",
    reload: false,
    loading: true,
  });

  const reload = () =>
    setState((old) => ({
      convention: [],
      error: "",
      reload: !old.reload,
      loading: !old.loading,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    getConventionId(id);
    // eslint-disable-next-line
  }, [id, state.reload]);

  const getConventionId = async (id) => {
    setState((old) => ({ ...old, loading: true }));
    try {
      const response = await getConventionIdApi(id);
      setState((old) => ({
        ...old,
        convention: response,
        loading: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  return (
    <div className="p-3">
      {state.error ? (
        <Error error={state.error} reload={reload} />
      ) : (
        <>
          {state.loading ? (
            <Loading />
          ) : (
            <>
              <div className="alert alert-warning">
                <p className="h6">IMPORTANTE</p>
                <ul style={{ marginLeft: "25px" }}>
                  <li type="disc">
                    Solo permite ingresar archivo en <strong>PDF</strong>.
                  </li>
                  <li type="disc">
                    Al momento de actualizar un convenio solo seleccione un
                    archivo si en caso se desea actualizar, caso contrario dejar
                    en blanco ese campo.
                  </li>
                </ul>
              </div>
              <CRow>
                <CCol md="5" xl="4">
                  {activeEdit ? (
                    <EditConventionForm
                      setActiveEdit={setActiveEdit}
                      dataEdit={dataEdit}
                      reload={reload}
                    />
                  ) : (
                    <NewConventionForm reload={reload} id={id} />
                  )}
                </CCol>
                <CCol md="7" xl="8">
                  <TableConvention
                    data={state}
                    reload={reload}
                    setActiveEdit={setActiveEdit}
                    setDataEdit={setDataEdit}
                  />
                </CCol>
              </CRow>
            </>
          )}
        </>
      )}
    </div>
  );
};
