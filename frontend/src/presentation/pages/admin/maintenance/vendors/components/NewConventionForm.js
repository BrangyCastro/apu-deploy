import React, { useState } from "react";
import {
  CCol,
  CForm,
  CInput,
  CFormGroup,
  CLabel,
  CButton,
  CInputFile,
  CTextarea,
} from "@coreui/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { SpinnerBouncer } from "src/presentation/components";
import { keyPresNumberDecimal } from "src/presentation/shared";
import { useErrorHandler } from "src/presentation/hooks";
import { uploadConventionApi, createConventionApi } from "src/domain/services";

export const NewConventionForm = ({ reload, id }) => {
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
    const dataTemp = {
      ...data,
      proveedor: id,
    };
    try {
      const response = await createConventionApi(dataTemp);
      await uploadConventionApi(data.file[0], response.id);
      reload();
      setState((old) => ({ ...old, loading: false }));
      toast.success("Convenio guardado");
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  return (
    <div>
      <h4>Nuevo convenio</h4>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CFormGroup>
          <CLabel htmlFor="fechaInicio">
            Fecha de inicio <span className="text-danger">*</span>
          </CLabel>
          <CInput
            id="fechaInicio"
            placeholder="Ingrese la fecha de inicio"
            type="date"
            name="fechaInicio"
            innerRef={register({
              required: "La fecha inicio es requerida.",
            })}
          />
          <span className="text-danger">
            {errors.fechaInicio && errors.fechaInicio.message}
          </span>
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="fechaFin">
            Fecha de final <span className="text-danger">*</span>
          </CLabel>
          <CInput
            id="fechaFin"
            placeholder="Ingrese la fecha final"
            type="date"
            name="fechaFin"
            innerRef={register({
              required: "La fecha final es requerida.",
            })}
          />
          <span className="text-danger">
            {errors.fechaFin && errors.fechaFin.message}
          </span>
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="descuento">
            Descuento (%) <span className="text-danger">*</span>
          </CLabel>
          <CInput
            id="descuento"
            placeholder="Ingrese el descuento"
            type="text"
            name="descuento"
            onKeyPress={keyPresNumberDecimal}
            innerRef={register({
              required: "El descuento es requerida.",
            })}
          />
          <span className="text-danger">
            {errors.descuento && errors.descuento.message}
          </span>
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="descripcion">Descripción</CLabel>
          <CTextarea
            name="descripcion"
            id="descripcion"
            rows="4"
            placeholder="Ingrese una descripción"
            innerRef={register()}
          />
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
