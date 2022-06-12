import React from "react";
import { CCol } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import AspectRatio from "react-aspect-ratio";
import { Link } from "react-router-dom";
import Img from "src/presentation/assets/img/png/No-imagen.png";
import { API_KEY } from "src/domain/utils/constant";

export const ItemMyCompanies = ({ data }) => {
  const { url, id, nombre } = data;
  return (
    <CCol xs="12" md="6" xl="4">
      <div className="card">
        <div className="blog-box blog-grid text-center product-box">
          <div className="product-img">
            <AspectRatio ratio="560/350">
              <img
                className="img-fluid top-radius-blog"
                src={url === "" ? Img : `${API_KEY}/proveedor/publico/${url}`}
                alt=""
              />
            </AspectRatio>
            <div className="product-hover">
              <ul>
                <li>
                  <button className="btn" type="button">
                    <Link to={`${process.env.PUBLIC_URL}/mis-companias/${id}`}>
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
              {nombre}
            </h6>
          </div>
        </div>
      </div>
    </CCol>
  );
};
