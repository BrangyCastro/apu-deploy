import React, { useState } from "react";
import {
  CCol,
  CForm,
  CInput,
  CFormGroup,
  CLabel,
  CButton,
  CSelect,
} from "@coreui/react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { Typeahead } from "react-bootstrap-typeahead";
import SimpleMDE from "react-simplemde-editor";
import { updateVendorsApi } from "src/domain/services";
import { KeyPresCedula } from "src/presentation/shared";
import { SpinnerBouncer } from "src/presentation/components";
import { useErrorHandler } from "src/presentation/hooks";

export const EditVendorsForm = ({ data }) => {
  const { register, errors, handleSubmit, control } = useForm();
  const {
    id,
    nombre,
    razonSocial,
    telefono,
    direccion,
    tipoCuenta,
    numeroCuenta,
    banco,
    descripcion,
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
    let userId = null;
    if (data.userId !== null) {
      userId = data.userId.length > 0 ? data.userId[0].id : data.userId;
    }
    const dataTemp = {
      ...data,
      userId,
      publico: data.publico === "true" ? true : false,
    };
    try {
      await updateVendorsApi(id, dataTemp);
      setState((old) => ({ ...old, loading: false }));
      toast.success("Datos actualizados");
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  return (
    <div className="p-3">
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CFormGroup>
          <CLabel htmlFor="facultad">Responsable del login</CLabel>
          <Controller
            as={
              <Typeahead
                id="basic-typeahead"
                labelKey="nombres"
                multiple={false}
                options={data.user}
                clearButton
                emptyLabel="Sin coincidencias"
                placeholder="Seleccione un usuario"
                defaultSelected={user ? [user] : []}
              />
            }
            control={control}
            name="userId"
            defaultValue={user ? user.id : null}
          />
          <span className="text-danger">
            {errors.userId && errors.userId.message}
          </span>
        </CFormGroup>
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
          <CCol xs="12" md="2">
            <CFormGroup>
              <CLabel htmlFor="publico">Publico</CLabel>
              <CSelect
                custom
                name="publico"
                id="publico"
                innerRef={register()}
                defaultValue={publico}
              >
                <option value={true}>Si</option>
                <option value={false}>No</option>
              </CSelect>
              <span className="text-danger">
                {errors.publico && errors.publico.message}
              </span>
            </CFormGroup>
          </CCol>
          <CCol xs="12" md="5">
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
          <CCol xs="12" md="5">
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
        <CFormGroup row className="my-0">
          <CCol xs="12" md="4">
            <CFormGroup>
              <CLabel htmlFor="banco">Entidad bancaria</CLabel>
              <CInput
                id="banco"
                placeholder="Ingrese la entidad bancaria"
                type="text"
                name="banco"
                innerRef={register()}
                defaultValue={banco}
              />
              <span className="text-danger">
                {errors.banco && errors.banco.message}
              </span>
            </CFormGroup>
          </CCol>
          <CCol xs="12" md="4">
            <CFormGroup>
              <CLabel htmlFor="tipoCuenta">Tipo de cuenta</CLabel>
              <CSelect
                custom
                name="tipoCuenta"
                id="tipoCuenta"
                innerRef={register()}
                defaultValue={tipoCuenta}
              >
                <option value="ahorro">Cuenta de ahorro</option>
                <option value="corriente">Cuenta de corriente</option>
              </CSelect>
              <span className="text-danger">
                {errors.tipoCuenta && errors.tipoCuenta.message}
              </span>
            </CFormGroup>
          </CCol>
          <CCol xs="12" md="4">
            <CFormGroup>
              <CLabel htmlFor="numeroCuenta">Número de cuenta</CLabel>
              <CInput
                id="numeroCuenta"
                placeholder="Ingrese el número de cuenta"
                type="text"
                name="numeroCuenta"
                innerRef={register()}
                onKeyPress={KeyPresCedula}
                defaultValue={numeroCuenta}
              />
              <span className="text-danger">
                {errors.numeroCuenta && errors.numeroCuenta.message}
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
