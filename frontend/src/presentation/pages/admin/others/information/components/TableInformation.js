import React from "react";
import { CDataTable, CBadge, CButton } from "@coreui/react";
import * as moment from "moment";
import { API_KEY } from "src/domain/utils/constant";
import { deleteInformationApi } from "src/domain/services";
import { DeleteTableAlert } from "src/presentation/components";

export const TableInformation = ({
  data,
  reload,
  setActiveEdit,
  setDataEdit,
}) => {
  const { information } = data;

  const accionDeleteInformation = async (data) => {
    await DeleteTableAlert(
      "Informe eliminado",
      () => deleteInformationApi(data.id),
      () => reload()
    );
  };

  const accionEditInformation = (data) => {
    setActiveEdit(true);
    setDataEdit(data);
  };

  const fields = [
    {
      key: "nombre",
      label: "Titulo",
    },
    {
      key: "fecha",
      label: "Fecha",
    },
    {
      key: "status",
      label: "Estado",
      filter: false,
    },
    {
      key: "accion",
      label: "Acción",
      filter: false,
      _style: { width: "42%" },
    },
  ];
  return (
    <div>
      <CDataTable
        items={information}
        fields={fields}
        size="sm"
        itemsPerPageSelect={{ label: "Elementos por página: " }}
        itemsPerPage={10}
        pagination
        scopedSlots={{
          status: (item) => (
            <td>
              {item.status === "PUBLICO" && (
                <CBadge color="primary">Publico</CBadge>
              )}
              {item.status === "PRIVADO" && (
                <CBadge color="danger">Privado</CBadge>
              )}
            </td>
          ),
          fecha: (item) => (
            <td>
              {moment(item.fechaInicio).format("L")} -{" "}
              {moment(item.fechaFin).format("L")}
            </td>
          ),
          accion: (item) => (
            <td>
              {item.archivo && (
                <CButton
                  size="sm"
                  color="info"
                  href={`${API_KEY}/informe/publico/${item.archivo}`}
                  target="_blank"
                >
                  Ver archivo
                </CButton>
              )}
              <CButton
                size="sm"
                color="warning"
                className="ml-2"
                onClick={() => accionEditInformation(item)}
              >
                Editar
              </CButton>
              <CButton
                size="sm"
                color="danger"
                className="ml-2"
                onClick={() => accionDeleteInformation(item)}
              >
                Eliminar
              </CButton>
            </td>
          ),
        }}
      />
    </div>
  );
};
