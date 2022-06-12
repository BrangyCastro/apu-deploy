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
  CSelect,
} from "@coreui/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { SpinnerBouncer } from "src/presentation/components";
import { keyPresNumberDecimal } from "src/presentation/shared";
import { useErrorHandler } from "src/presentation/hooks";
import { uploadConventionApi, updateConventionApi } from "src/domain/services";

export const EditConventionForm = ({ reload, setActiveEdit, dataEdit }) => {
  const {
    fechaInicio,
    fechaFin,
    descuento,
    descripcion,
    proveedor,
    status,
    id,
  } = dataEdit;
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
      proveedor: proveedor.id,
    };
    try {
      await updateConventionApi(id, dataTemp);
      if (data.file.length > 0) {
        await uploadConventionApi(data.file[0], id);
      }
      reload();
      setState((old) => ({ ...old, loading: false }));
      setActiveEdit(false);
      toast.success("Convenio actualizado");
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  return (
    <div>
      <h4>Editar convenio</h4>
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
            defaultValue={fechaInicio}
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
            defaultValue={fechaFin}
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
            defaultValue={descuento}
          />
          <span className="text-danger">
            {errors.descuento && errors.descuento.message}
          </span>
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="status">Estado</CLabel>
          <CSelect
            custom
            name="status"
            id="status"
            innerRef={register()}
            defaultValue={status}
          >
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Finalizado</option>
          </CSelect>
          <span className="text-danger">
            {errors.status && errors.status.message}
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
            defaultValue={descripcion}
          />
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
