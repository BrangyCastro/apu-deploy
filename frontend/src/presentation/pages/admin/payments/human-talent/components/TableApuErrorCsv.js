import React, { useState } from "react";
import { CCard, CCardBody } from "@coreui/react";
import DataTable from "react-data-table-component";
import { ModalSearchUser } from "src/presentation/components";

export const TableApuErrorCsv = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    CEDULA: null,
    NOMBRES: null,
  });

  const columns = [
    {
      selector: "CEDULA",
      name: "Cédula",
      sortable: true,
    },
    {
      selector: "NOMBRES",
      name: "Nombres",
      sortable: true,
      grow: 4,
    },
    {
      selector: "TOTAL",
      name: "Total",
      sortable: true,
      right: true,
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: "25px", // override the row height
      },
    },
    headCells: {
      style: {
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
  };

  const conditionalRowStyles = [
    {
      when: (row) => row.user === false,
      style: {
        backgroundColor: "#ed1d24",
        color: "white",
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
  ];

  const handleRowClick = (row) => {
    setModalData(row);
    setShowModal(true);
  };

  return (
    <div>
      <CCard>
        <CCardBody>
          <div className="alert alert-danger">
            <p className="h6">
              Los siguientes usuarios tienen inconsistencia con los datos
              ingresados, por favor modifique el archivo Excel y vuelva a
              generar el CSV con los errores ya solucionados. Posibles errores:
            </p>
            <ul style={{ marginLeft: "25px" }}>
              <li type="disc">
                Los campos obligatorios son: <strong>CEDULA</strong>,{" "}
                <strong>TOTAL</strong>.
              </li>
              <li type="disc">
                En caso de que se marque todo en rojo significa que ese usuario
                no existe en la base de datos, puede darle click para buscar por
                nombre en caso de que la cédula este equivocada.
              </li>
            </ul>
          </div>
          <DataTable
            data={data}
            columns={columns}
            customStyles={customStyles}
            conditionalRowStyles={conditionalRowStyles}
            itemsPerPage={10}
            onRowClicked={handleRowClick}
            pagination
            noHeader
          />
        </CCardBody>
      </CCard>
      <ModalSearchUser
        data={modalData}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </div>
  );
};
