import React, { useState } from "react";
import {
  CCol,
  CRow,
  CForm,
  CFormGroup,
  CInputFile,
  CButton,
} from "@coreui/react";
import Cropper from "react-cropper";
import { toast } from "react-toastify";
import { API_KEY } from "src/domain/utils/constant";
import { SpinnerBouncer } from "src/presentation/components";
import { updateAvatarVendorsApi } from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import NoImagen from "src/presentation/assets/img/png/No-imagen.png";

export const EditAvatarVendors = ({ data, reload }) => {
  const { url, id } = data.vendors;
  const avatar = url ? `${API_KEY}/proveedor/publico/${url}` : NoImagen;
  const [image, setImage] = useState(null);
  const [cropper, setCropper] = useState();
  const [fileName, setFileName] = useState("");

  const [state, setState] = useState({
    loading: false,
    mainError: false,
  });

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, loading: false }));
    toast.error(error.message);
  });

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      if (e.dataTransfer) {
        files = e.dataTransfer.files;
      } else if (e.target) {
        files = e.target.files;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setImage(null);
    }
  };

  const updateAvatar = async () => {
    setState((old) => ({ ...old, loading: true }));
    const base64 = cropper.getCroppedCanvas().toDataURL();
    try {
      await updateAvatarVendorsApi(base64, fileName, id);
      setState((old) => ({ ...old, loading: false }));
      toast.success("Foto actualizados");
      reload();
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  return (
    <div className="p-3">
      <h2>Editar la foto de perfil de la empresa</h2>

      <CForm>
        <CFormGroup>
          <CInputFile id="file-input" name="file-input" onChange={onChange} />
        </CFormGroup>
        {image === null ? (
          <div className="box d-flex justify-content-center">
            <img
              style={{
                width: "250px",
                height: "250px",
                overflow: "hidden",
              }}
              src={avatar}
              alt="No Imagen"
            />
          </div>
        ) : (
          <>
            <CRow>
              <CCol xl="6">
                <Cropper
                  style={{ height: 400, width: "100%" }}
                  initialAspectRatio={1}
                  aspectRatio={1}
                  preview=".img-preview"
                  src={image}
                  viewMode={1}
                  guides={true}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                  onInitialized={(instance) => {
                    setCropper(instance);
                  }}
                />
              </CCol>
              <CCol xl="6">
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <h4>Vista previa</h4>
                  <div
                    className="img-preview"
                    style={{
                      width: "100%",
                      height: "300px",
                      overflow: "hidden",
                    }}
                  />
                </div>
              </CCol>
            </CRow>
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
                <div className="form-actions mt-3">
                  <CButton color="warning" onClick={updateAvatar}>
                    Actualizar
                  </CButton>
                </div>
              </>
            )}
          </>
        )}
      </CForm>
    </div>
  );
};
