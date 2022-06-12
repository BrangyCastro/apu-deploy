import React, { useEffect, useState, useRef } from "react";
import { CCard, CCardBody, CButton } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { withRouter } from "react-router-dom";
import * as moment from "moment";
import ReactToPrint from "react-to-print";
import { getTthhPagosReportsIdApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { Error, Loading } from "src/presentation/components";
import ApuLogo from "src/presentation/assets/img/png/apu-logo.png";

export const ReportsDetails = ({ match }) => {
  const { params } = match;
  const refInvoice = useRef(null);
  const [state, setState] = useState({
    tthhPagos: {},
    tthh: {},
    ventas: [],
    diferencia: 0,
    error: "",
    reload: false,
    loading: true,
  });

  const reload = () =>
    setState((old) => ({
      tthhPagos: {},
      tthh: {},
      ventas: [],
      error: "",
      reload: !old.reload,
      loading: !old.loading,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Reportes";
    getTthhPagosReportsDetails(params.id);
    // eslint-disable-next-line
  }, [params.id, state.reload]);

  const getTthhPagosReportsDetails = async (id) => {
    setState((old) => ({ ...old, loading: true }));
    try {
      const response = await getTthhPagosReportsIdApi(id);
      setState((old) => ({
        ...old,
        tthhPagos: response.tthhPagos,
        tthh: response.tthh,
        ventas: response.venta,
        diferencia: response.diferencia,
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
                <div className="invoice-box" ref={refInvoice}>
                  <table
                    cellPadding="0"
                    cellSpacing="0"
                    className="table-responsive-sm"
                  >
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
                                  <strong>Creado:</strong>{" "}
                                  {moment().format("LL")}
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
                                  <strong>Cédula:</strong>{" "}
                                  {state.tthh.user.cedula}
                                  <br />
                                  <strong>Nombres:</strong>{" "}
                                  {state.tthh.user.nombres}
                                  <br />
                                  <strong>Email:</strong>{" "}
                                  {state.tthh.user.email}
                                  <br />
                                  {
                                    state.tthh.user.facultad.nombreFacultad
                                  } -{" "}
                                  {state.tthh.user.facultad.localidad.extension}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      <tr className="title-date">
                        <td colSpan="5" style={{ textAlign: "center" }}>
                          <h2>
                            Reporte del mes de{" "}
                            {moment(state.tthhPagos.mesDescontar)
                              .format("MMMM YYYY")
                              .toUpperCase()}
                          </h2>
                        </td>
                      </tr>
                      <tr className="heading">
                        <td colSpan="5">Observación</td>
                      </tr>

                      <tr className="details">
                        <td colSpan="5">{state.tthhPagos.observacion}</td>
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

                      {state.ventas.map((item) => (
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
                          <td style={{ textAlign: "right", width: "100px" }}>
                            $ {item.valorCuota}
                          </td>
                        </tr>
                      ))}
                      <tr className="total" style={{ fontSize: "12px" }}>
                        <td></td>
                        <td></td>
                        <td
                          colSpan="2"
                          style={{
                            textAlign: "end",
                            fontWeight: "bold",
                          }}
                        >
                          Sub Total:
                        </td>
                        <td
                          colSpan="2"
                          style={{ textAlign: "right", width: "150px" }}
                        >
                          {" "}
                          $ {state.tthh.totalProveedor}
                        </td>
                      </tr>
                      <tr className="total" style={{ fontSize: "12px" }}>
                        <td></td>
                        <td></td>
                        <td
                          colSpan="2"
                          style={{ textAlign: "end", fontWeight: "bold" }}
                        >
                          Aporte APU:
                        </td>
                        <td
                          colSpan="2"
                          style={{ textAlign: "right", width: "90px" }}
                        >
                          {" "}
                          $ {state.tthh.aporte}
                        </td>
                      </tr>
                      <tr className="total" style={{ fontSize: "12px" }}>
                        <td></td>
                        <td></td>
                        <td
                          colSpan="2"
                          style={{ textAlign: "end", fontWeight: "bold" }}
                        >
                          Total:
                        </td>
                        <td
                          colSpan="2"
                          style={{ textAlign: "right", width: "90px" }}
                        >
                          $ {state.tthh.total}
                        </td>
                      </tr>
                      <tr className="total" style={{ fontSize: "12px" }}>
                        <td></td>
                        <td></td>
                        <td
                          colSpan="2"
                          style={{
                            textAlign: "end",
                            width: "120px",
                            fontWeight: "bold",
                          }}
                        >
                          Dto. T. Humano:
                        </td>
                        <td
                          colSpan="2"
                          style={{ textAlign: "right", width: "90px" }}
                        >
                          {" "}
                          $ {state.tthhPagos.total}
                        </td>
                      </tr>
                      {state.diferencia < 0 || state.diferencia > 0 ? (
                        <tr className="total" style={{ fontSize: "12px" }}>
                          <td></td>
                          <td></td>
                          <td
                            colSpan="2"
                            style={{
                              textAlign: "end",
                              width: "120px",
                              fontWeight: "bold",
                              backgroundColor: "#ed1d24",
                              color: "#fff",
                            }}
                          >
                            Diferencia:
                          </td>
                          <td
                            colSpan="2"
                            style={{
                              textAlign: "right",
                              width: "90px",
                              backgroundColor: "#ed1d24",
                              color: "#fff",
                            }}
                          >
                            $ {state.diferencia.toFixed(2)}
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
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
              </CCardBody>
            </CCard>
          )}
        </>
      )}
    </div>
  );
};

export default withRouter(ReportsDetails);
