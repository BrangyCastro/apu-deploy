import React, { useState } from "react";
import {
  CCol,
  CForm,
  CInput,
  CFormGroup,
  CLabel,
  CButton,
  CTextarea,
} from "@coreui/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { SpinnerBouncer } from "src/presentation/components";
import { useErrorHandler } from "src/presentation/hooks";
import { createExtensionApi } from "src/domain/services";

export const NewExtensionForm = ({ reload }) => {
  const { register, errors, handleSubmit, reset } = useForm();

  const [state, setState] = useState({
    loading: false,
    mainError: false,
  });

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, loading: false }));
    toast.error(error.message);
  });

  const onSubmit = async (data) => {
    setState((old) => ({ ...old, loading: true }));
    try {
      await createExtensionApi(data);
      reload();
      reset();
      setState((old) => ({ ...old, loading: false }));
      toast.success("Extension guardada");
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  return (
    <div className="p-3">
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CFormGroup>
          <CLabel htmlFor="titulo">
            Nombre <span className="text-danger">*</span>
          </CLabel>
          <CInput
            id="nombre"
            placeholder="Ingrese el nombre"
            type="text"
            name="nombre"
            innerRef={register({
              required: "El nombre es requerida.",
            })}
          />
          <span className="text-danger">
            {errors.nombre && errors.nombre.message}
          </span>
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="descripcion">Descripción</CLabel>
          <CTextarea
            id="descripcion"
            placeholder="Ingrese el descripción"
            type="text"
            name="descripcion"
            innerRef={register()}
          />
          <span className="text-danger">
            {errors.descripcion && errors.descripcion.message}
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
              <span className="text-danger">*</span> Campos obligatorios
            </small>
          </>
        )}
      </CForm>
    </div>
  );
};
