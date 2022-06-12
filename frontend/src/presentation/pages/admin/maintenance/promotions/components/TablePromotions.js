import React from "react";
import { CDataTable, CBadge, CButton } from "@coreui/react";
import { Link } from "react-router-dom";
import * as moment from "moment";
import { DeleteArchivedTableAlert, Loading } from "src/presentation/components";
import { deletePromotionsApi } from "src/domain/services";

export const TablePromotions = ({ data, reload }) => {
  const { promotions, loading } = data;

  const accionDeletePromotions = async (data) => {
    await DeleteArchivedTableAlert(
      "Promoción eliminada",
      "Promoción archivada",
      () => deletePromotionsApi(data.id, true),
      () => deletePromotionsApi(data.id, false),
      () => reload()
    );
  };

  const fields = [
    {
      key: "status",
      label: "Estado",
      filter: false,
    },
    {
      key: "titulo",
      label: "Titulo",
    },
    {
      key: "proveedor",
      label: "Proveedor",
      filter: false,
    },
    {
      key: "createdAt",
      label: "Fecha publicación",
    },
    {
      key: "accion",
      label: "Acción",
      filter: false,
      _style: { width: "16%" },
    },
  ];

  return (
    <div className="p-3">
      {loading ? (
        <Loading />
      ) : (
        <CDataTable
          items={promotions}
          fields={fields}
          size="sm"
          tableFilter={{
            label: "Buscar: ",
            placeholder: "Titulo...",
          }}
          itemsPerPageSelect={{ label: "Elementos por página: " }}
          itemsPerPage={10}
          pagination
          scopedSlots={{
            status: (item) => (
              <td>
                {item.status === "PUBLICO" && (
                  <CBadge color="primary">{item.status}</CBadge>
                )}
                {item.status === "PENDIENTE" && (
                  <CBadge color="warning">{item.status}</CBadge>
                )}
                {item.status === "ARCHIVADO" && (
                  <CBadge color="secondary">{item.status}</CBadge>
                )}
              </td>
            ),
            proveedor: (item) => <td>{item.proveedor.nombre}</td>,
            createdAt: (item) => <td>{moment(item.createdAt).format("LL")}</td>,
            accion: (item) => (
              <td>
                <Link to={`/mantenimiento/promociones/${item.id}`}>
                  <CButton size="sm" color="warning">
                    Editar
                  </CButton>
                </Link>
                <CButton
                  size="sm"
                  color="danger"
                  className="ml-2"
                  onClick={() => accionDeletePromotions(item)}
                >
                  Eliminar
                </CButton>
              </td>
            ),
          }}
        />
      )}
    </div>
  );
};
