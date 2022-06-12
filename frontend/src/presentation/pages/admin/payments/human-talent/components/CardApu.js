import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCardFooter,
  CCardTitle,
  CButton,
} from "@coreui/react";
import * as moment from "moment";
import { Link } from "react-router-dom";

export const CardApu = ({ mes, tthhTotal, tthhPago, setShow, show }) => {
  const showData = () => {
    setShow((old) => ({
      ...old,
      tableApu: !old.tableApu,
      tableHumanTalent: false,
    }));
  };

  return (
    <CCard>
      <CCardHeader>
        <h5>APU ( {moment(mes).format("MMMM YYYY")} ) </h5>
      </CCardHeader>
      <CCardBody>
        <CCardText>Datos enviados a talento humano para su descuento</CCardText>
        <CCardTitle className="d-flex justify-content-between">
          <strong>Total:</strong>{" "}
          <span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(tthhTotal)}
          </span>
        </CCardTitle>
        {show.tableApu ? (
          <CButton block color="danger" onClick={showData}>
            Cerrar
          </CButton>
        ) : (
          <CButton variant="outline" block color="primary" onClick={showData}>
            Ver datos
          </CButton>
        )}
      </CCardBody>
      <CCardFooter
        style={
          tthhPago.length > 0
            ? { background: "#63a55766" }
            : { background: "#ed1d2466" }
        }
        className="d-flex justify-content-between"
      >
        {tthhPago.length > 0 ? (
          <small className="align-self-center">Pago cancelado</small>
        ) : (
          <>
            <small className="align-self-center">Pago pendiente</small>
            <Link to="/pagos/talento-humano/descuento-csv">
              <CButton color="primary">Subir pago</CButton>
            </Link>
          </>
        )}
      </CCardFooter>
    </CCard>
  );
};
