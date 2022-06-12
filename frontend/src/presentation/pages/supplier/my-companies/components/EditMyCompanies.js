import React, { useState } from "react";
import {
  CCol,
  CForm,
  CInput,
  CFormGroup,
  CLabel,
  CButton,
} from "@coreui/react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import SimpleMDE from "react-simplemde-editor";
import { updateVendorsApi } from "src/domain/services";
import { SpinnerBouncer } from "src/presentation/components";
import { useErrorHandler } from "src/presentation/hooks";

export const EditMyCompanies = ({ data, reload }) => {
  const { register, errors, handleSubmit, control } = useForm();
  const {
    nombre,
    razonSocial,
    telefono,
    direccion,
    descripcion,
    id,
    tipoCuenta,
    numeroCuenta,
    banco,
    user,
    publico,
  } = data.vendors;

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
      tipoCuenta,
      numeroCuenta,
      banco,
      userId: user.id,
      publico,
    };

    try {
      await updateVendorsApi(id, dataTemp);
      setState((old) => ({ ...old, loading: false }));
      reload();
      toast.success("Datos actualizados");
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  return (
    <div className="p-3">
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CFormGroup row className="my-0">
          <CCol xs="12" md="6">
            <CFormGroup>
              <CLabel htmlFor="nombre">
                Nombre de la empresa <span className="text-danger">*</span>
              </CLabel>
              <CInput
                id="nombre"
                placeholder="Ingrese el nombre de la empresa"
                type="text"
                name="nombre"
                innerRef={register({
                  required: "El nombre de la empresa es requerida.",
                })}
                defaultValue={nombre}
              />
              <span className="text-danger">
                {errors.nombre && errors.nombre.message}
              </span>
            </CFormGroup>
          </CCol>
          <CCol xs="12" md="6">
            <CFormGroup>
              <CLabel htmlFor="razonSocial">
                Nombre del propietario <span className="text-danger">*</span>
              </CLabel>
              <CInput
                id="razonSocial"
                placeholder="Ingrese el nombre del propietaario"
                type="text"
                name="razonSocial"
                innerRef={register({
                  required: "El nombre del propietaario es requerida.",
                })}
                defaultValue={razonSocial}
              />
              <span className="text-danger">
                {errors.razonSocial && errors.razonSocial.message}
              </span>
            </CFormGroup>
          </CCol>
        </CFormGroup>
        <CFormGroup row className="my-0">
          <CCol xs="12" md="6">
            <CFormGroup>
              <CLabel htmlFor="direccion">Dirección</CLabel>
              <CInput
                id="direccion"
                placeholder="Ingrese la direccion"
                type="text"
                name="direccion"
                innerRef={register()}
                defaultValue={direccion}
              />
              <span className="text-danger">
                {errors.direccion && errors.direccion.message}
              </span>
            </CFormGroup>
          </CCol>
          <CCol xs="12" md="6">
            <CFormGroup>
              <CLabel htmlFor="telefono">Teléfonos</CLabel>
              <CInput
                id="telefono"
                placeholder="Ingrese el teléfono"
                type="text"
                name="telefono"
                innerRef={register()}
                defaultValue={telefono}
              />
              <span className="text-danger">
                {errors.telefono && errors.telefono.message}
              </span>
            </CFormGroup>
          </CCol>
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="descripcion">Descripción</CLabel>
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
            defaultValue={descripcion}
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
              <CButton type="submit" color="warning">
                Actualizar
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
