import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CForm,
  CButton,
  CFormGroup,
  CRow,
  CCol,
  CLabel,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { getAllsMesAnioTthhCustomApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { Loading, Error } from "src/presentation/components";
import HumanTalentImg from "src/presentation/assets/svg/business-plan-animate.svg";
import NotData from "src/presentation/assets/svg/no-data-bro.svg";
import {
  CardApu,
  CardHumanTalent,
  TableApu,
  TableApuError,
  TableTthhPay,
  TableTthhPartial,
  TableTthhEarring,
} from "./components";

const HumanTalent = () => {
  const { errors, handleSubmit, control, reset } = useForm();

  const [show, setShow] = useState({
    tableApu: false,
    tableHumanTalent: false,
  });
  const [state, setState] = useState({
    tthh: [],
    tthhPago: [],
    tthhPagoParcial: [],
    tthhPendiente: [],
    tthhTotal: 0,
    tthhPagoTotal: 0,
    ventaPendiente: [],
    mes: "",
    error: "",
    reload: false,
    activeSearch: true,
    loading: false,
  });

  const reload = () =>
    setState((old) => ({
      tthh: [],
      tthhPago: [],
      tthhPagoParcial: [],
      tthhPendiente: [],
      tthhTotal: 0,
      tthhPagoTotal: 0,
      reload: !old.reload,
      loading: !old.loading,
      activeSearch: !old.activeSearch,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Talento Humano";
  }, [state.reload]);

  const onSubmit = async (data) => {
    setState((old) => ({ ...old, loading: true }));
    const dataTemp = { ...data, status: "PENDIENTE" };
    try {
      const response = await getAllsMesAnioTthhCustomApi(dataTemp);
      setState((old) => ({
        ...old,
        tthh: response.tthh,
        tthhPago: response.tthhPago,
        tthhPagoParcial: response.tthhPagoParcial,
        tthhPendiente: response.tthhPendiente,
        tthhTotal: response.tthhTotal[0].suma,
        tthhPagoTotal: response.tthhPagoTotal[0].suma,
        ventaPendiente: response.ventaPendiente,
        mes: data.mes,
        loading: false,
        activeSearch: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const onClear = () => {
    reset({
      mes: null,
    });
    setState((old) => ({
      tthh: [],
      tthhPago: [],
      tthhTotal: 0,
      tthhPagoTotal: 0,
      activeSearch: true,
      error: "",
      loading: false,
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
              <div className="d-flex justify-content-center mb-2">
                <Link to="/generar-cobros">
                  <CButton
                    variant="outline"
                    color="primary"
                    size="sm"
                    className="mr-2"
                  >
                    <CIcon name="cil-plus" /> Generar Cobro
                  </CButton>
                </Link>
                <Link to="/pagos/talento-humano/nuevo-csv">
                  <CButton
                    variant="outline"
                    color="primary"
                    size="sm"
                    className="mr-2"
                  >
                    <CIcon name="cil-plus" /> Nueva T. Humano CSV
                  </CButton>
                </Link>
                <CButton
                  className="mr-2"
                  variant="outline"
                  color="info"
                  size="sm"
                >
                  <CIcon name="cil-cloud-download" /> Plantilla de T. Humano
                </CButton>
              </div>
              <CForm onSubmit={handleSubmit(onSubmit)}>
                <CFormGroup className="d-flex justify-content-center">
                  <CLabel className="m-0 h4">Consultar T. Humano:</CLabel>
                </CFormGroup>
                <CRow className="d-flex justify-content-center">
                  <CFormGroup className="mb-0 mt-2 mt-md-0 d-flex flex-column">
                    <Controller
                      control={control}
                      name="mes"
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
                          }}
                          dateFormat="MMMM-yyyy"
                          showMonthYearPicker
                          locale="es"
                          placeholderText="MM-YYYY"
                          autoComplete="off"
                          className="form-control"
                        />
                      )}
                    />
                    <span className="text-danger">
                      {errors.mesDescontar && errors.mesDescontar.message}
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
              {state.activeSearch ? (
                <CRow>
                  <CCol>
                    <img
                      src={HumanTalentImg}
                      alt="Buscar"
                      style={{
                        width: "550px",
                        margin: "auto",
                        display: "block",
                      }}
                    />
                  </CCol>
                </CRow>
              ) : (
                <>
                  {state.tthh.length > 0 ? (
                    <>
                      <CRow>
                        <CCol md="4" xl="4">
                          {state.tthh.length > 0 && (
                            <CardApu
                              mes={state.mes}
                              tthhTotal={state.tthhTotal}
                              tthhPago={state.tthhPago}
                              setShow={setShow}
                              show={show}
                            />
                          )}
                        </CCol>
                        <CCol md="4" xl="4">
                          {state.tthhPago.length > 0 && (
                            <CardHumanTalent
                              mes={state.mes}
                              tthhPagoTotal={state.tthhPagoTotal}
                              setShow={setShow}
                              show={show}
                            />
                          )}
                        </CCol>
                      </CRow>
                      <CRow>
                        {show.tableApu && (
                          <>
                            <CCol xl="12">
                              <ul className="d-flex flex-row-reverse">
                                <li
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginLeft: "6px",
                                  }}
                                >
                                  <div className="status-success mr-2"></div>
                                  <span> Afiliado</span>
                                </li>
                                <li
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <div className="status-danger mr-2"></div>
                                  <span> No afiliado</span>
                                </li>
                              </ul>
                            </CCol>
                            <CCol xl="12">
                              <CCard>
                                <CCardBody>
                                  <TableApu data={state.tthh} mes={state.mes} />
                                </CCardBody>
                              </CCard>
                            </CCol>
                            {state.ventaPendiente.length > 0 && (
                              <CCol xl="12">
                                <CCard>
                                  <CCardBody>
                                    <TableApuError
                                      data={state.ventaPendiente}
                                      mes={state.mes}
                                    />
                                  </CCardBody>
                                </CCard>
                              </CCol>
                            )}
                          </>
                        )}
                        {show.tableHumanTalent && (
                          <CCol>
                            <CCard>
                              <CCardBody>
                                <CCol xl="12">
                                  <ul className="d-flex flex-row-reverse">
                                    <li
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginLeft: "6px",
                                      }}
                                    >
                                      <div className="status-success mr-2"></div>
                                      <span> Afiliado</span>
                                    </li>
                                    <li
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div className="status-danger mr-2"></div>
                                      <span> No afiliado</span>
                                    </li>
                                  </ul>
                                </CCol>
                                <CCol xl="12">
                                  <CTabs activeTab="home">
                                    <CNav variant="tabs">
                                      <CNavItem>
                                        <CNavLink data-tab="home">
                                          Talento Humano (Pago Total)
                                        </CNavLink>
                                      </CNavItem>
                                      {state.tthhPagoParcial.length > 0 && (
                                        <CNavItem>
                                          <CNavLink data-tab="profile">
                                            Talento Humano (Pago Parcial)
                                          </CNavLink>
                                        </CNavItem>
                                      )}
                                      {state.tthhPendiente.length > 0 && (
                                        <CNavItem>
                                          <CNavLink data-tab="messages">
                                            Talento Humano (Pago Pendiente)
                                          </CNavLink>
                                        </CNavItem>
                                      )}
                                    </CNav>
                                    <CTabContent>
                                      <CTabPane data-tab="home">
                                        <TableTthhPay
                                          data={state.tthhPago}
                                          mes={state.mes}
                                          onSubmitReload={onSubmit}
                                        />
                                      </CTabPane>
                                      <CTabPane data-tab="profile">
                                        <TableTthhPartial
                                          data={state.tthhPagoParcial}
                                          mes={state.mes}
                                          onSubmitReload={onSubmit}
                                        />
                                      </CTabPane>
                                      <CTabPane data-tab="messages">
                                        <TableTthhEarring
                                          data={state.tthhPendiente}
                                          mes={state.mes}
                                        />
                                      </CTabPane>
                                    </CTabContent>
                                  </CTabs>
                                </CCol>
                              </CCardBody>
                            </CCard>
                          </CCol>
                        )}
                      </CRow>
                    </>
                  ) : (
                    <CRow>
                      <CCol>
                        <img
                          src={NotData}
                          alt="Buscar"
                          style={{
                            width: "380px",
                            margin: "auto",
                            display: "block",
                          }}
                        />
                        <h2 className="d-flex justify-content-center">
                          No se encontró ningún reporte...
                        </h2>
                      </CCol>
                    </CRow>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default HumanTalent;
