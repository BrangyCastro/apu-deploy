import React, { useState } from "react";
import {
  CCol,
  CForm,
  CInput,
  CFormGroup,
  CLabel,
  CSelect,
  CButton,
  CInputFile,
  CTextarea,
} from "@coreui/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { SpinnerBouncer } from "src/presentation/components";
import { useErrorHandler } from "src/presentation/hooks";
import { createBudgetApi, uploadBudgetApi } from "src/domain/services";

export const NewBudgetForm = ({ reload }) => {
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
      const response = await createBudgetApi(data);
      await uploadBudgetApi(data.file[0], response.id);
      reload();
      reset();
      setState((old) => ({ ...old, loading: false }));
      toast.success("Presupuesto guardados");
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  return (
    <div>
      <h4>Nuevo presupuesto</h4>
      <CForm onSubmit={handleSubmit(onSubmit)}>
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
              required: "El titulo inicio es requerida.",
            })}
          />
          <span className="text-danger">
            {errors.titulo && errors.titulo.message}
          </span>
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="observacion">Observacion</CLabel>
          <CTextarea
            name="observacion"
            id="observacion"
            rows="4"
            placeholder="Ingrese una observacion"
            innerRef={register()}
          />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="status">
            Estado <span className="text-danger">*</span>
          </CLabel>
          <CSelect
            custom
            name="status"
            id="status"
            innerRef={register({
              required: "El estado es requerida.",
            })}
          >
            <option value="PUBLICO">Publico</option>
            <option value="PRIVADO">Privado</option>
          </CSelect>
          <span className="text-danger">
            {errors.status && errors.status.message}
          </span>
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="file">
            Archivo <span className="text-danger">*</span>
          </CLabel>
          <CInputFile
            id="file"
            name="file"
            innerRef={register({
              required: "El archivo es requerida.",
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
              <span className="text-danger">*</span> Campos obligatorios
            </small>
          </>
        )}
      </CForm>
    </div>
  );
};
