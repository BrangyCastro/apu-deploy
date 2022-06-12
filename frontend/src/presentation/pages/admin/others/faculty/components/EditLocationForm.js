import React, { useState } from "react";
import {
  CButton,
  CModalFooter,
  CForm,
  CFormGroup,
  CLabel,
  CInput,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
} from "@coreui/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { updateLocationApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { SpinnerBouncer } from "src/presentation/components";

export const EditLocationForm = ({
  title,
  setActive,
  active,
  location,
  reload,
}) => {
  const { id, extension } = location;
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
      await updateLocationApi(id, data);
      setState((old) => ({ ...old, loading: false }));
      reload();
      setActive(!active);
      toast.success("Extensión actualizada");
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  return (
    <div>
      <CCard>
        <CCardHeader>{title}</CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit(onSubmit)}>
            <CFormGroup>
              <CLabel htmlFor="extension">Nombre de la extensión</CLabel>
              <CInput
                id="extension"
                placeholder="Ingrese la extensión"
                type="text"
                name="extension"
                defaultValue={extension}
                innerRef={register({
                  required: "La extesión es requerida.",
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
                  <CButton type="submit" color="warning">
                    Actualizar
                  </CButton>
                </>
              )}
            </CModalFooter>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};
