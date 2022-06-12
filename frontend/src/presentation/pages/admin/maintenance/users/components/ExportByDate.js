import React, { useState } from "react";
import {
  CButton,
  CForm,
  CFormGroup,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CDataTable,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { getUserGenerateDateApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { downloadEcxel, downloadCsv } from "src/domain/utils/download";

export const ExportByDate = ({ setStateNext }) => {
  const { errors, handleSubmit, control, reset } = useForm();

  const [state, setState] = useState({
    user: [],
    error: "",
    reload: false,
    loading: false,
    loadingDownload: false,
  });

  const [formDataSearch, setFormDataSearch] = useState({
    mesInicio: null,
    mesFin: null,
  });

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
    toast.error(error.message);
  });

  const onSubmit = async (data) => {
    setState((old) => ({ ...old, loading: true }));
    try {
      const response = await getUserGenerateDateApi(data);
      setState((old) => ({
        ...old,
        user: response.data,
        loading: false,
        activeSearch: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const onClear = () => {
    reset({
      mesInicio: "",
      mesFin: "",
    });
    setFormDataSearch({
      mesInicio: null,
      mesFin: null,
    });
    setState((old) => ({
      user: [],
      activeSearch: true,
      error: "",
    }));
  };

  const exportExcel = async () => {
    setState((old) => ({ ...old, loadingDownload: true }));
    try {
      await downloadEcxel(state.user, "USUARIOS");
      setState((old) => ({
        ...old,
        loadingDownload: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const exportCsv = async () => {
    setState((old) => ({ ...old, loadingDownload: true }));
    try {
      await downloadCsv(state.user, "USUARIOS");
      setState((old) => ({
        ...old,
        loadingDownload: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const fields = [
    {
      key: "Cedula",
      label: "Cédula",
    },
    {
      key: "Nombres",
      label: "Nombres",
    },
    {
      key: "Facultad",
      label: "Facultad",
      filter: false,
    },
    {
      key: "Extension",
      label: "Extensión",
      filter: false,
    },
    {
      key: "Afiliado",
      label: "F. Afiliación",
      filter: false,
      _style: { width: "12%" },
    },
  ];

  return (
    <div>
      <CButton
        color="danger"
        variant="ghost"
        onClick={() =>
          setStateNext((old) => ({ ...old, isActiveFecha: false }))
        }
      >
        <CIcon name="cil-arrow-left" /> Regresar
      </CButton>
      <div className="alert alert-warning mt-2">
        <p className="h6 m-0">Exportar por fecha de afiliación</p>
      </div>
      <CForm onSubmit={handleSubmit(onSubmit)} className="mb-2">
        <CRow className="d-flex justify-content-center">
          <CFormGroup className="mb-0 mt-2 mt-md-0">
            <CInputGroup>
              <CInputGroupPrepend>
                <CInputGroupText>Desde</CInputGroupText>
              </CInputGroupPrepend>
              <Controller
                control={control}
                name="mesInicio"
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
                      setFormDataSearch({
                        ...formDataSearch,
                        mesInicio: data,
                      });
                    }}
                    dateFormat="dd-MMMM-yyyy"
                    locale="es"
                    placeholderText="DD-MM-YYYY"
                    autoComplete="off"
                    startDate={formDataSearch.mesInicio}
                    endDate={formDataSearch.mesFin}
                    className="form-control"
                  />
                )}
              />
            </CInputGroup>
            <span className="text-danger">
              {errors.mesInicio && errors.mesInicio.message}
            </span>
          </CFormGroup>
          <CFormGroup className="mb-0 mt-2 mt-md-0">
            <CInputGroup>
              <CInputGroupPrepend>
                <CInputGroupText>hasta</CInputGroupText>
              </CInputGroupPrepend>
              <Controller
                render={({ onChange, value }) => (
                  <DatePicker
                    name="mesFin"
                    selectsEnd
                    selected={value}
                    onChange={(data) => {
                      onChange(data);
                      setFormDataSearch({
                        ...formDataSearch,
                        mesFin: data,
                      });
                    }}
                    dateFormat="dd-MMMM-yyyy"
                    locale="es"
                    placeholderText="DD-MM-YYYY"
                    autoComplete="off"
                    startDate={formDataSearch.mesInicio}
                    endDate={formDataSearch.mesFin}
                    minDate={formDataSearch.mesInicio}
                    className="form-control"
                  />
                )}
                control={control}
                name="mesFin"
                defaultValue={null}
                rules={{
                  required: {
                    value: true,
                    message: "Campo es requerido",
                  },
                }}
              />
            </CInputGroup>
            <span className="text-danger">
              {errors.mesFin && errors.mesFin.message}
            </span>
          </CFormGroup>
          <CFormGroup className="mb-0 mt-2 mt-md-0">
            <CButton
              type="submit"
              color="primary"
              size="sm"
              className="ml-2"
              disabled={state.loading}
            >
              <CIcon name="cil-zoom" /> Buscar
            </CButton>
            <CButton
              type="button"
              variant="outline"
              color="warning"
              size="sm"
              className="ml-2"
              onClick={onClear}
              disabled={state.loading}
            >
              <CIcon name="cil-brush-alt" /> Limpiar
            </CButton>
          </CFormGroup>
        </CRow>
      </CForm>
      {state.user.length > 0 && (
        <>
          <CDropdown className="d-flex flex-row-reverse mb-2">
            <CDropdownToggle color="primary" disabled={state.loadingDownload}>
              {state.loadingDownload ? (
                <>Descangando...</>
              ) : (
                <>
                  <CIcon name="cil-settings" /> Exportar
                </>
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem onClick={exportExcel}>Todos Excel</CDropdownItem>
              <CDropdownItem onClick={exportCsv}>Todos Csv</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <CDataTable
            items={state.user}
            fields={fields}
            size="sm"
            columnFilter
            tableFilter={{
              label: "Buscar: ",
              placeholder: "Nombres o Cédula...",
            }}
            itemsPerPageSelect={{ label: "Elementos por página: " }}
            itemsPerPage={5}
            pagination
          />
        </>
      )}
    </div>
  );
};
