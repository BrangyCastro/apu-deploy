import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CForm,
  CFormGroup,
  CInput,
  CButton,
  CCol,
  CLabel,
} from "@coreui/react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { keyPresNumberDecimal } from "src/presentation/shared";
import { generateChargesTthhApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { Loading } from "src/presentation/components";
import { TableGenerate } from "./components";

const GenerateCharges = () => {
  const { errors, handleSubmit, control, register, reset } = useForm();

  useEffect(() => {
    document.title = "APU | Generar Cobro";
  }, []);

  const [state, setState] = useState({
    users: [],
    mes: null,
    error: "",
    loading: false,
  });

  const handleError = useErrorHandler((error) => {
    setState((old) => ({
      ...old,
      users: [],
      mes: null,
      error: "",
      loading: false,
    }));
    toast.error(error.message);
  });

  const onSubmit = async (data) => {
    setState((old) => ({
      ...old,
      loading: true,
    }));
    try {
      const response = await generateChargesTthhApi(data);
      setState((old) => ({
        ...old,
        users: response.venta,
        mes: data.mesDescontar,
        total: response.total,
        error: "",
        loading: false,
      }));
      toast.success(`Se han generado ${response.contador} registros nuevos.`);
    } catch (error) {
      handleError(error);
    }
  };

  const onClear = () => {
    reset();
    setState((old) => ({
      ...old,
      users: [],
      mes: null,
      error: "",
      loading: false,
    }));
  };

  return (
    <div>
      <div className="alert alert-warning">
        <p className="h6">Importante antes de generar los cobros:</p>
        <ul style={{ marginLeft: "25px" }}>
          <li type="disc">
            Asegurese que todas las nominas de los proveedores esten ingresadas
            para poder generar los cobros del mes actual.
          </li>
          <li type="disc">
            El listado generado es temporal, para poderlo visualizarlo otra vez
            tiene que ir a Talento Humano y buscar por el mes generado.
          </li>
          <li type="disc">
            Si genera por segunda vez una lista, solo se mostraran los valores
            nuevos o actualizados.
          </li>
        </ul>
      </div>
      <CCard>
        <CCardBody>
          <CForm onSubmit={handleSubmit(onSubmit)}>
            <CFormGroup row className="my-0">
              <CCol xs="12" md="6">
                <CFormGroup className="d-flex flex-column">
                  <CLabel>
                    Fecha a cobrar <span className="text-danger">*</span>
                  </CLabel>
                  <Controller
                    control={control}
                    name="mesDescontar"
                    defaultValue={null}
                    rules={{
                      required: {
                        value: true,
                        message: "Campo es requerido",
                      },
                    }}
                    render={({ onChange, value }) => (
                      <DatePicker
                        selectsStart
                        selected={value}
                        onChange={(data) => {
                          onChange(data);
                        }}
                        dateFormat="MMMM-yyyy"
                        showMonthYearPicker
                        locale="es"
                        placeholderText="MM-YYYY"
                        autoComplete="off"
                        className="form-control"
                      />
                    )}
                  />
                  <span className="text-danger">
                    {errors.mesDescontar && errors.mesDescontar.message}
                  </span>
                </CFormGroup>
              </CCol>
              <CCol xs="12" md="6">
                <CFormGroup>
                  <CLabel htmlFor="aporte">
                    Aporte <span className="text-danger">*</span>
                  </CLabel>
                  <CInput
                    id="aporte"
                    placeholder="Ingrese el aporte"
                    type="text"
                    name="aporte"
                    innerRef={register({
                      required: "El aporte es requerido.",
                    })}
                    onKeyPress={keyPresNumberDecimal}
                  />
                  <span className="text-danger">
                    {errors.aporte && errors.aporte.message}
                  </span>
                </CFormGroup>
              </CCol>
            </CFormGroup>
            {state.loading ? (
              <Loading />
            ) : (
              <div>
                <CButton type="submit" color="primary">
                  Generar cobro
                </CButton>
                <CButton
                  type="button"
                  color="warning"
                  variant="outline"
                  className="ml-2"
                  onClick={onClear}
                >
                  Limpiar
                </CButton>
              </div>
            )}
          </CForm>
        </CCardBody>
      </CCard>
      {state.users.length > 0 && (
        <TableGenerate data={state.users} mes={state.mes} total={state.total} />
      )}
    </div>
  );
};

export default GenerateCharges;
