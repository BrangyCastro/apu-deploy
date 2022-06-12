import React, { useState } from "react";
import {
  CModal,
  CModalHeader,
  CModalBody,
  CCol,
  CForm,
  CInput,
  CFormGroup,
  CLabel,
  CButton,
} from "@coreui/react";
import DataTable from "react-data-table-component";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { KeyPresCedula } from "src/presentation/shared";
import { SpinnerBouncer } from "src/presentation/components";
import { getAllsUserLikeApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import NoData from "src/presentation/assets/svg/no-data-bro.svg";

export const ModalSearchUser = ({ data, showModal, setShowModal }) => {
  const { register, errors, handleSubmit, reset } = useForm();

  const [state, setState] = useState({
    user: [],
    noData: false,
    loading: false,
    mainError: false,
  });

  const columnas = [
    {
      name: "Cédula",
      selector: "cedula",
      grow: 1,
    },
    {
      name: "Nombres",
      selector: "nombres",
      grow: 2,
    },
    {
      name: "Afiliado",
      //   selector: "status",
      cell: (row) => <div>{row.status === "ACTIVE" ? "Si" : "No"}</div>,
    },
  ];

  const handleError = useErrorHandler((error) => {
    setState((old) => ({ ...old, loading: false, user: [], noData: false }));
    toast.error(error.message);
  });

  const onSubmit = async (data) => {
    setState((old) => ({ ...old, loading: true, user: [], noData: false }));
    try {
      const response = await getAllsUserLikeApi(data);
      if (response.length > 0) {
        setState((old) => ({ ...old, loading: false, user: response }));
      } else {
        setState((old) => ({ ...old, loading: false, noData: true }));
      }
    } catch (error) {
      handleError(error);
    }
  };

  const onCloseModal = () => {
    setShowModal(!showModal);
    setState((old) => ({ ...old, user: [], noData: false }));
    reset();
  };

  return (
    <div>
      <CModal
        show={showModal}
        onClose={onCloseModal}
        size="lg"
        closeOnBackdrop={false}
      >
        <CModalHeader closeButton={true}>Buscar usuario</CModalHeader>
        <CModalBody>
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
                    defaultValue={data?.CEDULA}
                  />
                  <span className="text-danger">
                    {errors.cedula && errors.cedula.message}
                  </span>
                </CFormGroup>
              </CCol>
              <CCol xs="12" md="6">
                <CFormGroup>
                  <CLabel htmlFor="nombres">
                    Nombres <span className="text-danger">*</span>
                  </CLabel>
                  <CInput
                    id="nombres"
                    placeholder="Ingrese el nombres"
                    type="text"
                    name="nombres"
                    innerRef={register({
                      required: "La cédula es requerida.",
                    })}
                    defaultValue={data?.NOMBRES}
                  />
                  <span className="text-danger">
                    {errors.nombres && errors.nombres.message}
                  </span>
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
                <small className="text-muted">
                  <span className="text-danger">*</span> Campos obligatorios
                </small>
                <div className="form-actions mt-3">
                  <CButton type="submit" color="primary">
                    Buscar
                  </CButton>
                </div>
              </>
            )}
          </CForm>
          {state.noData && (
            <>
              <div className="alert alert-danger mt-2">
                <p className="h6 m-0">
                  No coinciden los datos del USUARIO con la base de datos.
                </p>
              </div>
              <img
                src={NoData}
                alt="noData"
                style={{
                  width: "300px",
                  margin: "auto",
                  display: "block",
                }}
              />
            </>
          )}
          {state.user.length > 0 && (
            <>
              <>
                <div className="alert alert-warning mt-2">
                  <p className="h6 m-0">
                    Los datos del USUARIO ingresados en los campos son los que
                    coinciden con los de la tabla.
                  </p>
                </div>
                <DataTable
                  columns={columnas}
                  data={state.user}
                  highlightOnHover
                  noHeader
                  // noDataComponent={<NoDataConst />}
                />
              </>
            </>
          )}
        </CModalBody>
      </CModal>
    </div>
  );
};
