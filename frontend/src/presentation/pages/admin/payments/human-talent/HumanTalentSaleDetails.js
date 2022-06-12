import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CButton,
  CCol,
  CForm,
  CInput,
  CTextarea,
  CSelect,
  CFormGroup,
  CLabel,
  CTooltip,
  CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { withRouter, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as moment from "moment";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useErrorHandler } from "src/presentation/hooks";
import { Error, Loading, SpinnerBouncer } from "src/presentation/components";
import {
  getTthhPagosIdApi,
  updateTthhPagosApi,
  sendEmailReportApi,
  deleteTthhPagosIdApi,
} from "src/domain/services";
import { keyPresNumberDecimal } from "src/presentation/shared";

export const HumanTalentSaleDetails = ({ match }) => {
  const { params } = match;
  let history = useHistory();

  const { register, errors, handleSubmit } = useForm();

  const [state, setState] = useState({
    tthhPagos: {},
    user: {},
    error: "",
    reload: false,
    loading: true,
    loadingButton: false,
  });

  const reload = () =>
    setState((old) => ({
      tthhPagos: {},
      user: {},
      error: "",
      reload: !old.reload,
      loading: true,
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
    getTthhPagosDetailsId(params.id);
    // eslint-disable-next-line
  }, [state.reload]);

  const onSubmit = async (data) => {
    setState((old) => ({ ...old, loadingButton: true }));
    try {
      await updateTthhPagosApi(state.tthhPagos.id, data);
      setState((old) => ({ ...old, loadingButton: false }));
      toast.success("Datos actualizados");
    } catch (error) {
      handleError(error);
    }
  };

  const getTthhPagosDetailsId = async (id) => {
    setState((old) => ({ ...old, loading: true }));
    try {
      const response = await getTthhPagosIdApi(id);
      setState((old) => ({
        ...old,
        tthhPagos: response,
        user: response.tthh.user,
        loading: false,
        activeSearch: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const sendEmailReport = async () => {
    if (state.tthhPagos.email) {
      Swal.fire({
        title: "¿Confirmar esta acción?",
        text: "El usuario ya ha sido notificado, desea enviar de nuevo el correo electrónico de notificación.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, enviar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setState((old) => ({ ...old, loadingButton: true }));
          try {
            await sendEmailReportApi(state.tthhPagos.id);
            setState((old) => ({ ...old, loadingButton: false }));
            toast.success("Correo enviado");
            reload();
          } catch (error) {
            handleError(error);
          }
        }
      });
    } else {
      setState((old) => ({ ...old, loadingButton: true }));
      try {
        await sendEmailReportApi(state.tthhPagos.id);
        setState((old) => ({ ...old, loadingButton: false }));
        toast.success("Correo enviado");
        reload();
      } catch (error) {
        handleError(error);
      }
    }
  };

  const deleteTthhPagos = async () => {
    Swal.fire({
      title: "¿Confirmar esta acción?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setState((old) => ({ ...old, loadingButton: true }));
        try {
          await deleteTthhPagosIdApi(state.tthhPagos.id);
          setState((old) => ({ ...old, loadingButton: false }));
          toast.success("Se ha eliminado correctamente");
          history.push("/pagos/talento-humano");
        } catch (error) {
          handleError(error);
        }
      }
    });
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
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <CFormGroup row className="my-0">
                    <CCol xs="12" md="2">
                      <CFormGroup>
                        <CLabel htmlFor="nombre">Cédula</CLabel>
                        <p className="font-weight-bold">{state.user.cedula}</p>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="12" md="6">
                      <CFormGroup>
                        <CLabel htmlFor="nombre">Nombres</CLabel>
                        <p className="font-weight-bold">{state.user.nombres}</p>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="12" md="2">
                      <CFormGroup>
                        <CLabel htmlFor="nombre">Mes</CLabel>
                        <p className="font-weight-bold">
                          {moment(state.tthhPagos.mesDescontar).format(
                            "MMMM [del] YYYY"
                          )}
                        </p>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="12" md="2">
                      <CFormGroup>
                        <CLabel htmlFor="nombre">
                          Correo{"  "}
                          <CTooltip content="Reporte enviado por correo electrónico">
                            <CIcon
                              size="sm"
                              name="cil-bullhorn"
                              className="text-primary"
                            />
                          </CTooltip>
                        </CLabel>
                        <p>
                          {state.tthhPagos.email ? (
                            <CBadge color="primary">Si</CBadge>
                          ) : (
                            <CBadge color="danger">No</CBadge>
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
                      defaultValue={state.tthhPagos.observacion}
                    />
                    <span className="text-danger">
                      {errors.observacion && errors.observacion.message}
                    </span>
                  </CFormGroup>
                  <CFormGroup row className="my-0">
                    <CCol xs="12" md="4">
                      <CFormGroup>
                        <CLabel htmlFor="total">
                          Estado <span className="text-danger">*</span>
                        </CLabel>
                        <CSelect
                          custom
                          name="status"
                          id="status"
                          innerRef={register({
                            required: "El estado es requerida.",
                          })}
                          defaultValue={state.tthhPagos.status}
                        >
                          <option value="PUBLICO">Publico</option>
                          <option value="PRIVADO">Privado</option>
                        </CSelect>
                        <span className="text-danger">
                          {errors.total && errors.total.message}
                        </span>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="12" md="4">
                      <CFormGroup>
                        <CLabel htmlFor="producto">
                          Total Apu {"  "}
                          <CTooltip
                            content="Para poder actualizar el total de APU lo puede
                              hacer en la tabla de APU."
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
                          defaultValue={state.tthhPagos.total}
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
                          Total Talento Humano{" "}
                          <span className="text-danger">*</span>
                        </CLabel>
                        <CInput
                          id="total"
                          placeholder="Ingrese el total"
                          type="text"
                          name="total"
                          innerRef={register({
                            required: "El total es requerido.",
                          })}
                          defaultValue={state.tthhPagos.tthh.total}
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
                      <CButton type="submit" color="warning" className="mr-2">
                        Actualizar
                      </CButton>
                      <CButton
                        type="button"
                        color="danger"
                        variant="outline"
                        className="mr-2"
                        onClick={deleteTthhPagos}
                      >
                        Eliminar
                      </CButton>
                      <CButton
                        type="button"
                        color="info"
                        variant="outline"
                        onClick={sendEmailReport}
                      >
                        Enviar correo
                      </CButton>
                    </div>
                  )}
                </CForm>
              </CCardBody>
            </CCard>
          )}
        </>
      )}
    </div>
  );
};

export default withRouter(HumanTalentSaleDetails);
