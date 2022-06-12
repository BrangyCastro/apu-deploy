import React, { useState, useEffect } from "react";
import {
  CCol,
  CRow,
  CForm,
  CInput,
  CFormGroup,
  CLabel,
  CButton,
  CCard,
  CCardBody,
} from "@coreui/react";
import { withRouter, useHistory, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Typeahead } from "react-bootstrap-typeahead";
import { toast } from "react-toastify";
import {
  getSaleIdApi,
  getAllsUserApi,
  getVendorsApi,
  getVendorsApuApi,
  updateSaleApi,
  deleteSaleApi,
} from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { Error, Loading, SpinnerBouncer } from "src/presentation/components";
import { KeyPresCedula, keyPresNumberDecimal } from "src/presentation/shared";
import NotData from "src/presentation/assets/svg/no-data-bro.svg";

const PayrollDetails = ({ match }) => {
  const { params } = match;
  let history = useHistory();
  const { register, errors, handleSubmit, control } = useForm();

  const [loadingButton, setLoadingButton] = useState(false);

  const [state, setState] = useState({
    sale: {},
    user: [],
    vendors: [],
    activeSearch: true,
    noData: false,
    error: "",
    reload: false,
    loading: false,
    loadingUser: false,
    loadingVendorsApu: false,
  });

  const reload = () =>
    setState((old) => ({
      sale: {},
      user: [],
      vendors: [],
      error: "",
      reload: !old.reload,
      loading: !old.loading,
      loadingUser: !old.loadingUser,
      activeSearch: !old.activeSearch,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  const handleError = useErrorHandler((error) => {
    setLoadingButton(false);
    toast.error(error.message);
  });

  useEffect(() => {
    document.title = "APU | Editar Nómina";
    getSaleId(params.id);
    getAllsUser();
    getVendors();
    getVendorsApu();
    // eslint-disable-next-line
  }, [state.reload]);

  const onSubmit = async (data) => {
    setLoadingButton(true);
    const userId = data.userId.length > 0 ? data.userId[0].id : data.userId;
    const proveedor =
      data.proveedor.length > 0 ? data.proveedor[0] : data.proveedor;

    if (proveedor.convenio) {
      const dataTemp = {
        ...data,
        apuExtension: null,
        proveedor: proveedor.id,
        userId,
      };
      try {
        await updateSaleApi(state.sale.id, dataTemp);
        setLoadingButton(false);
        toast.success("Datos actualizados");
      } catch (error) {
        handleError(error);
      }
    } else {
      const dataTemp = {
        ...data,
        apuExtension: proveedor.id,
        proveedor: null,
        userId,
      };
      try {
        await updateSaleApi(state.sale.id, dataTemp);
        setLoadingButton(false);
        toast.success("Datos actualizados");
      } catch (error) {
        handleError(error);
      }
    }
  };

  const onDeletePayroll = async () => {
    setLoadingButton(true);
    try {
      await deleteSaleApi(state.sale.id);
      toast.success("Datos eliminados");
      history.push("/pagos/nomina");
      setLoadingButton(false);
    } catch (error) {
      handleError(error);
    }
  };

  const getSaleId = async (id) => {
    setState((old) => ({ ...old, loading: true }));
    try {
      const response = await getSaleIdApi(id);
      if (response) {
        setState((old) => ({
          ...old,
          sale: response,
          loading: false,
          activeSearch: false,
        }));
      } else {
        setState((old) => ({
          ...old,
          noData: true,
          loading: false,
          activeSearch: false,
        }));
      }
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const getAllsUser = async () => {
    setState((old) => ({ ...old, loadingUser: true }));

    try {
      const response = await getAllsUserApi(null);
      setState((old) => ({
        ...old,
        user: response,
        loadingUser: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const getVendors = async (status) => {
    setState((old) => ({ ...old, loadingVendors: true }));

    try {
      const response = await getVendorsApi({ status });
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
    setState((old) => ({ ...old, loadingVendorsApu: true }));
    try {
      const response = await getVendorsApuApi();
      setState((old) => ({
        ...old,
        vendors: old.vendors.concat(response),
        loadingVendorsApu: false,
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
          {state.loading || state.loadingUser || state.loadingVendorsApu ? (
            <Loading />
          ) : (
            <>
              {state.noData ? (
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
                    <Link to="/pagos/nomina">
                      <CButton
                        style={{
                          width: "250px",
                          margin: "auto",
                          display: "block",
                          textDecoration: "none",
                        }}
                        variant="outline"
                        color="success"
                      >
                        Regresar
                      </CButton>
                    </Link>
                  </CCol>
                </CRow>
              ) : (
                <CCard>
                  <CCardBody>
                    <CForm onSubmit={handleSubmit(onSubmit)}>
                      <CFormGroup>
                        <CLabel htmlFor="nombre">
                          Usuario <span className="text-danger">*</span>
                        </CLabel>
                        <Controller
                          as={
                            <Typeahead
                              id="basic-typeahead"
                              labelKey="nombres"
                              multiple={false}
                              options={state.user}
                              clearButton
                              emptyLabel="Sin coincidencias"
                              placeholder="Seleccione un usuario"
                              paginationText="Mostrar resultados adicionales ..."
                              defaultSelected={
                                state.sale.user ? [state.sale.user] : []
                              }
                            />
                          }
                          control={control}
                          name="userId"
                          defaultValue={
                            state.sale.user ? state.sale.user.id : null
                          }
                        />
                        <span className="text-danger">
                          {errors.userId && errors.userId.message}
                        </span>
                      </CFormGroup>
                      <CFormGroup>
                        <CLabel htmlFor="nombre">
                          Proveedor <span className="text-danger">*</span>
                        </CLabel>
                        <Controller
                          as={
                            <Typeahead
                              id="basic-typeahead"
                              labelKey="nombre"
                              multiple={false}
                              options={state.vendors}
                              clearButton
                              emptyLabel="Sin coincidencias"
                              placeholder="Seleccione un proveedor"
                              paginationText="Mostrar resultados adicionales ..."
                              defaultSelected={
                                state.sale.proveedor
                                  ? [state.sale.proveedor]
                                  : state.sale.apuExtension
                                  ? [state.sale.apuExtension]
                                  : []
                              }
                            />
                          }
                          control={control}
                          rules={{
                            required: {
                              value: true,
                              message: "El proveedor es requerido",
                            },
                          }}
                          name="proveedor"
                          defaultValue={
                            state.sale.proveedor
                              ? state.sale.proveedor
                              : state.sale.apuExtension
                              ? state.sale.apuExtension
                              : null
                          }
                        />
                        <span className="text-danger">
                          {errors.proveedor && errors.proveedor.message}
                        </span>
                      </CFormGroup>
                      <CFormGroup row className="my-0">
                        <CCol xs="12" md="6">
                          <CFormGroup>
                            <CLabel htmlFor="producto">Producto</CLabel>
                            <CInput
                              id="producto"
                              placeholder="Ingrese el nombre del producto"
                              type="text"
                              name="producto"
                              innerRef={register()}
                              defaultValue={state.sale.producto}
                            />
                            <span className="text-danger">
                              {errors.producto && errors.producto.message}
                            </span>
                          </CFormGroup>
                        </CCol>
                        <CCol xs="12" md="6">
                          <CFormGroup>
                            <CLabel htmlFor="mesPago">
                              Mes cancelar{" "}
                              <span className="text-danger">*</span>
                            </CLabel>
                            <CInput
                              id="mesPago"
                              placeholder="Ingrese el mes que desea pagar"
                              type="text"
                              name="mesPago"
                              innerRef={register({
                                required: "El mes pago es requerida.",
                              })}
                              defaultValue={state.sale.mesPago}
                            />
                            <span className="text-danger">
                              {errors.mesPago && errors.mesPago.message}
                            </span>
                          </CFormGroup>
                        </CCol>
                      </CFormGroup>
                      <CFormGroup row className="my-0">
                        <CCol xs="12" md="6">
                          <CFormGroup>
                            <CLabel htmlFor="factura">Nº Factura</CLabel>
                            <CInput
                              id="factura"
                              placeholder="Ingrese el número de factura"
                              type="text"
                              name="factura"
                              innerRef={register()}
                              defaultValue={state.sale.factura}
                            />
                            <span className="text-danger">
                              {errors.factura && errors.factura.message}
                            </span>
                          </CFormGroup>
                        </CCol>
                        <CCol xs="12" md="6">
                          <CFormGroup>
                            <CLabel htmlFor="fechaEmision">
                              Fecha Emisión{" "}
                              <span className="text-danger">*</span>
                            </CLabel>
                            <CInput
                              id="fechaEmision"
                              placeholder="Ingrese el nombre del propietaario"
                              type="date"
                              name="fechaEmision"
                              innerRef={register({
                                required:
                                  "El nombre del propietaario es requerida.",
                              })}
                              defaultValue={state.sale.fechaEmision}
                            />
                            <span className="text-danger">
                              {errors.fechaEmision &&
                                errors.fechaEmision.message}
                            </span>
                          </CFormGroup>
                        </CCol>
                      </CFormGroup>
                      <CFormGroup row className="my-0">
                        <CCol xs="12" md="4">
                          <CFormGroup>
                            <CLabel htmlFor="totalVenta">
                              Valor Total <span className="text-danger">*</span>
                            </CLabel>
                            <CInput
                              id="totalVenta"
                              placeholder="Ingrese el total de venta"
                              type="text"
                              name="totalVenta"
                              innerRef={register({
                                required: "El total de la venta es requerida.",
                              })}
                              defaultValue={state.sale.totalVenta}
                              onKeyPress={keyPresNumberDecimal}
                            />
                            <span className="text-danger">
                              {errors.totalVenta && errors.totalVenta.message}
                            </span>
                          </CFormGroup>
                        </CCol>
                        <CCol xs="12" md="4">
                          <CFormGroup>
                            <CLabel htmlFor="totalMeses">
                              Total de Meses{" "}
                              <span className="text-danger">*</span>
                            </CLabel>
                            <CInput
                              id="totalMeses"
                              placeholder="Ingrese el total de meses"
                              type="text"
                              name="totalMeses"
                              innerRef={register({
                                required: "El total de meses es requerida.",
                              })}
                              defaultValue={state.sale.totalMeses}
                              onKeyPress={KeyPresCedula}
                            />
                            <span className="text-danger">
                              {errors.totalMeses && errors.totalMeses.message}
                            </span>
                          </CFormGroup>
                        </CCol>
                        <CCol xs="12" md="4">
                          <CFormGroup>
                            <CLabel htmlFor="cuotaMeses">
                              Mes Actual a Pagar{" "}
                              <span className="text-danger">*</span>
                            </CLabel>
                            <CInput
                              id="cuotaMeses"
                              placeholder="Ingrese el mes actual a pagar en numero"
                              type="text"
                              name="cuotaMeses"
                              innerRef={register({
                                required: "El mes actual a pagar es requerida.",
                              })}
                              defaultValue={state.sale.cuotaMeses}
                              onKeyPress={KeyPresCedula}
                            />
                            <span className="text-danger">
                              {errors.cuotaMeses && errors.cuotaMeses.message}
                            </span>
                          </CFormGroup>
                        </CCol>
                      </CFormGroup>
                      <CFormGroup row className="my-0">
                        <CCol xs="12" md="6">
                          <CFormGroup>
                            <CLabel htmlFor="valorCuota">
                              Valor Cuota <span className="text-danger">*</span>
                            </CLabel>
                            <CInput
                              id="valorCuota"
                              placeholder="Ingrese el valor de la cuota"
                              type="text"
                              name="valorCuota"
                              innerRef={register({
                                required: "El valor de la cuota es requerida.",
                              })}
                              defaultValue={state.sale.valorCuota}
                              onKeyPress={keyPresNumberDecimal}
                            />
                            <span className="text-danger">
                              {errors.valorCuota && errors.valorCuota.message}
                            </span>
                          </CFormGroup>
                        </CCol>
                        <CCol xs="12" md="6">
                          <CFormGroup>
                            <CLabel htmlFor="valorPendiente">
                              Valor Pendiente{" "}
                              <span className="text-danger">*</span>
                            </CLabel>
                            <CInput
                              id="valorPendiente"
                              placeholder="Ingrese el valor pendiente"
                              type="text"
                              name="valorPendiente"
                              innerRef={register({
                                required: "El valor pendiente es requerida.",
                              })}
                              defaultValue={state.sale.valorPendiente}
                              onKeyPress={keyPresNumberDecimal}
                            />
                            <span className="text-danger">
                              {errors.valorPendiente &&
                                errors.valorPendiente.message}
                            </span>
                          </CFormGroup>
                        </CCol>
                      </CFormGroup>
                      <small className="text-muted ">
                        <span className="text-danger">*</span> Campos
                        obligatorios
                      </small>
                      {loadingButton ? (
                        <CCol
                          xs="12"
                          md="12"
                          className=" text-center d-flex justify-content-center"
                        >
                          <SpinnerBouncer />
                        </CCol>
                      ) : (
                        <div className="form-actions mt-3">
                          <CButton type="submit" color="warning">
                            Actualizar
                          </CButton>
                          <CButton
                            className="ml-2"
                            color="danger"
                            variant="outline"
                            onClick={onDeletePayroll}
                          >
                            Eliminar
                          </CButton>
                        </div>
                      )}
                    </CForm>
                  </CCardBody>
                </CCard>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default withRouter(PayrollDetails);
