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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useErrorHandler } from "src/presentation/hooks";
import { Error, Loading } from "src/presentation/components";
import { getSaleAllsApi } from "src/domain/services";
import { downloadEcxel } from "src/domain/utils/download";
import payrollImg from "src/presentation/assets/svg/telecommuting-animate.svg";
import NotData from "src/presentation/assets/svg/no-data-bro.svg";
import { TablePayroll } from "./components";

const Payroll = () => {
  const { errors, handleSubmit, control, reset } = useForm();

  const [state, setState] = useState({
    payroll: [],
    total: 0,
    discount: null,
    file: "TODO",
    month: "",
    activeSearch: true,
    error: "",
    reload: false,
    loading: false,
  });

  const reload = () =>
    setState((old) => ({
      payroll: [],
      total: 0,
      discount: null,
      file: "TODO",
      error: "",
      reload: !old.reload,
      loading: !old.loading,
      activeSearch: !old.activeSearch,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Nóminas";
  }, [state.reload]);

  const onSubmit = async (data) => {
    setState((old) => ({ ...old, loading: true }));
    try {
      const response = await getSaleAllsApi(data);
      setState((old) => ({
        ...old,
        payroll: response.VentaMes,
        total: response.total,
        month: data.mesDescontar,
        loading: false,
        activeSearch: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const onClear = () => {
    reset({
      mesDescontar: null,
    });
    setState((old) => ({
      payroll: [],
      total: 0,
      discount: null,
      activeSearch: true,
      error: "",
      loading: false,
    }));
  };

  const exportExcel = () => {
    const dataVenta = [
      {
        CODIGO: "TEXTO",
        CEDULA: "TEXTO",
        NOMBRES: "TEXTO",
        FACULTAD: "TEXTO",
        EXTENSION: "TEXTO",
        EMPRESA: "TEXTO",
        PRODUCTO: "TEXTO",
        FACTURA_NO: "TEXTO",
        FECHA_EMISION: "YYYY-MM-DD",
        MES: "TEXTO",
        PVP: "NUMERO",
        TOTAL_MESES: "GENERAL",
        CUOTA_MESES: "GENERAL",
        VALOR_CUOTA: "NUMERO",
        VALOR_PENDIENTE: "NUMERO ",
      },
      {
        CODIGO: "TEXTO (OPCIONAL)",
        CEDULA: "1311431058 (REQUERIDO)",
        NOMBRES: "CHIRIBOGA MENDOZA FIDEL RICARDO (OPCIONAL)",
        FACULTAD: "ADMINIST. (OPCIONAL)",
        EXTENSION: "MANTA (OPCIONAL)",
        EMPRESA: "DIST. A&C (REQUERIDO)",
        PRODUCTO: "PORTATIL DELL I5 (OPCIONAL)",
        FACTURA_NO: "001-319 (OPCIONAL)",
        FECHA_EMISION: "2019-09-01 (REQUERIDO)",
        MES: "SEPTIEMBRE (REQUERIDO)",
        PVP: "962,5 (REQUERIDO)",
        TOTAL_MESES: "10 (REQUERIDO)",
        CUOTA_MESES: "10 (REQUERIDO)",
        VALOR_CUOTA: "96,25 (REQUERIDO)",
        VALOR_PENDIENTE: "0 (REQUERIDO)",
      },
    ];

    downloadEcxel(dataVenta, "PLANTILLA_NOMINA");
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
                <Link to="/pagos/nomina/nuevo">
                  <CButton
                    variant="outline"
                    color="primary"
                    size="sm"
                    className="mr-2"
                  >
                    <CIcon name="cil-plus" /> Nueva Nómina Individual
                  </CButton>
                </Link>
                <Link to="/pagos/nomina/nuevo-csv">
                  <CButton
                    variant="outline"
                    color="primary"
                    size="sm"
                    className="mr-2"
                  >
                    <CIcon name="cil-plus" /> Nueva Nómina CSV
                  </CButton>
                </Link>
                <CButton
                  className="mr-2"
                  variant="outline"
                  color="info"
                  onClick={exportExcel}
                  size="sm"
                >
                  <CIcon name="cil-cloud-download" /> Plantilla de Nómina
                </CButton>
              </div>
              <CForm onSubmit={handleSubmit(onSubmit)}>
                <CFormGroup className="d-flex justify-content-center">
                  <CLabel className="m-0 h4">Consultar nóminas:</CLabel>
                </CFormGroup>
                <CRow className="d-flex justify-content-center">
                  <CFormGroup className="mb-0 mt-2 mt-md-0 d-flex flex-column">
                    <Controller
                      control={control}
                      name="mesDescontar"
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
                      src={payrollImg}
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
                  {state.payroll.length > 0 || state.total !== null ? (
                    <TablePayroll
                      data={state.payroll}
                      setData={setState}
                      total={state.total}
                      month={state.month}
                      discount={state.discount}
                      file={state.file}
                    />
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
                          No se encontró ninguna nómina...
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

export default Payroll;
