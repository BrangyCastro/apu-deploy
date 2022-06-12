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
import { createUserApi, sendMailCredentialsApi } from "src/domain/services";
import { KeyPresCedula } from "src/presentation/shared";
import {
  SpinnerBouncer,
  EmailSendTableAlert,
  Loading,
} from "src/presentation/components";
import { useErrorHandler } from "src/presentation/hooks";

export const NewUserForm = ({ reload, faculty, loadingFaculty }) => {
  const { register, errors, handleSubmit, control } = useForm();

  const [state, setState] = useState({
    loading: false,
    mainError: false,
  });

  const [activeFaculty, setActiveFaculty] = useState(0);

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, loading: false }));
    toast.error(error.message);
  });

  const onSubmit = async (data) => {
    if (!data.facultad) {
      setState((old) => ({ ...old, loading: true }));
      const dataTemp = {
        ...data,
        facultad: 1,
        clave: data.cedula,
      };
      try {
        await createUserApi(dataTemp);
        reload();
        setState((old) => ({ ...old, loading: false }));
        toast.success("Datos guardados");
      } catch (error) {
        handleErrorLoad(error);
      }
    } else {
      const facultad =
        data.facultad.length > 0 ? data.facultad[0].id : data.facultad;
      const dataTemp = {
        ...data,
        facultad,
        clave: data.cedula,
      };
      const dataTempEmail = {
        nombres: data.nombres,
        cedula: data.cedula,
        email: data.email,
      };
      await EmailSendTableAlert(
        data,
        "Datos guardados",
        () => createUserApi(dataTemp),
        () => sendMailCredentialsApi(dataTempEmail),
        () => reload()
      );
    }
  };

  return (
    <div className="p-3">
      <div className="alert alert-warning">
        <p className="h6">
          Antes de crear un nuevo usuario lea estas recomendaciones:
        </p>
        <ul style={{ marginLeft: "25px" }}>
          <li type="disc">
            Por defecto la contraseña sera su número de cédula.
          </li>
          <li type="disc">
            Es importante ingresar un correo institucional para que se pueda
            notificar las credenciales del afiliado.
          </li>
          <li type="disc">
            En caso que el rol sea <strong>PROVEEDOR</strong> no se selecciona
            una facultad.
          </li>
        </ul>
      </div>
      {loadingFaculty ? (
        <Loading />
      ) : (
        <CForm onSubmit={handleSubmit(onSubmit)}>
          <CFormGroup row className="my-0">
            <CCol xs="12" md="6">
              <CFormGroup>
                <CLabel htmlFor="cedula">
                  Cédula <span className="text-danger">*</span>
                </CLabel>
                <CInput
                  id="cedula"
                  placeholder="Ingrese su cédula"
                  type="text"
                  name="cedula"
                  onKeyPress={KeyPresCedula}
                  maxLength="10"
                  innerRef={register({
                    required: "La cédula es requerida.",
                  })}
                />
                <span className="text-danger">
                  {errors.cedula && errors.cedula.message}
                </span>
              </CFormGroup>
            </CCol>
            <CCol xs="12" md="6">
              <CFormGroup>
                <CLabel htmlFor="rol">
                  Rol <span className="text-danger">*</span>
                </CLabel>
                <CSelect
                  custom
                  name="rol"
                  id="rol"
                  onChange={(e) => setActiveFaculty(e.target.value)}
                  innerRef={register({
                    required: "El rol es requerida.",
                  })}
                >
                  <option value="1">Admin</option>
                  <option value="2">General</option>
                  <option value="3">Proveedor</option>
                </CSelect>
                <span className="text-danger">
                  {errors.rol && errors.rol.message}
                </span>
              </CFormGroup>
            </CCol>
          </CFormGroup>
          <CFormGroup row className="my-0">
            <CCol xs="12" md={activeFaculty === "3" ? "12" : "6"}>
              <CFormGroup>
                <CLabel htmlFor="nombres">
                  Nombres <span className="text-danger">*</span>
                </CLabel>
                <CInput
                  id="nombres"
                  type="text"
                  placeholder="Ingrese su nombres"
                  name="nombres"
                  innerRef={register({
                    required: "Los nombres es requerida.",
                  })}
                />
                <span className="text-danger">
                  {errors.nombres && errors.nombres.message}
                </span>
              </CFormGroup>
            </CCol>
            {activeFaculty === "3" ? null : (
              <CCol xs="12" md="6">
                <CFormGroup>
                  <CLabel htmlFor="facultad">
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
                    defaultValue=""
                  />
                  <span className="text-danger">
                    {errors.facultad && errors.facultad.message}
                  </span>
                </CFormGroup>
              </CCol>
            )}
          </CFormGroup>
          <CFormGroup row className="my-0">
            <CCol xs="12" md="6">
              <CFormGroup>
                <CLabel htmlFor="email">
                  Email Institucional <span className="text-danger">*</span>
                </CLabel>
                <CInput
                  id="email"
                  placeholder="Ingrese su email institucional"
                  type="email"
                  name="email"
                  innerRef={register({
                    required: "El correo institucional es requerida.",
                  })}
                />
                <span className="text-danger">
                  {errors.email && errors.email.message}
                </span>
              </CFormGroup>
            </CCol>
            <CCol xs="12" md="6">
              <CFormGroup>
                <CLabel htmlFor="emailPersonal">Email Personal</CLabel>
                <CInput
                  id="emailPersonal"
                  type="email"
                  placeholder="Ingrese su email personal"
                  name="emailPersonal"
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
                  placeholder="Ingrese su teléfono"
                  type="text"
                  name="telefono"
                  onKeyPress={KeyPresCedula}
                  innerRef={register()}
                />
              </CFormGroup>
            </CCol>
            <CCol xs="12" md="6">
              <CFormGroup>
                <CLabel htmlFor="celular">Celular</CLabel>
                <CInput
                  id="celular"
                  type="text"
                  placeholder="Ingrese su celular"
                  name="celular"
                  onKeyPress={KeyPresCedula}
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
      )}
    </div>
  );
};
