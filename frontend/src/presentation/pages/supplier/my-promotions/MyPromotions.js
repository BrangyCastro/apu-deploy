import React, { useState, useEffect } from "react";
import { CCard, CCardBody, CButton, CRow } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { Link } from "react-router-dom";
import { getPromotionsApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import useAuth from "src/presentation/hooks/useAuth";
import { TablePromotions, ItemPromotions } from "./components";

const MyPromotions = () => {
  const { user } = useAuth();
  const [state, setState] = useState({
    promotions: [],
    error: "",
    reload: false,
    loading: false,
  });
  const [mode, setMode] = useState(true);

  const reload = () =>
    setState((old) => ({
      promotions: [],
      error: "",
      reload: !old.reload,
      loading: !old.loading,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Mis Promociones";
    getPromotions(user.id);
    // eslint-disable-next-line
  }, [state.reload]);

  const getPromotions = async (idUser) => {
    setState((old) => ({ ...old, loading: true }));

    try {
      const response = await getPromotionsApi({ idUser });
      setState((old) => ({
        ...old,
        promotions: response,
        loading: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const activeMode = () => {
    setMode(!mode);
  };

  return (
    <div>
      <CCard>
        <CCardBody>
          <div className="d-flex justify-content-between">
            <div>
              <CButton
                variant="ghost"
                color="info"
                className="mr-1"
                active={mode ? true : false}
                onClick={activeMode}
              >
                <CIcon name="cil-menu" />
              </CButton>
              <CButton
                variant="ghost"
                color="info"
                active={mode ? false : true}
                onClick={activeMode}
              >
                <CIcon name="cil-applications" />
              </CButton>
            </div>
            <Link to="/mis-promociones/nuevo">
              <CButton variant="outline" color="primary">
                <CIcon name="cil-plus" /> Nueva Promoción
              </CButton>
            </Link>
          </div>
          {mode ? (
            <TablePromotions data={state} reload={reload} />
          ) : (
            <CRow className="mt-3">
              {state.promotions.map((item) => (
                <ItemPromotions key={item.id} data={item} reload={reload} />
              ))}
            </CRow>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default MyPromotions;
