import React from "react";
import { CDataTable, CBadge, CButton } from "@coreui/react";
import { API_KEY } from "src/domain/utils/constant";
import { DeleteTableAlert } from "src/presentation/components";
import { deleteConventionApi } from "src/domain/services";

export const TableConvention = ({
  data,
  reload,
  setActiveEdit,
  setDataEdit,
}) => {
  const { convention } = data;

  const accionDeleteConvention = async (data) => {
    await DeleteTableAlert(
      "Convenio eliminado",
      () => deleteConventionApi(data.id),
      () => reload()
    );
  };

  const accionEditConvention = (data) => {
    setActiveEdit(true);
    setDataEdit(data);
  };

  const fields = [
    {
      key: "fechaInicio",
      label: "Fecha Inicio",
    },
    {
      key: "fechaFin",
      label: "Fecha Final",
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
        items={convention}
        fields={fields}
        size="sm"
        itemsPerPageSelect={{ label: "Elementos por página: " }}
        itemsPerPage={10}
        pagination
        scopedSlots={{
          status: (item) => (
            <td>
              {item.status === "ACTIVE" ? (
                <CBadge color="primary">ACTIVO</CBadge>
              ) : (
                <CBadge color="danger">FINALIZADO</CBadge>
              )}
            </td>
          ),
          accion: (item) => (
            <td>
              {item.archivo && (
                <CButton
                  size="sm"
                  color="info"
                  href={`${API_KEY}/convenio/pdf/${item.archivo}`}
                  target="_blank"
                >
                  Ver convenio
                </CButton>
              )}
              <CButton
                size="sm"
                color="warning"
                className="ml-2"
                onClick={() => accionEditConvention(item)}
              >
                Editar
              </CButton>
              <CButton
                size="sm"
                color="danger"
                className="ml-2"
                onClick={() => accionDeleteConvention(item)}
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
