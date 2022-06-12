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
import { Typeahead } from "react-bootstrap-typeahead";
import { KeyPresCedula } from "src/presentation/shared";
import { updateUserApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import useAuth from "src/presentation/hooks/useAuth";
import { SpinnerBouncer } from "src/presentation/components";

export const EditUserForm = ({ user, faculty }) => {
  const userLogin = useAuth();
  const {
    cedula,
    nombres,
    facultad,
    email,
    emailPersonal,
    telefono,
    celular,
    id,
  } = user;

  const { register, errors, handleSubmit, control } = useForm();

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

    let facultad = 1;
    if (userLogin.user.status !== "PROVE") {
      facultad = data.facultad.length > 0 ? data.facultad[0].id : data.facultad;
    }
    const dataTemp = { ...data, facultad };

    try {
      await updateUserApi(id, dataTemp);
      setState((old) => ({ ...old, loading: false }));
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
              <CLabel htmlFor="cedula">Cédula</CLabel>
              <CInput
                id="cedula"
                placeholder="Ingrese su cédula"
                type="text"
                name="cedula"
                onKeyPress={KeyPresCedula}
                maxLength="10"
                disabled
                defaultValue={cedula}
              />
            </CFormGroup>
          </CCol>
          <CCol xs="12" md="6">
            <CFormGroup>
              <CLabel htmlFor="nombres">Nombres</CLabel>
              <CInput
                id="nombres"
                type="text"
                placeholder="Ingrese su nombres"
                name="nombres"
                disabled
                defaultValue={nombres}
              />
            </CFormGroup>
          </CCol>
        </CFormGroup>
        {userLogin.user.status === "PROVE" ? null : (
          <CFormGroup className="mb-3">
            <CLabel htmlFor="company">
              Facultad <span className="text-danger">*</span>
            </CLabel>
            <Controller
              as={
                <Typeahead
                  id="basic-typeahead"
                  labelKey="nombreFacultad"
                  multiple={false}
                  options={faculty}
                  clearButton
                  emptyLabel="Sin coincidencias"
                  placeholder="Seleccione un facultad"
                  defaultSelected={facultad ? [facultad] : []}
                />
              }
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "La facultad es requerido",
                },
              }}
              name="facultad"
              defaultValue={facultad ? facultad.id : null}
            />
            <span className="text-danger">
              {errors.facultad && errors.facultad.message}
            </span>
          </CFormGroup>
        )}
        <CFormGroup row className="my-0">
          <CCol xs="12" md="6">
            <CFormGroup>
              <CLabel htmlFor="correo1">
                Correo Institucional <span className="text-danger">*</span>
              </CLabel>
              <CInput
                id="correo1"
                placeholder="Ingrese su correo institucional"
                type="email"
                name="email"
                defaultValue={email}
                innerRef={register({
                  required: "El correo institucional es requerida.",
                })}
              />
            </CFormGroup>
            <span className="text-danger">
              {errors.email && errors.email.message}
            </span>
          </CCol>
          <CCol xs="12" md="6">
            <CFormGroup>
              <CLabel htmlFor="correo2">Correo Personal</CLabel>
              <CInput
                id="correo2"
                placeholder="Ingrese su correo personal"
                type="email"
                name="emailPersonal"
                defaultValue={emailPersonal}
                innerRef={register()}
              />
            </CFormGroup>
          </CCol>
        </CFormGroup>
        <CFormGroup row className="my-0">
          <CCol xs="12" md="6">
            <CFormGroup>
              <CLabel htmlFor="telefono">Teléfono</CLabel>
              <CInput
                id="telefono"
                placeholder="Ingrese su correo institucional"
                type="text"
                name="telefono"
                onKeyPress={KeyPresCedula}
                defaultValue={telefono}
                innerRef={register()}
              />
            </CFormGroup>
          </CCol>
          <CCol xs="12" md="6">
            <CFormGroup>
              <CLabel htmlFor="celular">Celular</CLabel>
              <CInput
                id="celular"
                placeholder="Ingrese su correo personal"
                type="text"
                name="celular"
                onKeyPress={KeyPresCedula}
                defaultValue={celular}
                innerRef={register()}
              />
            </CFormGroup>
          </CCol>
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
