import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CForm,
  CInput,
  CFormGroup,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CInputGroupAppend,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { getPromotionsApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { Error, Loading } from "src/presentation/components";
import NotPromotions from "src/presentation/assets/svg/heartbroken-bro.svg";
import { ItemPromotions } from "./components";

const Promotions = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [state, setState] = useState({
    promotions: [],
    error: "",
    reload: false,
    loadingPromotions: false,
  });

  const reload = () =>
    setState((old) => ({
      promotions: [],
      error: "",
      reload: !old.reload,
      loadingPromotions: !old.loadingPromotions,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Promociones";
    getPromotions("PUBLICO");
    // eslint-disable-next-line
  }, [state.reload]);

  const getPromotions = async (statusProve) => {
    setState((old) => ({ ...old, loadingPromotions: true }));
    try {
      const response = await getPromotionsApi({ statusProve });
      setState((old) => ({
        ...old,
        promotions: response,
        loadingPromotions: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const handleSearchKeyword = async (keyword) => {
    setSearchKeyword(keyword);
    try {
      const response = await getPromotionsApi({
        keyboard: keyword,
        status: "PUBLICO",
      });
      setState((old) => ({
        ...old,
        promotions: response,
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
          {state.loadingPromotions ? (
            <Loading />
          ) : (
            <>
              <CCard>
                <CCardBody>
                  <CForm>
                    <CFormGroup className="m-0">
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>Buscar</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                          type="text"
                          id="password3"
                          name="password3"
                          autoComplete="current-password"
                          placeholder="Buscar por el nombre del proveedor..."
                          defaultValue={searchKeyword}
                          onChange={(e) => handleSearchKeyword(e.target.value)}
                        />
                        <CInputGroupAppend>
                          <CInputGroupText>
                            <CIcon name="cil-zoom" />
                          </CInputGroupText>
                        </CInputGroupAppend>
                      </CInputGroup>
                    </CFormGroup>
                  </CForm>
                </CCardBody>
              </CCard>
              <CRow>
                {state.promotions.length > 0 ? (
                  <>
                    {state.promotions.map((item) => (
                      <ItemPromotions key={item.id} data={item} />
                    ))}
                  </>
                ) : (
                  <CCol xl="12">
                    <img
                      src={NotPromotions}
                      alt="Buscar"
                      style={{
                        width: "320px",
                        margin: "auto",
                        display: "block",
                      }}
                    />
                    <h2 className="d-flex justify-content-center">
                      No se encontró ninguna promoción...
                    </h2>
                  </CCol>
                )}
              </CRow>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Promotions;
