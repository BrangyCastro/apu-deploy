import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CFormGroup,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { signIn } from "../../../domain/services";
import LogoApu from "../../assets/img/png/apu-logo.png";
import { SpinnerBouncer } from "../../components";
import { KeyPresCedula } from "../../shared";
import "./login.scss";

const Login = ({ setRefreshCheckLogin }) => {
  const { register, errors, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = useState("cil-mood-good");

  const [state, setState] = useState({
    mainError: "",
    reload: false,
    loading: false,
  });

  const onSubmit = async (data, e) => {
    setState((old) => ({ ...old, loading: true }));
    try {
      await signIn(data);
      setState((old) => ({ ...old, loading: false }));
      setRefreshCheckLogin(true);
    } catch (error) {
      toast.warning(error.message);
      setState((old) => ({
        ...old,
        loading: false,
        mainError: error.message,
      }));
    }
  };

  const myFunction = (id) => {
    const x = document.getElementById(id);
    if (x.id === "password") {
      if (x.type === "password") {
        x.type = "text";
        setShowPassword("cil-mood-bad");
      } else {
        x.type = "password";
        setShowPassword("cil-mood-good");
      }
    }
  };

  return (
    <div className="c-app c-default-layout flex-row align-items-center login-bg">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <h1>
                      Bienvenidos <br /> APU Transparencia
                    </h1>
                    <p className="text-muted">Iniciar sesión en su cuenta</p>
                    <CFormGroup className="mb-3">
                      <CInput
                        type="text"
                        placeholder="Ingrese su cédula"
                        name="cedula"
                        onKeyPress={KeyPresCedula}
                        maxLength="10"
                        innerRef={register({
                          required: "La cédula ese requerida.",
                        })}
                      />
                      <span className="text-danger">
                        {errors.cedula && errors.cedula.message}
                      </span>
                    </CFormGroup>
                    <CFormGroup className="mb-4 form-group-login">
                      <CInput
                        type="password"
                        id="password"
                        placeholder="Ingrese su contraseña"
                        name="clave"
                        autoComplete="off"
                        innerRef={register({
                          required: "La contraseña es requerida.",
                          minLength: {
                            value: 6,
                            message: "Mínimo 8 caractares",
                          },
                        })}
                      />
                      <CIcon
                        name={showPassword}
                        customClasses="password-icon"
                        onClick={() => myFunction("password")}
                      />
                      <span className="text-danger">
                        {errors.clave && errors.clave.message}
                      </span>
                    </CFormGroup>
                    <CRow>
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
                          <CCol xs="12" md="6">
                            <CButton color="primary" block type="submit">
                              Iniciar sesión
                            </CButton>
                          </CCol>
                          {/* <CCol xs="12" md="6" className="text-center">
                            <CButton color="link">
                              ¿Se te olvidó tu contraseña?
                            </CButton>
                          </CCol> */}
                        </>
                      )}
                    </CRow>
                    <div className="copyright-container">
                      <span className="copyright">
                        APU ULEAM © Copyright {new Date().getFullYear()}, Todos
                        los derechos reservados
                      </span>
                      <span className="version">v3.1.1</span>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="card-logo py-5">
                <CCardBody className="text-center d-flex align-items-center">
                  <div>
                    <img
                      src={LogoApu}
                      alt="Logo apu"
                      style={{ width: "100%" }}
                    />
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
