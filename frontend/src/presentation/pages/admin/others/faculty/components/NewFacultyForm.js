import React, { useState } from "react";
import {
  CButton,
  CModalFooter,
  CForm,
  CFormGroup,
  CLabel,
  CInput,
  CCol,
} from "@coreui/react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { Typeahead } from "react-bootstrap-typeahead";
import { createFacyltyApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { SpinnerBouncer } from "src/presentation/components";

export const NewFacultyForm = ({ reload, setActive, active, location }) => {
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
    const datatemp = { ...data, idLocalidad };
    setState((old) => ({ ...old, loading: true }));
    try {
      await createFacyltyApi(datatemp);
      setState((old) => ({ ...old, loading: false }));
      reload();
      setActive(!active);
      toast.success("Facultad guardada");
    } catch (error) {
      handleErrorLoad(error);
    }
  };
  return (
    <div>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CFormGroup>
          <CLabel htmlFor="facultad">Nombre de la facultad</CLabel>
          <CInput
            id="facultad"
            placeholder="Ingrese la facultad"
            type="text"
            name="nombreFacultad"
            innerRef={register({
              required: "La extesión es requerida.",
              minLength: {
                value: 3,
                message: "Minimo 3 letras",
              },
              maxLength: {
                value: 80,
                message: "Maximo 80 letras",
              },
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
                options={location}
                clearButton
                emptyLabel="Sin coincidencias"
                placeholder="Seleccione una extensión"
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
            defaultValue=""
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
              <CButton type="submit" color="primary">
                Guardar
              </CButton>
            </>
          )}
        </CModalFooter>
      </CForm>
    </div>
  );
};
