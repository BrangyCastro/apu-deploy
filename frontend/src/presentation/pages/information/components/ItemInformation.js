import React from "react";
import { CCol, CButton } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { API_KEY } from "src/domain/utils/constant";

export const ItemInformation = ({ data }) => {
  const { nombre, archivo } = data;
  return (
    <CCol xs="12" md="6" xl="6">
      <div className="card">
        <div className="row product-page-main">
          <div className="col-xl-4 col-md-4 d-flex align-items-center justify-content-center">
            <CIcon name="cil-description" size="4xl" className="text-primary" />
          </div>
          <div className="col-xl-8 col-md-8 mt-3">
            <div>
              <span className="font-weight-bold">{nombre}</span>
            </div>
            <hr />
            <div className="m-t-15">
              <CButton
                size="sm"
                color="info"
                href={`${API_KEY}/informe/publico/${archivo}`}
                target="_blank"
              >
                Ver archivo
              </CButton>
            </div>
          </div>
        </div>
      </div>
    </CCol>
  );
};
