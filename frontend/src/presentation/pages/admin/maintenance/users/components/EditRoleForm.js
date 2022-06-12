import React, { useState } from "react";
import {
  CRow,
  CCol,
  CForm,
  CSelect,
  CFormGroup,
  CLabel,
  CButton,
} from "@coreui/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { updateRoleApi, deleteRoleApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { SpinnerBouncer } from "src/presentation/components";

export const EditRoleForm = ({ user, reload }) => {
  const { id } = user;
  const { register, errors, handleSubmit, reset } = useForm();

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
      await updateRoleApi(id, data.rol);
      setState((old) => ({ ...old, loading: false }));
      reset();
      reload();
      toast.success("Rol agregado");
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const deleteRole = async (data) => {
    try {
      await deleteRoleApi(id, data.id);
      reload();
      toast.success("Rol eliminado");
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  return (
    <div className="p-3">
      <CRow>
        <CCol xs="12" md="6">
          <CForm onSubmit={handleSubmit(onSubmit)}>
            <CFormGroup>
              <CLabel htmlFor="rol">
                Rol <span className="text-danger">*</span>
              </CLabel>
              <CSelect
                custom
                name="rol"
                id="rol"
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
                    Agregar rol
                  </CButton>
                </div>
                <small className="text-muted ">
                  <span className="text-danger">*</span> Campos obligatorios
                </small>
              </>
            )}
          </CForm>
        </CCol>
        <CCol xs="12" md="6" className="p-3">
          <h3>Lista de Roles</h3>
          {user.roles.map((item, index) => (
            <div
              key={index}
              className="d-flex justify-content-between align-items-center my-2"
            >
              <small className="text-muted">{item.role}</small>
              <CButton
                color="danger"
                size="sm"
                onClick={() => deleteRole(item)}
              >
                ELIMINAR
              </CButton>
            </div>
          ))}
        </CCol>
      </CRow>
    </div>
  );
};
