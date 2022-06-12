import React from "react";
import { CCol, CButton } from "@coreui/react";
import * as moment from "moment";
import { Link } from "react-router-dom";
import CIcon from "@coreui/icons-react";

export const ItemReports = ({ data }) => {
  const { mesDescontar, total, id } = data;
  return (
    <CCol xs="12" md="6" xl="4">
      <div className="card">
        <div className="row product-page-main">
          <div className="col-xl-4 col-md-4 d-flex align-items-center justify-content-center">
            <CIcon name="cil-description" size="6xl" className="text-primary" />
          </div>
          <div className="col-xl-8 col-md-8 mt-3">
            <div>
              <span className="font-weight-bold">
                {moment(mesDescontar).format("MMMM YYYY").toUpperCase()}
              </span>
            </div>
            <hr />
            <div>
              <table>
                <tbody>
                  <tr>
                    <td className="font-weight-bold pr-3">$</td>
                    <td>{total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {mesDescontar === "2020-04-01" ||
            mesDescontar === "2020-03-01" ||
            mesDescontar === "2020-02-01" ||
            mesDescontar === "2020-01-01" ? (
              <></>
            ) : (
              <div className="m-t-15 mt-3">
                <Link to={`reportes/${id}`}>
                  <CButton variant="outline" size="sm" color="primary" block>
                    Ver mas detalle
                  </CButton>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </CCol>
  );
};
