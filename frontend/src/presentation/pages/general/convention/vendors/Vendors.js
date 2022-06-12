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
import { getVendorsApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { Error, Loading } from "src/presentation/components";
import NotPromotions from "src/presentation/assets/svg/heartbroken-bro.svg";
import { ItemVendors } from "./components";

const Vendors = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
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
    document.title = "APU | Proveedores";
    getVendors({ publico: true });
    // eslint-disable-next-line
  }, [state.reload]);

  const getVendors = async (status) => {
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

  const handleSearchKeyword = async (keyword) => {
    setSearchKeyword(keyword);
    try {
      const response = await getVendorsApi({
        keyboard: keyword,
        publico: true,
      });
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
                {state.vendors.length > 0 ? (
                  <>
                    {state.vendors.map((item) => (
                      <ItemVendors key={item.id} data={item} />
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
                      No se encontró ningún proveedor...
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

export default Vendors;
