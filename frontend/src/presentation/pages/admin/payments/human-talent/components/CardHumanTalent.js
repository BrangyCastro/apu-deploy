import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCardTitle,
  CButton,
} from "@coreui/react";
import * as moment from "moment";

export const CardHumanTalent = ({ mes, tthhPagoTotal, setShow, show }) => {
  const showData = () => {
    setShow((old) => ({
      ...old,
      tableApu: false,
      tableHumanTalent: !old.tableHumanTalent,
    }));
  };
  return (
    <CCard>
      <CCardHeader>
        <h5>Talento Humano ( {moment(mes).format("MMMM YYYY")} ) </h5>
      </CCardHeader>
      <CCardBody>
        <CCardText>Datos enviados de talento humano</CCardText>
        <CCardTitle className="d-flex justify-content-between">
          <strong>Total:</strong>{" "}
          <span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(tthhPagoTotal)}
          </span>
        </CCardTitle>
        {show.tableHumanTalent ? (
          <CButton block color="danger" onClick={showData}>
            Cerrar
          </CButton>
        ) : (
          <CButton variant="outline" block color="primary" onClick={showData}>
            Ver datos
          </CButton>
        )}
      </CCardBody>
    </CCard>
  );
};
