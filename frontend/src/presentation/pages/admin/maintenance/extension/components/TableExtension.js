import { CDataTable, CBadge, CButton } from "@coreui/react";
import { Link } from "react-router-dom";
import * as moment from "moment";
import { DeleteTableAlert, Loading } from "src/presentation/components";
import { deleteExtensionApi } from "src/domain/services";

export const TableExtension = ({ data, reload }) => {
  const { extension, loading } = data;

  const accionDeleteExtension = async (data) => {
    await DeleteTableAlert(
      "Se ha eliminado correctamente",
      () => deleteExtensionApi(data.id, "INACTIVE"),
      () => reload()
    );
  };

  const fields = [
    {
      key: "nombre",
      label: "Nombre",
      filter: false,
    },
    {
      key: "descripcion",
      label: "Descripcion",
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
          items={extension}
          fields={fields}
          size="sm"
          tableFilter={{
            label: "Buscar: ",
            placeholder: "Nombre...",
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
                <Link to={`/mantenimiento/extensiones/${item.id}`}>
                  <CButton size="sm" color="warning">
                    Editar
                  </CButton>
                </Link>
                <CButton
                  size="sm"
                  color="danger"
                  className="ml-2"
                  onClick={() => accionDeleteExtension(item)}
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
