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
import { updateBudgetApi, uploadBudgetApi } from "src/domain/services";

export const EditBudgetForm = ({ reload, data, setActiveEdit }) => {
  const { register, errors, handleSubmit } = useForm();
  const { titulo, observacion, status, id } = data;
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
      await updateBudgetApi(id, data);
      if (data.file.length > 0) {
        await uploadBudgetApi(data.file[0], id);
      }
      reload();
      setState((old) => ({ ...old, loading: false }));
      setActiveEdit(false);
      toast.success("Presupuesto actualizado");
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  return (
    <div>
      <h4>Editar presupuesto</h4>
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
            defaultValue={titulo}
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
            defaultValue={observacion}
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
            defaultValue={status}
          >
            <option value="PUBLICO">Publico</option>
            <option value="PRIVADO">Privado</option>
          </CSelect>
          <span className="text-danger">
            {errors.status && errors.status.message}
          </span>
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="file">Archivo</CLabel>
          <CInputFile id="file" name="file" innerRef={register()} />
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
              <CButton type="submit" color="warning">
                Actualizar
              </CButton>
              <CButton
                color="danger"
                className="ml-2"
                onClick={() => setActiveEdit(false)}
              >
                Cancelar
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
