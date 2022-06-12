import React from "react";
import { CCol, CButton } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import AspectRatio from "react-aspect-ratio";
import { Link } from "react-router-dom";
import { API_KEY } from "src/domain/utils/constant";
import { DeleteArchivedTableAlert } from "src/presentation/components";
import { deletePromotionsApi } from "src/domain/services";

export const ItemPromotions = ({ data, reload }) => {
  const { url, id, titulo, proveedor, status } = data;

  const accionDeletePromotions = async () => {
    await DeleteArchivedTableAlert(
      "Promoción eliminada",
      "Promoción finalizada",
      () => deletePromotionsApi(data.id, true),
      () => deletePromotionsApi(data.id, false),
      () => reload()
    );
  };

  return (
    <CCol xs="12" md="6" xl="4">
      <div className="card">
        <div className="blog-box blog-grid text-center product-box">
          <div className="product-img">
            <span className="ribbon ribbon-primary">{status}</span>
            <AspectRatio ratio="560/350">
              <img
                className="img-fluid top-radius-blog"
                src={
                  url === ""
                    ? `${API_KEY}/proveedor/publico/${proveedor.url}`
                    : `${API_KEY}/promo/${url}`
                }
                alt=""
              />
            </AspectRatio>
            <div className="product-hover">
              <ul>
                <li>
                  <button className="btn" type="button">
                    <Link
                      to={`${process.env.PUBLIC_URL}/mis-promociones/${id}`}
                    >
                      <CIcon name="cil-link" />
                    </Link>
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="blog-details-main">
            <h6
              className="blog-bottom-details"
              style={{
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {titulo}
            </h6>
            <CButton
              variant="ghost"
              color="danger"
              className="mb-1"
              onClick={accionDeletePromotions}
            >
              Eliminar
            </CButton>
          </div>
        </div>
      </div>
    </CCol>
  );
};
