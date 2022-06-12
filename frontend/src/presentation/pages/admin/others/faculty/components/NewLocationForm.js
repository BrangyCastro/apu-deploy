import React, { useState } from "react";
import {
  CButton,
  CModalFooter,
  CForm,
  CFormGroup,
  CLabel,
  CInput,
  CCol,
} from "@coreui/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createLocationApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { SpinnerBouncer } from "src/presentation/components";

export const NewLocationForm = ({ reload, setActive, active }) => {
  const { register, errors, handleSubmit } = useForm();

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
      await createLocationApi(data);
      setState((old) => ({ ...old, loading: false }));
      reload();
      setActive(!active);
      toast.success("Extensión guardada");
    } catch (error) {
      handleErrorLoad(error);
    }
  };
  return (
    <div>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CFormGroup>
          <CLabel htmlFor="extension">Nombre de la extensión</CLabel>
          <CInput
            id="extension"
            placeholder="Ingrese la extensión"
            type="text"
            name="extension"
            innerRef={register({
              required: "La extesión es requerida.",
              minLength: {
                value: 3,
                message: "Minimo 3 letras",
              },
              maxLength: {
                value: 20,
                message: "Maximo 20 letras",
              },
            })}
          />
          <span className="text-danger">
            {errors.extension && errors.extension.message}
          </span>
        </CFormGroup>
        <CModalFooter>
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
              <CButton color="danger" onClick={() => setActive(!active)}>
                Cancel
              </CButton>
              <CButton type="submit" color="primary">
                Guardar
              </CButton>
            </>
          )}
        </CModalFooter>
      </CForm>
    </div>
  );
};
