import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CForm,
  CButton,
  CFormGroup,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CLabel,
  CCol,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import DatePicker from "react-datepicker";
import { useForm, Controller } from "react-hook-form";
import { getTthhPagosReportsUserApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { Error, Loading } from "src/presentation/components";
import useAuth from "src/presentation/hooks/useAuth";
import reportsImg from "src/presentation/assets/svg/misReportes.svg";
import NotFound from "src/presentation/assets/svg/blue-monday-bro.svg";
import { ItemReports } from "./components";

const Reports = () => {
  const user = useAuth();

  const { errors, handleSubmit, control, reset } = useForm();

  const [formDataSearch, setFormDataSearch] = useState({
    mesInicio: null,
    mesFin: null,
  });

  const [state, setState] = useState({
    reports: [],
    activeSearch: true,
    error: "",
    reload: false,
    loading: false,
  });

  const reload = () =>
    setState((old) => ({
      reports: [],
      error: "",
      reload: !old.reload,
      loading: !old.loading,
      activeSearch: !old.activeSearch,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Reportes";
  }, [state.reload]);

  const onSubmit = async (data) => {
    setState((old) => ({ ...old, loading: true }));
    try {
      const response = await getTthhPagosReportsUserApi(user.user.id, data);
      setState((old) => ({
        ...old,
        reports: response,
        loading: false,
        activeSearch: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const onClear = () => {
    reset({
      mesInicio: "",
      mesFin: "",
    });
    setFormDataSearch({
      mesInicio: null,
      mesFin: null,
    });
    setState((old) => ({
      reports: [],
      activeSearch: true,
      error: "",
    }));
  };

  return (
    <div>
      {state.error ? (
        <Error error={state.error} reload={reload} />
      ) : (
        <>
          <CCard>
            <CCardBody>
              <CForm onSubmit={handleSubmit(onSubmit)}>
                <CFormGroup className="d-flex justify-content-center">
                  <CLabel className="m-0 h4">Consultar reportes:</CLabel>
                </CFormGroup>
                <CRow className="d-flex justify-content-center">
                  <CFormGroup className="mb-0 mt-2 mt-md-0">
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>Desde</CInputGroupText>
                      </CInputGroupPrepend>
                      <Controller
                        control={control}
                        name="mesInicio"
                        defaultValue={null}
                        rules={{
                          required: {
                            value: true,
                            message: "Campo es requerido",
                          },
                        }}
                        render={({ onChange, value }) => (
                          <DatePicker
                            selectsStart
                            selected={value}
                            onChange={(data) => {
                              onChange(data);
                              setFormDataSearch({
                                ...formDataSearch,
                                mesInicio: data,
                              });
                            }}
                            dateFormat="MMMM-yyyy"
                            showMonthYearPicker
                            showTwoColumnMonthYearPicker
                            locale="es"
                            placeholderText="MM-YYYY"
                            autoComplete="off"
                            startDate={formDataSearch.mesInicio}
                            endDate={formDataSearch.mesFin}
                            className="form-control"
                          />
                        )}
                      />
                    </CInputGroup>
                    <span className="text-danger">
                      {errors.mesInicio && errors.mesInicio.message}
                    </span>
                  </CFormGroup>
                  <CFormGroup className="mb-0 mt-2 mt-md-0">
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>hasta</CInputGroupText>
                      </CInputGroupPrepend>
                      <Controller
                        render={({ onChange, value }) => (
                          <DatePicker
                            name="mesFin"
                            selectsEnd
                            selected={value}
                            onChange={(data) => {
                              onChange(data);
                              setFormDataSearch({
                                ...formDataSearch,
                                mesFin: data,
                              });
                            }}
                            dateFormat="MMMM-yyyy"
                            showMonthYearPicker
                            showTwoColumnMonthYearPicker
                            locale="es"
                            placeholderText="MM-YYYY"
                            autoComplete="off"
                            startDate={formDataSearch.mesInicio}
                            endDate={formDataSearch.mesFin}
                            minDate={formDataSearch.mesInicio}
                            className="form-control"
                          />
                        )}
                        control={control}
                        name="mesFin"
                        defaultValue={null}
                        rules={{
                          required: {
                            value: true,
                            message: "Campo es requerido",
                          },
                        }}
                      />
                    </CInputGroup>
                    <span className="text-danger">
                      {errors.mesFin && errors.mesFin.message}
                    </span>
                  </CFormGroup>
                  <CFormGroup className="mb-0 mt-2 mt-md-0">
                    <CButton
                      type="submit"
                      color="primary"
                      size="sm"
                      className="ml-2"
                      disabled={state.loading}
                    >
                      <CIcon name="cil-zoom" /> Buscar
                    </CButton>
                    <CButton
                      type="button"
                      variant="outline"
                      color="warning"
                      size="sm"
                      className="ml-2"
                      onClick={onClear}
                      disabled={state.loading}
                    >
                      <CIcon name="cil-brush-alt" /> Limpiar
                    </CButton>
                  </CFormGroup>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
          {state.loading ? (
            <Loading />
          ) : (
            <>
              <CRow>
                {state.activeSearch ? (
                  <CCol>
                    <img
                      src={reportsImg}
                      alt="Buscar"
                      style={{
                        width: "400px",
                        margin: "auto",
                        display: "block",
                      }}
                    />
                  </CCol>
                ) : (
                  <>
                    {state.reports.length > 0 ? (
                      <>
                        {state.reports.map((item) => (
                          <ItemReports key={item.id} data={item} />
                        ))}
                      </>
                    ) : (
                      <CCol>
                        <img
                          src={NotFound}
                          alt="Buscar"
                          style={{
                            width: "320px",
                            margin: "auto",
                            display: "block",
                          }}
                        />
                        <h2 className="d-flex justify-content-center">
                          No se encontró ningún reportes...
                        </h2>
                      </CCol>
                    )}
                  </>
                )}
              </CRow>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Reports;
