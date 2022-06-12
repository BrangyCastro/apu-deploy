import React, { useState, useRef } from "react";
import {
  CForm,
  CButton,
  CFormGroup,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import DatePicker from "react-datepicker";
import { Typeahead } from "react-bootstrap-typeahead";
import { useForm, Controller } from "react-hook-form";
import * as moment from "moment";
import ReactToPrint from "react-to-print";
import { useErrorHandler } from "src/presentation/hooks";
import { getTthhPagosReportsApi } from "src/domain/services";
import ApuLogo from "src/presentation/assets/img/png/apu-logo.png";
import { Loading } from "src/presentation/components";

export const ReportByUser = ({ data, loadingActiveUser }) => {
  const { errors, handleSubmit, control, reset } = useForm();
  const refInvoice = useRef(null);
  const [formDataSearch, setFormDataSearch] = useState({
    mesInicio: null,
    mesFin: null,
  });

  const [state, setState] = useState({
    reports: [],
    user: {},
    activeSearch: true,
    error: "",
    reload: false,
    loading: false,
  });

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  const onSubmit = async (data) => {
    const id = data.id.length > 0 ? data.id[0].id : data.id;
    setState((old) => ({ ...old, loading: true }));
    try {
      const response = await getTthhPagosReportsApi(id, data);
      setState((old) => ({
        ...old,
        user: response.user,
        reports: response.datosTthh,
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
      user: {},
      reports: [],
      activeSearch: true,
      error: "",
    }));
  };

  return (
    <div className="p-3">
      {loadingActiveUser ? (
        <Loading />
      ) : (
        <>
          <CForm onSubmit={handleSubmit(onSubmit)}>
            <CFormGroup className="mb-0 mt-2 mt-md-0">
              <CInputGroup>
                <CInputGroupPrepend>
                  <CInputGroupText>
                    <CIcon name="cil-user" />
                  </CInputGroupText>
                </CInputGroupPrepend>
                <Controller
                  as={
                    <Typeahead
                      id="basic-typeahead"
                      labelKey="nombres"
                      multiple={false}
                      options={data}
                      clearButton
                      emptyLabel="Sin coincidencias"
                      placeholder="Seleccione un usuario"
                    />
                  }
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "El usuario es requerido",
                    },
                  }}
                  name="id"
                  defaultValue=""
                />
              </CInputGroup>
              <span className="text-danger">
                {errors.id && errors.id.message}
              </span>
            </CFormGroup>
            <CRow className="d-flex justify-content-center mt-2">
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
            </CRow>
            <CRow className="d-flex justify-content-end">
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

          {Object.keys(state.user).length !== 0 && (
            <>
              <div className="invoice-box mt-3" ref={refInvoice}>
                <table cellPadding="0" cellSpacing="0">
                  <tbody>
                    <tr className="top">
                      <td colSpan="5">
                        <table>
                          <tbody>
                            <tr>
                              <td className="title">
                                <img
                                  src={ApuLogo}
                                  style={{ width: "100%", maxWidth: "300px" }}
                                  alt=""
                                />
                              </td>

                              <td>
                                APU ULEAM
                                <br />
                                Manta - Manabí - Ecuador
                                <br />
                                Av. Circunvalación - Vía a San Mateo
                                <br />
                                <strong>Creado:</strong> {moment().format("LL")}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    <tr className="information">
                      <td colSpan="5">
                        <table>
                          <tbody>
                            <tr>
                              <td>
                                <strong>Cédula:</strong> {state.user.cedula}
                                <br />
                                <strong>Nombres:</strong> {state.user.nombres}
                                <br />
                                <strong>Email:</strong> {state.user.email}
                                <br />
                                {state.user.facultad.nombreFacultad} -{" "}
                                {state.user.facultad.localidad.extension}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                  {state.reports.map((item, i) => (
                    <tbody key={i}>
                      <tr>
                        <td colSpan="5" style={{ textAlign: "center" }}>
                          <h2 className="mt-2">
                            Reporte del mes de{" "}
                            {moment(item.tthh.mesDescontar)
                              .format("MMMM YYYY")
                              .toUpperCase()}
                          </h2>
                        </td>
                      </tr>
                      <tr className="heading">
                        <td colSpan="5">Observación</td>
                      </tr>
                      <tr className="details">
                        <td colSpan="5">{item.tthh.observacion}</td>
                      </tr>

                      <tr className="heading">
                        <td>F. Emisión</td>
                        <td
                          style={{
                            textAlign: "start",
                          }}
                        >
                          Concepto
                        </td>
                        <td>Meses</td>
                        <td>Pendiente</td>
                        <td>Cuota</td>
                      </tr>
                      {item.venta.map((item) => (
                        <tr
                          className="item"
                          style={{ fontSize: "12px" }}
                          key={item.id}
                        >
                          <td
                            style={{
                              textAlign: "center",
                              width: "90px",
                            }}
                          >
                            {item.fechaEmision}
                          </td>
                          <td
                            style={{
                              textAlign: "start",
                            }}
                          >
                            {item.proveedor
                              ? item.proveedor.nombre
                              : item.apuExtension.nombre}{" "}
                            - {item.producto}
                          </td>
                          <td style={{ textAlign: "center", width: "30px" }}>
                            {item.cuotaMeses}/{item.totalMeses}
                          </td>
                          <td style={{ textAlign: "right", width: "40px" }}>
                            $ {item.valorPendiente}
                          </td>
                          <td style={{ textAlign: "right", width: "90px" }}>
                            $ {item.valorCuota}
                          </td>
                        </tr>
                      ))}
                      <tr className="total" style={{ fontSize: "12px" }}>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td
                          style={{
                            textAlign: "start",
                            fontWeight: "bold",
                          }}
                        >
                          Sub Total:
                        </td>
                        <td style={{ textAlign: "right", width: "90px" }}>
                          {" "}
                          $ {item.tthh.tthh.totalProveedor}
                        </td>
                      </tr>
                      <tr className="total" style={{ fontSize: "12px" }}>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style={{ textAlign: "start", fontWeight: "bold" }}>
                          Aporte APU:
                        </td>
                        <td style={{ textAlign: "right", width: "90px" }}>
                          {" "}
                          $ {item.tthh.tthh.aporte}
                        </td>
                      </tr>
                      <tr className="total" style={{ fontSize: "12px" }}>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style={{ textAlign: "start", fontWeight: "bold" }}>
                          Total:
                        </td>
                        <td style={{ textAlign: "right", width: "90px" }}>
                          $ {item.tthh.tthh.total}
                        </td>
                      </tr>
                      <tr
                        className="total"
                        style={{ fontSize: "12px", marginBottom: "100px" }}
                      >
                        <td></td>
                        <td></td>
                        <td></td>
                        <td
                          style={{
                            textAlign: "start",
                            width: "120px",
                            fontWeight: "bold",
                          }}
                        >
                          Dto. T. Humano:
                        </td>
                        <td style={{ textAlign: "right", width: "90px" }}>
                          {" "}
                          $ {item.tthh.total}
                        </td>
                      </tr>
                      {item.diferencia < 0 || item.diferencia > 0 ? (
                        <tr className="total" style={{ fontSize: "12px" }}>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td
                            style={{
                              textAlign: "start",
                              width: "120px",
                              fontWeight: "bold",
                              backgroundColor: "#ed1d24",
                              color: "#fff",
                            }}
                          >
                            Diferencia:
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              width: "90px",
                              backgroundColor: "#ed1d24",
                              color: "#fff",
                            }}
                          >
                            $ {item.diferencia.toFixed(2)}
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  ))}
                </table>
              </div>
              <div>
                <ReactToPrint
                  trigger={() => (
                    <CButton
                      color="primary"
                      size="sm"
                      variant="outline"
                      className="ml-2"
                    >
                      <CIcon name="cil-print" /> Imprimir o{" "}
                      <CIcon name="cil-cloud-download" /> Descargar PDF
                    </CButton>
                  )}
                  content={() => refInvoice.current}
                  bodyClass="m-5"
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
