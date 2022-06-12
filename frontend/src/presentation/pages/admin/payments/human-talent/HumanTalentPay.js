import React, { useRef, useState } from "react";
import {
  CCard,
  CCardBody,
  CButton,
  CCol,
  CForm,
  CInput,
  CFormGroup,
  CLabel,
} from "@coreui/react";
import { withRouter, useHistory } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { CSVReader } from "react-papaparse";
import { toast } from "react-toastify";
import { getTthhPagosReviewApi, createTthhPagoApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { Loading } from "src/presentation/components";
import { TableApuErrorCsv } from "./components";

const HumanTalentPay = () => {
  const { errors, handleSubmit, control, register, reset } = useForm();
  const buttonRef = useRef();
  let history = useHistory();

  const [stateData, setStateData] = useState({
    file: [],
    resultData: [],
    error: "",
    validate: false,
    loading: false,
    loadingButton: false,
  });

  const handleError = useErrorHandler((error) => {
    setStateData((old) => ({
      ...old,
      file: [],
      resultData: [],
      validate: false,
      loading: false,
      loadingButton: false,
    }));
    toast.error(error.message);
  });

  const onSubmit = async (data, e) => {
    const dataTemp = { ...data, file: stateData.file };
    try {
      setStateData((old) => ({
        ...old,
        loadingButton: true,
      }));
      const response = await createTthhPagoApi(dataTemp);
      reset();
      toast.success(`${response} registrado nuevos.`);
      setStateData((old) => ({
        ...old,
        resultData: [],
        validate: false,
        loading: false,
        loadingButton: false,
      }));
      history.push("/pagos/talento-humano");
    } catch (error) {
      handleError(error);
    }
  };

  const handleOnDrop = async (data, file) => {
    setStateData((old) => ({ ...old, loading: true }));
    setTimeout(async () => {
      if (file.name.match(/\.(csv|CSV)$/)) {
        let dataTemp = [];
        data.map((csv) => dataTemp.push(csv.data));
        try {
          const response = await getTthhPagosReviewApi(dataTemp);
          console.log(response);
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
      loadingButton: false,
    }));
  };

  const cleanForm = (e) => {
    reset();
    setStateData((old) => ({
      ...old,
      resultData: [],
      validate: false,
      loading: false,
      loadingButton: false,
    }));
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  };

  return (
    <div>
      <CCard>
        <CCardBody>
          <CForm onSubmit={handleSubmit(onSubmit)}>
            <CFormGroup row className="my-0">
              <CCol xs="12" md="4">
                <CFormGroup className="d-flex flex-column">
                  <CLabel>
                    Fecha a descontar <span className="text-danger">*</span>
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
              <CCol xs="12" md="8">
                <CFormGroup>
                  <CLabel htmlFor="observacion">Observación general</CLabel>
                  <CInput
                    id="observacion"
                    placeholder="Ingrese el observación"
                    type="text"
                    name="observacion"
                    innerRef={register()}
                  />
                  <span className="text-danger">
                    {errors.observacion && errors.observacion.message}
                  </span>
                </CFormGroup>
              </CCol>
            </CFormGroup>
            <CFormGroup>
              <small className="text-danger">
                Por favor antes de enviar el CSV verfique bien los datos.
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
                <span>Suelte el archivo CSV aquí o haga clic para cargar.</span>
              </CSVReader>
            </CFormGroup>
            <div className="d-flex justify-content-between">
              <small className="text-muted ">
                <span className="text-danger">*</span> Campos obligatorios
              </small>
              {stateData.validate && (
                <>
                  {stateData.loadingButton ? (
                    <Loading />
                  ) : (
                    <div>
                      <CButton type="submit" color="primary">
                        Enviar
                      </CButton>
                      <CButton
                        type="button"
                        color="warning"
                        variant="outline"
                        className="ml-2"
                        onClick={cleanForm}
                      >
                        Limpiar
                      </CButton>
                    </div>
                  )}
                </>
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
        <TableApuErrorCsv data={stateData.resultData} />
      )}
    </div>
  );
};

export default withRouter(HumanTalentPay);
