import React from "react";
import { CDataTable, CBadge, CButton } from "@coreui/react";
import * as moment from "moment";
import { API_KEY } from "src/domain/utils/constant";
import { deleteBudgetApi } from "src/domain/services";
import { DeleteTableAlert } from "src/presentation/components";

export const TableBudget = ({ data, reload, setActiveEdit, setDataEdit }) => {
  const { budget } = data;

  const accionDeleteBudget = async (data) => {
    await DeleteTableAlert(
      "Presupuesto eliminado",
      () => deleteBudgetApi(data.id),
      () => reload()
    );
  };

  const accionEditBudget = (data) => {
    setActiveEdit(true);
    setDataEdit(data);
  };

  const fields = [
    {
      key: "titulo",
      label: "Titulo",
    },
    {
      key: "createdAt",
      label: "Fecha publicación",
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
        items={budget}
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
          createdAt: (item) => <td>{moment(item.createdAt).format("LL")}</td>,
          accion: (item) => (
            <td>
              {item.archivo && (
                <CButton
                  size="sm"
                  color="info"
                  href={`${API_KEY}/presupuesto/publico/${item.archivo}`}
                  target="_blank"
                >
                  Ver archivo
                </CButton>
              )}
              <CButton
                size="sm"
                color="warning"
                className="ml-2"
                onClick={() => accionEditBudget(item)}
              >
                Editar
              </CButton>
              <CButton
                size="sm"
                color="danger"
                className="ml-2"
                onClick={() => accionDeleteBudget(item)}
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
