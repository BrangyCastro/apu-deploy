import React, { useEffect, useState } from "react";
import {
  CDataTable,
  CButton,
  CCard,
  CCardBody,
  CForm,
  CFormGroup,
  CLabel,
  CRow,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Typeahead, ClearButton } from "react-bootstrap-typeahead";
import {
  getVendorsApi,
  getVendorsApuApi,
  getSaleAllsApi,
} from "src/domain/services";
import { Error } from "src/presentation/components";
import { useErrorHandler } from "src/presentation/hooks";
import { downloadCsv, downloadEcxel } from "src/domain/utils/download";

export const TablePayroll = ({
  data,
  setData,
  total,
  month,
  discount,
  file,
}) => {
  const { errors, handleSubmit, control } = useForm();
  const [state, setState] = useState({
    vendors: [],
    error: "",
    reload: false,
    loading: false,
    loadingVendors: false,
  });

  const reload = () =>
    setState((old) => ({
      vendors: [],
      error: "",
      reload: !old.reload,
      loading: !old.loading,
      loadingVendors: !old.loadingVendors,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    getVendors("ACTIVE");
    getVendorsApu();
    // eslint-disable-next-line
  }, []);

  const getVendors = async (status) => {
    setState((old) => ({ ...old, loadingVendors: true }));

    try {
      const response = await getVendorsApi(status);
      setState((old) => ({
        ...old,
        vendors: old.vendors.concat(response),
        loadingVendors: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const getVendorsApu = async () => {
    setState((old) => ({ ...old, loading: true }));
    try {
      const response = await getVendorsApuApi();
      setState((old) => ({
        ...old,
        vendors: old.vendors.concat(response),
        loading: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const onSubmit = async (data) => {
    const proveedor =
      data.proveedor.length > 0 ? data.proveedor[0].id : data.proveedor;
    if (data.proveedor[0].convenio) {
      try {
        const response = await getSaleAllsApi({
          proveedor,
          mesDescontar: month,
        });
        setData((old) => ({
          ...old,
          payroll: response.VentaMes,
          total: response.total,
          discount:
            data.proveedor[0].convenio.length > 0
              ? data.proveedor[0].convenio[0].descuento
              : 0,
          file: data.proveedor[0].nombre,
          loading: false,
          activeSearch: false,
        }));
      } catch (error) {
        handleErrorLoad(error);
      }
    } else {
      try {
        const response = await getSaleAllsApi({
          apuExtension: proveedor,
          mesDescontar: month,
        });
        setData((old) => ({
          ...old,
          payroll: response.VentaMes,
          total: response.total,
          discount: null,
          file: data.proveedor[0].nombre,
          loading: false,
          activeSearch: false,
        }));
      } catch (error) {
        handleErrorLoad(error);
      }
    }
  };

  const getSaleAll = async (data) => {
    setData((old) => ({ ...old, loading: true }));
    try {
      const response = await getSaleAllsApi({ mesDescontar: data });
      setData((old) => ({
        ...old,
        payroll: response.VentaMes,
        total: response.total,
        discount: null,
        file: "TODOS",
        month: data,
        loading: false,
        activeSearch: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const exportExcel = () => {
    const dataVenta = [];
    data.forEach((item) => {
      if (item.proveedor !== null) {
        dataVenta.push({
          cedula: item.user.cedula,
          nombres: item.user.nombres,
          no_factura: item.factura,
          fecha_emision: item.fechaEmision,
          empresa: item.proveedor.nombre,
          producto: item.producto,
          mes_a_pagar: item.mesPago,
          mes_a_descontar: item.mesDescontar,
          pvp: item.totalVenta,
          total_meses: item.totalMeses,
          couta_meses: item.cuotaMeses,
          valor_cuota: item.valorCuota,
          valor_pendiente: item.valorPendiente,
        });
      } else {
        dataVenta.push({
          cedula: item.user.cedula,
          nombres: item.user.nombres,
          no_factura: item.factura,
          fecha_emision: item.fechaEmision,
          empresa: item.apuExtension.nombre,
          producto: item.producto,
          mes_a_pagar: item.mesPago,
          mes_a_descontar: item.mesDescontar,
          pvp: item.totalVenta,
          total_meses: item.totalMeses,
          couta_meses: item.cuotaMeses,
          valor_cuota: item.valorCuota,
          valor_pendiente: item.valorPendiente,
        });
      }
    });

    downloadEcxel(dataVenta, file);
  };

  const exportCsv = () => {
    const dataVenta = [];
    data.forEach((item) => {
      if (item.proveedor !== null) {
        dataVenta.push({
          cedula: item.user.cedula,
          nombres: item.user.nombres,
          no_factura: item.factura,
          fecha_emision: item.fechaEmision,
          empresa: item.proveedor.nombre,
          producto: item.producto,
          mes_a_pagar: item.mesPago,
          mes_a_descontar: item.mesDescontar,
          pvp: item.totalVenta,
          total_meses: item.totalMeses,
          couta_meses: item.cuotaMeses,
          valor_cuota: item.valorCuota,
          valor_pendiente: item.valorPendiente,
        });
      } else {
        dataVenta.push({
          cedula: item.user.cedula,
          nombres: item.user.nombres,
          no_factura: item.factura,
          fecha_emision: item.fechaEmision,
          empresa: item.apuExtension.nombre,
          producto: item.producto,
          mes_a_pagar: item.mesPago,
          mes_a_descontar: item.mesDescontar,
          pvp: item.totalVenta,
          total_meses: item.totalMeses,
          couta_meses: item.cuotaMeses,
          valor_cuota: item.valorCuota,
          valor_pendiente: item.valorPendiente,
        });
      }
    });
    downloadCsv(dataVenta, file);
  };

  const fields = [
    {
      key: "nombres",
      label: "Nombres",
      filter: false,
    },
    {
      key: "concepto",
      label: "Concepto",
    },
    {
      key: "valorPendiente",
      label: "V. Pendiente",
    },
    {
      key: "valorCuota",
      label: "V. Cuota",
    },
    {
      key: "accion",
      label: "Acción",
      filter: false,
      _style: { width: "10%" },
    },
  ];

  return (
    <div>
      {state.error ? (
        <Error error={state.error} reload={reload} />
      ) : (
        <CCard>
          <CCardBody>
            <div className="d-flex justify-content-between align-items-center mt-3 mb-5">
              <div>
                <span className="text-black-50 h2">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(total.suma)}
                </span>
                <br />
                {discount !== null ? (
                  <>
                    {discount > 0 ? (
                      <span>Descuento de {discount}%</span>
                    ) : (
                      <span className="text-warning">
                        No cuenta con un convenio
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-black-50">Total</span>
                )}
              </div>
              <div className="w-50">
                {state.loading || state.loadingVendors ? null : (
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <CFormGroup className="d-flex justify-content-center">
                      <CLabel className="m-0 h6">
                        Consultar por proveedor:
                      </CLabel>
                    </CFormGroup>
                    <CRow className="d-flex justify-content-center">
                      <CFormGroup className="mb-0 mt-2 mt-md-0 w-75">
                        <Controller
                          as={
                            <Typeahead
                              id="basic-typeahead"
                              labelKey="nombre"
                              multiple={false}
                              options={state.vendors}
                              emptyLabel="Sin coincidencias"
                              placeholder="Seleccione un proveedor"
                            >
                              {({ onClear, selected }) =>
                                !!selected.length && (
                                  <div className="rbt-aux">
                                    <ClearButton
                                      onClick={(e) => {
                                        onClear();
                                        getSaleAll(month);
                                        setData((old) => ({
                                          ...old,
                                          discount: null,
                                        }));
                                      }}
                                      onFocus={(e) => {
                                        // Prevent the main input from auto-focusing again.
                                        e.stopPropagation();
                                      }}
                                      onMouseDown={(e) => {
                                        // Prevent input from blurring when button is clicked.
                                        e.preventDefault();
                                      }}
                                    />
                                  </div>
                                )
                              }
                            </Typeahead>
                          }
                          control={control}
                          rules={{
                            required: {
                              value: true,
                              message: "El proveedor es requerido",
                            },
                          }}
                          name="proveedor"
                          defaultValue=""
                        />
                        <span className="text-danger">
                          {errors.proveedor && errors.proveedor.message}
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
                          <CIcon name="cil-zoom" />
                        </CButton>
                      </CFormGroup>
                    </CRow>
                  </CForm>
                )}
              </div>
            </div>

            <CDropdown className="d-flex flex-row-reverse">
              <CDropdownToggle color="light" size="sm">
                <CIcon name="cil-settings" /> Exportar
              </CDropdownToggle>
              <CDropdownMenu size="sm">
                <CDropdownItem onClick={exportExcel}>Todos Excel</CDropdownItem>
                <CDropdownItem onClick={exportCsv}>Todos Csv</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>

            <CDataTable
              items={data}
              fields={fields}
              size="sm"
              tableFilter={{
                label: "Buscar: ",
                placeholder: "Nombres...",
              }}
              itemsPerPageSelect={{ label: "Elementos por página: " }}
              itemsPerPage={10}
              pagination
              scopedSlots={{
                concepto: (item) => (
                  <td>
                    {item.apuExtension
                      ? item.apuExtension.nombre
                      : item.proveedor.nombre}
                  </td>
                ),
                accion: (item) => (
                  <td>
                    <Link to={`/pagos/nomina/${item.id}`}>
                      <CButton size="sm" color="info" variant="ghost">
                        Ver mas
                      </CButton>
                    </Link>
                  </td>
                ),
              }}
            />
            {discount !== null && (
              <div className="invoice-box d-flex flex-row-reverse">
                <table cellPadding="0" cellSpacing="0" style={{ width: "25%" }}>
                  <tbody>
                    <tr className="total">
                      <td style={{ fontWeight: "bold" }}>Sub Total:</td>
                      <td style={{ textAlign: "right" }}> $ {total.suma}</td>
                    </tr>
                    <tr className="total">
                      <td style={{ fontWeight: "bold" }}>% descuento:</td>
                      <td style={{ textAlign: "right" }}> {discount} %</td>
                    </tr>
                    <tr className="total">
                      <td style={{ fontWeight: "bold" }}>Descuento:</td>
                      <td style={{ textAlign: "right" }}>
                        $ {((total.suma * discount) / 100).toFixed(2)}
                      </td>
                    </tr>
                    <tr className="total">
                      <td style={{ fontWeight: "bold" }}>Total:</td>
                      <td style={{ textAlign: "right" }}>
                        ${" "}
                        {(
                          total.suma -
                          ((total.suma * discount) / 100).toFixed(2)
                        ).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </CCardBody>
        </CCard>
      )}
    </div>
  );
};
