import React from "react";
import { CCol } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { Link } from "react-router-dom";
import { ShimmerCustom } from "src/presentation/components";
import { API_KEY } from "src/domain/utils/constant";
import Img from "src/presentation/assets/img/png/No-imagen.png";

export const ItemPromotions = ({ data }) => {
  const { titulo, url, proveedor, id } = data;

  return (
    <CCol xs="12" md="6" xl="4">
      <div className="card">
        <div className="blog-box blog-grid text-center product-box">
          <div className="product-img">
            <span className="ribbon ribbon-primary">{proveedor.nombre}</span>
            <ShimmerCustom
              url={
                url === ""
                  ? proveedor.url === ""
                    ? Img
                    : `${API_KEY}/proveedor/publico/${proveedor.url}`
                  : `${API_KEY}/promo/${url}`
              }
              path="promo"
              height="300px"
              width="100%"
            />
            <Link to={`${process.env.PUBLIC_URL}/promociones/${id}`}>
              <div className="product-hover">
                <ul>
                  <li>
                    <CIcon name="cil-link" />
                  </li>
                </ul>
              </div>
            </Link>
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
          </div>
        </div>
      </div>
    </CCol>
  );
};
