import React, { useState, useEffect } from "react";
import { CRow } from "@coreui/react";
import { getBudgetPublicAllsApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { Error, Loading } from "src/presentation/components";
import { ItemBudget } from "./components";

const Budget = () => {
  const [state, setState] = useState({
    budget: [],
    error: "",
    reload: false,
    loading: false,
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
    getBudgetPublicAlls();
    // eslint-disable-next-line
  }, [state.reload]);

  const getBudgetPublicAlls = async () => {
    setState((old) => ({ ...old, loading: true }));
    try {
      const response = await getBudgetPublicAllsApi();
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
            <CRow>
              {state.budget.map((item) => (
                <ItemBudget data={item} key={item.id} />
              ))}
            </CRow>
          )}
        </>
      )}
    </div>
  );
};

export default Budget;
