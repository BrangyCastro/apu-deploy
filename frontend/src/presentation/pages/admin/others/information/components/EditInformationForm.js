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
} from "@coreui/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { SpinnerBouncer } from "src/presentation/components";
import { useErrorHandler } from "src/presentation/hooks";
import {
  updateInformationApi,
  uploadInformationApi,
} from "src/domain/services";

export const EditInformationForm = ({ reload, data, setActiveEdit }) => {
  const { register, errors, handleSubmit } = useForm();
  const { nombre, fechaInicio, fechaFin, status, id } = data;

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
      await updateInformationApi(id, data);
      if (data.file.length > 0) {
        await uploadInformationApi(data.file[0], id);
      }
      reload();
      setState((old) => ({ ...old, loading: false }));
      setActiveEdit(false);
      toast.success("Informe actualizado");
    } catch (error) {
      handleErrorLoad(error);
    }
  };
  return (
    <div>
      <h4>Editar informe</h4>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CFormGroup>
          <CLabel htmlFor="titulo">
            Titulo <span className="text-danger">*</span>
          </CLabel>
          <CInput
            id="titulo"
            placeholder="Ingrese el titulo"
            type="text"
            name="nombre"
            innerRef={register({
              required: "El titulo inicio es requerida.",
            })}
            defaultValue={nombre}
          />
          <span className="text-danger">
            {errors.titulo && errors.titulo.message}
          </span>
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="fechaInicio">
            Fecha inicio <span className="text-danger">*</span>
          </CLabel>
          <CInput
            id="fechaInicio"
            placeholder="Ingrese una fecha de inicio"
            type="date"
            name="fechaInicio"
            innerRef={register({
              required: "La fecha de inicio es requerida.",
            })}
            defaultValue={fechaInicio}
          />
          <span className="text-danger">
            {errors.fechaInicio && errors.fechaInicio.message}
          </span>
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="fechaFin">
            Fecha fin <span className="text-danger">*</span>
          </CLabel>
          <CInput
            id="fechaFin"
            placeholder="Ingrese una fecha final"
            type="date"
            name="fechaFin"
            innerRef={register({
              required: "La fecha final es requerida.",
            })}
            defaultValue={fechaFin}
          />
          <span className="text-danger">
            {errors.fechaFin && errors.fechaFin.message}
          </span>
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
