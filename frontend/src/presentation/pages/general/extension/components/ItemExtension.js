import React from "react";
import { CCol } from "@coreui/react";
import CIcon from "@coreui/icons-react";

export const ItemExtension = ({ data }) => {
  const { nombre, descripcion } = data;
  return (
    <CCol xs="12" md="6" xl="4">
      <div className="card">
        <div className="row product-page-main">
          <div className="col-xl-4 col-md-4 d-flex align-items-center justify-content-center">
            <CIcon name="cil-building" size="6xl" className="text-primary" />
          </div>
          <div className="col-xl-8 col-md-8 mt-3">
            <div>
              <span className="font-weight-bold">{nombre}</span>
            </div>
            <hr />
            <div>
              <table>
                <tbody>
                  <tr>
                    <td>{descripcion}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </CCol>
  );
};
