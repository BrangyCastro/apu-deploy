import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CCol,
  CForm,
  CInput,
  CTextarea,
  CFormGroup,
  CLabel,
  CTooltip,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import * as moment from "moment";
import { useForm } from "react-hook-form";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { useErrorHandler } from "src/presentation/hooks";
import { getTthhDetailsIdApi } from "src/domain/services";
import { keyPresNumberDecimal } from "src/presentation/shared";
import { Error, Loading, SpinnerBouncer } from "src/presentation/components";
import { updateTthhDetailsApi } from "src/domain/services";
import { TablePayroll } from "./components";

const HumanTalentDetails = ({ match }) => {
  const { params } = match;

  const { register, errors, handleSubmit } = useForm();

  const [state, setState] = useState({
    tthh: {},
    sale: [],
    error: "",
    reload: false,
    loading: false,
    loadingButton: false,
  });

  const reload = () =>
    setState((old) => ({
      tthh: {},
      sale: [],
      error: "",
      reload: !old.reload,
      loading: !old.loading,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  const handleError = useErrorHandler((error) => {
    setState((old) => ({ ...old, loadingButton: false }));
    toast.error(error.message);
  });

  useEffect(() => {
    document.title = "APU | Talento Humano";
    getTthhDetailsId(params.id);
    // eslint-disable-next-line
  }, [state.reload]);

  const onSubmit = async (data) => {
    setState((old) => ({ ...old, loadingButton: true }));
    try {
      await updateTthhDetailsApi(state.tthh.tthh_id, data);
      setState((old) => ({ ...old, loadingButton: false }));
      toast.success("Datos actualizados");
    } catch (error) {
      handleError(error);
    }
  };

  const getTthhDetailsId = async (id) => {
    setState((old) => ({ ...old, loading: true }));
    try {
      const response = await getTthhDetailsIdApi(id);
      setState((old) => ({
        ...old,
        tthh: response.tthh,
        sale: response.sale,
        loading: false,
        activeSearch: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const onChange = (e) => {
    let valorAporte = e.target.value;
    if (!valorAporte) {
      console.log("aqui");
      valorAporte = 0;
    }
    const resultado =
      parseFloat(valorAporte) + parseFloat(state.tthh.totalProveedor);

    console.log(resultado);
    if (isNaN(resultado)) {
      setState((old) => ({
        ...old,
        tthh: {
          ...old.tthh,
          total: "00.00",
          aporte: "00.00",
        },
      }));
    }
    setState((old) => ({
      ...old,
      tthh: {
        ...old.tthh,
        total: resultado.toFixed(2),
        aporte: valorAporte,
      },
    }));
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
            <>
              <CCard>
                <CCardBody>
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <CFormGroup row className="my-0">
                      <CCol xs="12" md="3">
                        <CFormGroup>
                          <CLabel htmlFor="nombre">Cédula</CLabel>
                          <p className="font-weight-bold">
                            {state.tthh.cedula}
                          </p>
                        </CFormGroup>
                      </CCol>
                      <CCol xs="12" md="6">
                        <CFormGroup>
                          <CLabel htmlFor="nombre">Nombres</CLabel>
                          <p className="font-weight-bold">
                            {state.tthh.nombres}
                          </p>
                        </CFormGroup>
                      </CCol>
                      <CCol xs="12" md="3">
                        <CFormGroup>
                          <CLabel htmlFor="nombre">Mes</CLabel>
                          <p className="font-weight-bold">
                            {moment(state.tthh.fechaPago).format(
                              "MMMM [del] YYYY"
                            )}
                          </p>
                        </CFormGroup>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor="observacion">Observación</CLabel>
                      <CTextarea
                        id="observacion"
                        rows="2"
                        placeholder="Ingrese un observación"
                        name="observacion"
                        innerRef={register()}
                        defaultValue={state.tthh.observacion}
                      />
                      <span className="text-danger">
                        {errors.observacion && errors.observacion.message}
                      </span>
                    </CFormGroup>
                    <CFormGroup row className="my-0">
                      <CCol xs="12" md="4">
                        <CFormGroup>
                          <CLabel htmlFor="aporte">
                            Aporte <span className="text-danger">*</span>
                          </CLabel>
                          <CInput
                            id="aporte"
                            placeholder="Ingrese el aporte"
                            type="text"
                            name="aporte"
                            innerRef={register({
                              required: "El aporte es requerido.",
                            })}
                            defaultValue={state.tthh.aporte}
                            onKeyPress={keyPresNumberDecimal}
                            onChange={onChange}
                          />
                          <span className="text-danger">
                            {errors.aporte && errors.aporte.message}
                          </span>
                        </CFormGroup>
                      </CCol>
                      <CCol xs="12" md="4">
                        <CFormGroup>
                          <CLabel htmlFor="producto">
                            Total Proveedor {"  "}
                            <CTooltip
                              content="Para poder actualizar el total de proveedores lo puede
                              hacer en la tabla de abajo seleccionando un proveedor o
                              en nóminas."
                            >
                              <CIcon
                                size="sm"
                                name="cil-bullhorn"
                                className="text-primary"
                              />
                            </CTooltip>
                          </CLabel>
                          <CInput
                            id="producto"
                            placeholder="Ingrese el nombre del producto"
                            type="text"
                            name="producto"
                            defaultValue={state.tthh.totalProveedor}
                            disabled
                          />
                          <span className="text-danger">
                            {errors.producto && errors.producto.message}
                          </span>
                        </CFormGroup>
                      </CCol>
                      <CCol xs="12" md="4">
                        <CFormGroup>
                          <CLabel htmlFor="total">
                            Total a Descontar T. Humano{" "}
                            <span className="text-danger">*</span>{" "}
                            <CTooltip content="Utilizar este campo en caso que los valor no coincidan o si en caso es necesario editar.">
                              <CIcon
                                size="sm"
                                name="cil-bullhorn"
                                className="text-primary"
                              />
                            </CTooltip>
                          </CLabel>
                          <CInput
                            id="total"
                            placeholder="Ingrese el total"
                            type="text"
                            name="total"
                            innerRef={register({
                              required: "El total es requerido.",
                            })}
                            defaultValue={state.tthh.total}
                            onKeyPress={keyPresNumberDecimal}
                          />
                          <span className="text-danger">
                            {errors.total && errors.total.message}
                          </span>
                        </CFormGroup>
                      </CCol>
                    </CFormGroup>
                    <small className="text-muted ">
                      <span className="text-danger">*</span> Campos obligatorios
                    </small>
                    {state.loadingButton ? (
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
                      </div>
                    )}
                  </CForm>
                </CCardBody>
              </CCard>
              {state.sale.length > 0 && (
                <CCard>
                  <CCardHeader>Lista de proveedores</CCardHeader>
                  <CCardBody>
                    <TablePayroll data={state.sale} />
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

export default withRouter(HumanTalentDetails);
