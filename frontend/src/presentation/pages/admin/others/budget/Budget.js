import React, { useEffect, useState } from "react";
import { CRow, CCol, CCard, CCardBody } from "@coreui/react";
import { getBudgetAllsApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { Error, Loading } from "src/presentation/components";
import { NewBudgetForm, TableBudget, EditBudgetForm } from "./components";

const Budget = () => {
  const [activeEdit, setActiveEdit] = useState(false);
  const [dataEdit, setDataEdit] = useState(null);
  const [state, setState] = useState({
    budget: [],
    error: "",
    reload: false,
    loading: true,
  });

  const reload = () =>
    setState((old) => ({
      budget: [],
      error: "",
      reload: !old.reload,
      loading: !old.loading,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Presupuesto";
    getBudgetAlls();
    // eslint-disable-next-line
  }, [state.reload]);

  const getBudgetAlls = async () => {
    setState((old) => ({ ...old, loading: true }));
    try {
      const response = await getBudgetAllsApi();
      setState((old) => ({
        ...old,
        budget: response,
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
                <div className="alert alert-warning">
                  <p className="h6">IMPORTANTE</p>
                  <ul style={{ marginLeft: "25px" }}>
                    <li type="disc">
                      Solo permite ingresar archivo en <strong>PDF</strong>.
                    </li>
                    <li type="disc">
                      Al momento de actualizar un presupuesto solo seleccione un
                      archivo si en caso se desea actualizar, caso contrario
                      dejar en blanco ese campo.
                    </li>
                  </ul>
                </div>
                <CRow>
                  <CCol md="4" xl="4">
                    {activeEdit ? (
                      <EditBudgetForm
                        reload={reload}
                        data={dataEdit}
                        setActiveEdit={setActiveEdit}
                      />
                    ) : (
                      <NewBudgetForm reload={reload} />
                    )}
                  </CCol>
                  <CCol md="8" xl="8">
                    <TableBudget
                      data={state}
                      reload={reload}
                      setActiveEdit={setActiveEdit}
                      setDataEdit={setDataEdit}
                    />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          )}
        </>
      )}
    </div>
  );
};

export default Budget;
