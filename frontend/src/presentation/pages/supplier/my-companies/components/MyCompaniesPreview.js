import React from "react";
import AspectRatio from "react-aspect-ratio";
import ReactMarkdown from "react-markdown";
import Img from "src/presentation/assets/img/png/No-imagen.png";
import { API_KEY } from "src/domain/utils/constant";

export const MyCompaniesPreview = ({ data }) => {
  const {
    url,
    nombre,
    razonSocial,
    telefono,
    direccion,
    descripcion,
  } = data.vendors;
  return (
    <div className="p-3">
      <div className="row product-page-main">
        <div className="col-xl-4 col-md-4">
          <AspectRatio ratio="560/350">
            <img
              className="img-fluid top-radius-blog"
              src={url === "" ? Img : `${API_KEY}/proveedor/publico/${url}`}
              alt=""
            />
          </AspectRatio>
        </div>
        <div className="col-xl-8 col-md-8 mt-3">
          <div className="product-page-details">
            <h4 className="font-weight-bold">{nombre}</h4>
            <div className="d-flex">
              <span>{razonSocial}</span>
            </div>
          </div>
          <hr />
          <div>
            <table>
              <tbody>
                <tr>
                  <td className="font-weight-bold pr-3">Teléfonos:</td>
                  <td>{telefono}</td>
                </tr>
                <tr>
                  <td className="font-weight-bold">Dirección:</td>
                  <td className="in-stock">{direccion}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <hr />
          <ReactMarkdown children={descripcion} skipHtml={true} />
        </div>
      </div>
    </div>
  );
};
