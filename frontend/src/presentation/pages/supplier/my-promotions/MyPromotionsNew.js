import React, { useState, useEffect } from "react";
import {
  CCol,
  CForm,
  CInput,
  CFormGroup,
  CLabel,
  CButton,
  CInputFile,
  CCard,
  CCardBody,
} from "@coreui/react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { Typeahead } from "react-bootstrap-typeahead";
import SimpleMDE from "react-simplemde-editor";
import { withRouter } from "react-router-dom";
import { useErrorHandler } from "src/presentation/hooks";
import { Error, SpinnerBouncer, Loading } from "src/presentation/components";
import {
  getVendorsApi,
  createPromotionsAdminApi,
  uploadPromotionsApi,
} from "src/domain/services";
import useAuth from "src/presentation/hooks/useAuth";

const MyPromotionsNew = () => {
  const { user } = useAuth();
  const { register, errors, handleSubmit, control, reset } = useForm();

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

  const handleError = useErrorHandler((error) => {
    setState((old) => ({ ...old, loading: false }));
    toast.error(error.message);
  });

  useEffect(() => {
    document.title = "APU | Nueva Promoción";
    getVendors(user.id);
    // eslint-disable-next-line
  }, [state.reload]);

  const onSubmit = async (data) => {
    setState((old) => ({ ...old, loading: true }));
    const proveedor =
      data.proveedor.length > 0 ? data.proveedor[0].id : data.proveedor;
    const dataTemp = { ...data, proveedor };
    try {
      const response = await createPromotionsAdminApi(dataTemp);
      await uploadPromotionsApi(data.file[0], response.id);
      reload();
      reset();
      setState((old) => ({ ...old, loading: false }));
      toast.success("Promoción guardada");
    } catch (error) {
      handleError(error);
    }
  };

  const getVendors = async (userId) => {
    setState((old) => ({ ...old, loadingVendors: true }));

    try {
      const response = await getVendorsApi({ userId });

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
    <>
      {state.error ? (
        <Error error={state.error} reload={reload} />
      ) : (
        <>
          {state.loadingVendors ? (
            <Loading />
          ) : (
            <CCard>
              <CCardBody>
                <div className="alert alert-warning">
                  <p className="h6">IMPORTANTE</p>
                  <ul style={{ marginLeft: "25px" }}>
                    <li type="disc">
                      Las fechas de inicio y fin son opcionales, en caso de que
                      su promoción las tenga ubicarla.
                    </li>
                    <li type="disc">
                      Solo se aceptan imagenes <strong>PNG, JPG, JPEG</strong>.
                    </li>
                    <li type="disc">
                      Para una mejor experiencia con los cliente se recomienda
                      la siguiente dimensión para la imagen: 1280 x 720 píxeles
                      (16:9)
                    </li>
                  </ul>
                </div>
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <CFormGroup row className="my-0">
                    <CCol xs="12" md="6">
                      <CFormGroup>
                        <CLabel htmlFor="fechaInicio">Fecha de inicio</CLabel>
                        <CInput
                          id="fechaInicio"
                          type="datetime-local"
                          name="fechaInicio"
                          innerRef={register()}
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol xs="12" md="6">
                      <CFormGroup>
                        <CLabel htmlFor="fechaFin">Fecha final</CLabel>
                        <CInput
                          id="fechaFin"
                          type="datetime-local"
                          name="fechaFin"
                          innerRef={register()}
                        />
                      </CFormGroup>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="proveedor">
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
                      defaultValue=""
                    />
                    <span className="text-danger">
                      {errors.proveedor && errors.proveedor.message}
                    </span>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="titulo">
                      Titulo <span className="text-danger">*</span>
                    </CLabel>
                    <CInput
                      id="titulo"
                      placeholder="Ingrese el titulo"
                      type="text"
                      name="titulo"
                      innerRef={register({
                        required: "El titulo es requerida.",
                      })}
                    />
                    <span className="text-danger">
                      {errors.titulo && errors.titulo.message}
                    </span>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="descripcion">
                      Descripción <span className="text-danger">*</span>
                    </CLabel>
                    <Controller
                      control={control}
                      name="descripcion"
                      as={<SimpleMDE />}
                      id="editor_container"
                      options={{
                        autofocus: true,
                        spellChecker: false,
                        placeholder: "Ingresa una descripción",
                      }}
                      rules={{
                        required: {
                          value: true,
                          message: "La descripción es requerido",
                        },
                      }}
                      defaultValue=""
                    />
                    <span className="text-danger">
                      {errors.descripcion && errors.descripcion.message}
                    </span>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="file">
                      Imagen <span className="text-danger">*</span>
                    </CLabel>
                    <CInputFile
                      id="file"
                      name="file"
                      innerRef={register({
                        required: "La imagen es requerida.",
                      })}
                    />
                    <span className="text-danger">
                      {errors.file && errors.file.message}
                    </span>
                  </CFormGroup>
                  {state.loading ? (
                    <CCol
                      xs="12"
                      md="12"
                      className=" text-center d-flex justify-content-center"
                    >
                      <SpinnerBouncer />
                    </CCol>
                  ) : (
                    <>
                      <div className="form-actions mb-3">
                        <CButton type="submit" color="primary">
                          Guardar
                        </CButton>
                      </div>
                      <small className="text-muted ">
                        <span className="text-danger">*</span> Campos
                        obligatorios
                      </small>
                    </>
                  )}
                </CForm>
              </CCardBody>
            </CCard>
          )}
        </>
      )}
    </>
  );
};

export default withRouter(MyPromotionsNew);
