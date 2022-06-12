import React, { useState } from "react";
import {
  CCol,
  CForm,
  CInput,
  CFormGroup,
  CLabel,
  CButton,
  CSelect,
  CInputFile,
} from "@coreui/react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { Typeahead } from "react-bootstrap-typeahead";
import SimpleMDE from "react-simplemde-editor";
import { SpinnerBouncer } from "src/presentation/components";
import { useErrorHandler } from "src/presentation/hooks";
import { uploadPromotionsApi, updatePromotionsApi } from "src/domain/services";

export const EditPromotionsForm = ({ data }) => {
  const { vendors } = data;
  const { titulo, fechaInicio, fechaFin, status, descripcion, proveedor, id } =
    data.promotions;
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
    setState((old) => ({ ...old, loading: true }));
    const proveedor =
      data.proveedor.length > 0 ? data.proveedor[0].id : data.proveedor;
    const dataTemp = { ...data, proveedor };
    try {
      await updatePromotionsApi(id, dataTemp);
      if (data.file.length > 0) {
        await uploadPromotionsApi(data.file[0], id);
      }
      setState((old) => ({ ...old, loading: false }));
      toast.success("Promoción actualizada");
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  return (
    <div className="p-3">
      <div className="alert alert-warning">
        <p className="h6">IMPORTANTE</p>
        <ul style={{ marginLeft: "25px" }}>
          <li type="disc">
            Las fechas de inicio y fin son opcionales, en caso de que su
            promoción las tenga ubicarla.
          </li>
          <li type="disc">
            Solo se aceptan imagenes <strong>PNG, JPG, JPEG</strong>.
          </li>
          <li type="disc">
            Para una mejor experiencia con los cliente se recomienda la
            siguiente dimensión para la imagen: 1280 x 720 píxeles (16:9)
          </li>
        </ul>
      </div>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CFormGroup row className="my-0">
          <CCol xs="12" md="6">
            <CFormGroup>
              <CLabel htmlFor="fechaInicio">Fecha de inicio</CLabel>
              <CInput
                id="fechaInicio"
                type="datetime-local"
                name="fechaInicio"
                innerRef={register()}
                defaultValue={fechaInicio}
              />
            </CFormGroup>
          </CCol>
          <CCol xs="12" md="6">
            <CFormGroup>
              <CLabel htmlFor="fechaFin">Fecha final</CLabel>
              <CInput
                id="fechaFin"
                type="datetime-local"
                name="fechaFin"
                innerRef={register()}
                defaultValue={fechaFin}
              />
            </CFormGroup>
          </CCol>
        </CFormGroup>
        <CFormGroup row className="my-0">
          <CCol xs="12" md="6">
            <CFormGroup>
              <CLabel htmlFor="proveedor">
                Proveedor <span className="text-danger">*</span>
              </CLabel>
              <Controller
                as={
                  <Typeahead
                    id="basic-typeahead"
                    labelKey="nombre"
                    multiple={false}
                    options={vendors}
                    clearButton
                    emptyLabel="Sin coincidencias"
                    placeholder="Seleccione un proveedor"
                    defaultSelected={proveedor ? [proveedor] : []}
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
                defaultValue={proveedor ? proveedor.id : ""}
              />
              <span className="text-danger">
                {errors.proveedor && errors.proveedor.message}
              </span>
            </CFormGroup>
          </CCol>
          <CCol xs="12" md="6">
            <CFormGroup>
              <CLabel htmlFor="status">
                Estado <span className="text-danger">*</span>
              </CLabel>
              <CSelect
                custom
                name="status"
                id="status"
                innerRef={register({
                  required: "El estado es requerida.",
                })}
                defaultValue={status}
              >
                <option value="PUBLICO">Publico</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="ARCHIVADO">Archivado</option>
              </CSelect>
              <span className="text-danger">
                {errors.status && errors.status.message}
              </span>
            </CFormGroup>
          </CCol>
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="titulo">
            Titulo <span className="text-danger">*</span>
          </CLabel>
          <CInput
            id="titulo"
            placeholder="Ingrese el titulo"
            type="text"
            name="titulo"
            innerRef={register({
              required: "El titulo es requerida.",
            })}
            defaultValue={titulo}
          />
          <span className="text-danger">
            {errors.titulo && errors.titulo.message}
          </span>
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="descripcion">
            Descripción <span className="text-danger">*</span>
          </CLabel>
          <Controller
            control={control}
            name="descripcion"
            as={<SimpleMDE />}
            id="editor_container"
            options={{
              autofocus: true,
              spellChecker: false,
              placeholder: "Ingresa una descripción",
            }}
            rules={{
              required: {
                value: true,
                message: "La descripción es requerido",
              },
            }}
            defaultValue={descripcion}
          />
          <span className="text-danger">
            {errors.descripcion && errors.descripcion.message}
          </span>
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="file">Imagen</CLabel>
          <CInputFile id="file" name="file" innerRef={register()} />
          <span className="text-danger">
            {errors.file && errors.file.message}
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
      </CForm>
    </div>
  );
};
