import React, { useState } from "react";
import {
  CCol,
  CForm,
  CInput,
  CFormGroup,
  CLabel,
  CButton,
} from "@coreui/react";
import { useForm } from "react-hook-form";
import CIcon from "@coreui/icons-react";
import { toast } from "react-toastify";
import { updatePassAdminApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { SpinnerBouncer } from "src/presentation/components";

export const EditPassForm = ({ user }) => {
  const { id } = user;
  const { register, errors, handleSubmit, watch, reset } = useForm();
  const [showPassword1, setShowPassword1] = useState("cil-mood-good");
  const [showPassword2, setShowPassword2] = useState("cil-mood-good");

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
      await updatePassAdminApi(id, data);
      setState((old) => ({ ...old, loading: false }));
      reset();
      toast.success("Contraseña actualizada");
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const myFunction = (id) => {
    const x = document.getElementById(id);
    if (x.id === "claveNue") {
      if (x.type === "password") {
        x.type = "text";
        setShowPassword1("cil-mood-bad");
      } else {
        x.type = "password";
        setShowPassword1("cil-mood-good");
      }
    } else if (x.id === "confiNue") {
      if (x.type === "password") {
        x.type = "text";
        setShowPassword2("cil-mood-bad");
      } else {
        x.type = "password";
        setShowPassword2("cil-mood-good");
      }
    }
  };

  return (
    <div className="p-3 form-pass">
      <div className="alert alert-warning">
        <p className="h6">Tu nueva contraseña debe cumplir con:</p>
        <ul style={{ marginLeft: "25px" }}>
          <li type="disc">Tener de 8 a 12 caracteres.</li>
          <li type="disc">Incluir una mayúscula, minúscula y un número.</li>
          <li type="disc">No debe contener caracteres especiales.</li>
        </ul>
      </div>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CFormGroup row className="my-0 justify-content-center">
          <CCol xs="12" md="6">
            <CFormGroup className="form-group-login">
              <CLabel htmlFor="claveNue">
                Contraseña nueva <span className="text-danger">*</span>
              </CLabel>
              <CInput
                id="claveNue"
                type="password"
                placeholder="Ingrese su contraseña nueva"
                name="claveNue"
                autoComplete="off"
                innerRef={register({
                  required: "La nueva contraseña es requerida.",
                  minLength: {
                    value: 6,
                    message: "Mínimo 8 caractares",
                  },
                })}
              />
              <CIcon
                name={showPassword1}
                customClasses="password-icon"
                onClick={() => myFunction("claveNue")}
              />
              <span className="text-danger">
                {errors.claveNue && errors.claveNue.message}
              </span>
            </CFormGroup>
            <CFormGroup className="form-group-login">
              <CLabel htmlFor="confiNue">
                Confirmar contraseña <span className="text-danger">*</span>
              </CLabel>
              <CInput
                id="confiNue"
                type="password"
                placeholder="Confirme su contraseña"
                name="confiNue"
                autoComplete="off"
                innerRef={register({
                  required: "Confirmar contraseña es requerida.",
                  minLength: {
                    value: 6,
                    message: "Mínimo 8 caractares",
                  },
                  validate: (value) => {
                    if (value === watch("claveNue")) {
                      return true;
                    } else {
                      return "Las contraseñas no coinciden";
                    }
                  },
                })}
              />
              <CIcon
                name={showPassword2}
                customClasses="password-icon"
                onClick={() => myFunction("confiNue")}
              />
              <span className="text-danger">
                {errors.confiNue && errors.confiNue.message}
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
          </CCol>
        </CFormGroup>
      </CForm>
    </div>
  );
};
