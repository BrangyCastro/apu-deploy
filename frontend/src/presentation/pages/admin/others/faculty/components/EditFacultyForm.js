import React, { useState } from "react";
import {
  CButton,
  CModalFooter,
  CForm,
  CFormGroup,
  CLabel,
  CInput,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
} from "@coreui/react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { Typeahead } from "react-bootstrap-typeahead";
import { updateFacultyApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { SpinnerBouncer } from "src/presentation/components";

export const EditFacultyForm = ({
  title,
  setActive,
  active,
  faculty,
  reload,
  locationList,
}) => {
  const { id, localidad, nombreFacultad } = faculty;
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
    const idLocalidad =
      data.idLocalidad.length > 0 ? data.idLocalidad[0].id : data.idLocalidad;
    const dataTemp = { ...data, idLocalidad };
    setState((old) => ({ ...old, loading: true }));
    try {
      await updateFacultyApi(id, dataTemp);
      setState((old) => ({ ...old, loading: false }));
      reload();
      setActive(!active);
      toast.success("Facultad actualizada");
    } catch (error) {
      handleErrorLoad(error);
    }
  };
  return (
    <div>
      <CCard>
        <CCardHeader>{title}</CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit(onSubmit)}>
            <CFormGroup>
              <CLabel htmlFor="nombreFacultad">Nombre de la facultad</CLabel>
              <CInput
                id="nombreFacultad"
                placeholder="Ingrese la facultad"
                type="text"
                name="nombreFacultad"
                defaultValue={nombreFacultad}
                innerRef={register({
                  required: "La facultad es requerida.",
                })}
              />
              <span className="text-danger">
                {errors.nombreFacultad && errors.nombreFacultad.message}
              </span>
            </CFormGroup>
            <CFormGroup className="mb-3">
              <CLabel htmlFor="company">Extensión</CLabel>
              <Controller
                as={
                  <Typeahead
                    id="basic-typeahead"
                    labelKey="extension"
                    multiple={false}
                    options={locationList}
                    clearButton
                    emptyLabel="Sin coincidencias"
                    placeholder="Seleccione una extensión"
                    defaultSelected={[localidad]}
                  />
                }
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "La extensión es requerido",
                  },
                }}
                name="idLocalidad"
                defaultValue={localidad.id}
              />
              <span className="text-danger">
                {errors.idLocalidad && errors.idLocalidad.message}
              </span>
            </CFormGroup>
            <CModalFooter>
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
                  <CButton color="danger" onClick={() => setActive(!active)}>
                    Cancel
                  </CButton>
                  <CButton type="submit" color="warning">
                    Actualizar
                  </CButton>
                </>
              )}
            </CModalFooter>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};
