import React, { useState, useEffect, useRef } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CForm,
  CFormGroup,
  CLabel,
  CCol,
} from "@coreui/react";
import { withRouter } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Typeahead } from "react-bootstrap-typeahead";
import DatePicker from "react-datepicker";
import { CSVReader } from "react-papaparse";
import { toast } from "react-toastify";
import {
  getVendorsApi,
  getVendorsApuApi,
  getSaleReviewApi,
  createSaleApuApi,
  createSaleVendorsApi,
} from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { Error, Loading } from "src/presentation/components";
import { TablePayrollError } from "./components";

const PayrollNew = () => {
  const { errors, handleSubmit, control } = useForm();
  const buttonRef = useRef();

  const [stateData, setStateData] = useState({
    file: [],
    resultData: [],
    validate: false,
    loading: false,
  });

  const [state, setState] = useState({
    vendors: [],
    error: "",
    reload: false,
    loading: false,
    loadingVendors: false,
  });

  const reload = () =>
    setState((old) => ({
      vendors: [],
      error: "",
      reload: !old.reload,
      loading: !old.loading,
      loadingVendors: !old.loadingVendors,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Nueva Nóminas";
    getVendors("ACTIVE");
    getVendorsApu();
    // eslint-disable-next-line
  }, [state.reload]);

  const onSubmit = async (data) => {
    const proveedor =
      data.proveedor.length > 0 ? data.proveedor[0].id : data.proveedor;
    const dataTemp = { ...data, file: stateData.file, proveedor };
    if (data.proveedor[0].convenio) {
      try {
        const response = await createSaleVendorsApi(dataTemp);
        reload();
        toast.success(`${response} registrado nuevos.`);
        setStateData((old) => ({
          ...old,
          resultData: [],
          validate: false,
          loading: false,
        }));
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await createSaleApuApi(dataTemp);
        reload();
        toast.success(`${response} registrado nuevos.`);
        setStateData((old) => ({
          ...old,
          resultData: [],
          validate: false,
          loading: false,
        }));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getVendors = async (status) => {
    setState((old) => ({ ...old, loadingVendors: true }));

    try {
      const response = await getVendorsApi(status);
      setState((old) => ({
        ...old,
        vendors: old.vendors.concat(response),
        loadingVendors: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const getVendorsApu = async () => {
    setState((old) => ({ ...old, loading: true }));
    try {
      const response = await getVendorsApuApi();
      setState((old) => ({
        ...old,
        vendors: old.vendors.concat(response),
        loading: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const handleOnDrop = async (data, file) => {
    setStateData((old) => ({ ...old, loading: true }));
    setTimeout(async () => {
      if (file.name.match(/\.(csv|CSV)$/)) {
        let dataTemp = [];
        data.map((csv) => dataTemp.push(csv.data));
        try {
          const response = await getSaleReviewApi(dataTemp);
          if (response.length > 0) {
            setStateData((old) => ({
              ...old,
              file: dataTemp,
              resultData: response,
              loading: false,
              validate: false,
            }));
          } else {
            setStateData((old) => ({
              ...old,
              file: dataTemp,
              resultData: response,
              loading: false,
              validate: true,
            }));
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        setStateData((old) => ({ ...old, loading: false }));
        toast.error("El archivo debe ser un CSV.");
      }
    }, 5000);
  };

  const handleOnRemoveFile = (data) => {
    setStateData((old) => ({
      ...old,
      resultData: [],
      validate: false,
      loading: false,
    }));
  };

  return (
    <div>
      {state.error ? (
        <Error error={state.error} reload={reload} />
      ) : (
        <>
          {state.loading || state.loadingVendors ? (
            <Loading />
          ) : (
            <>
              <CCard>
                <CCardBody>
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <CFormGroup row className="my-0">
                      <CCol xs="12" md="6">
                        <CFormGroup>
                          <CLabel>
                            Proveedor <span className="text-danger">*</span>
                          </CLabel>
                          <Controller
                            as={
                              <Typeahead
                                id="basic-typeahead"
                                labelKey="nombre"
                                multiple={false}
                                clearButton
                                options={state.vendors}
                                emptyLabel="Sin coincidencias"
                                placeholder="Seleccione un proveedor"
                              />
                            }
                            control={control}
                            rules={{
                              required: {
                                value: true,
                                message: "El proveedor es requerido",
                              },
                            }}
                            name="proveedor"
                            defaultValue=""
                          />
                          <span className="text-danger">
                            {errors.proveedor && errors.proveedor.message}
                          </span>
                        </CFormGroup>
                      </CCol>
                      <CCol xs="12" md="6">
                        <CFormGroup className="d-flex flex-column">
                          <CLabel>
                            Fecha a descontar{" "}
                            <span className="text-danger">*</span>
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
                    </CFormGroup>
                    <CFormGroup>
                      <small className="text-danger">
                        Por favor antes de enviar el CSV verfique bien los
                        datos.
                      </small>
                      <CSVReader
                        ref={buttonRef}
                        onDrop={handleOnDrop}
                        // onError={handleOnError}
                        addRemoveButton
                        config={{
                          header: true,
                          // delimiter: ",",
                          dynamicTyping: true,
                          encoding: "utf-8",
                        }}
                        removeButtonColor="#63a557"
                        onRemoveFile={handleOnRemoveFile}
                        className="form-control"
                      >
                        <span>
                          Suelte el archivo CSV aquí o haga clic para cargar.
                        </span>
                      </CSVReader>
                    </CFormGroup>
                    <div className="d-flex justify-content-between">
                      <small className="text-muted ">
                        <span className="text-danger">*</span> Campos
                        obligatorios
                      </small>
                      {stateData.validate && (
                        <CButton type="submit" color="primary">
                          Enviar
                        </CButton>
                      )}
                    </div>
                    <div className="d-flex justify-content-center">
                      {stateData.loading && (
                        <span className="text-primary">Validando datos...</span>
                      )}
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
              {stateData.resultData.length > 0 && (
                <TablePayrollError data={stateData.resultData} />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default withRouter(PayrollNew);
