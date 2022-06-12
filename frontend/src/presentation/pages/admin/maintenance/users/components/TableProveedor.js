import React from "react";
import { CDataTable, CBadge, CButton } from "@coreui/react";
import { Link } from "react-router-dom";
import { DeleteTableAlert, Loading } from "src/presentation/components";
import { updateStatusApi } from "src/domain/services";

export const TableProveedor = ({ data, reload }) => {
  const { user, loadingUser } = data;

  const accionInactiveUser = async (data) => {
    console.log(data);
    await DeleteTableAlert(
      "Se ha desactivado correctamente",
      () => updateStatusApi(data.id, "INACTIVE"),
      () => reload()
    );
  };

  const fields = [
    {
      key: "cedula",
      label: "Cédula",
    },
    {
      key: "nombres",
      label: "Nombres",
    },
    {
      key: "proveedor",
      label: "Empresa",
      filter: false,
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
      {loadingUser ? (
        <Loading />
      ) : (
        <CDataTable
          items={user}
          fields={fields}
          size="sm"
          columnFilter
          tableFilter={{
            label: "Buscar: ",
            placeholder: "Nombres o Cédula...",
          }}
          itemsPerPageSelect={{ label: "Elementos por página: " }}
          itemsPerPage={10}
          pagination
          scopedSlots={{
            proveedor: (item) => (
              <td>
                {item.proveedor.map((data, index) => (
                  <div key={index}>
                    <CBadge color="secondary">{data.nombre}</CBadge>
                  </div>
                ))}
              </td>
            ),
            accion: (item) => (
              <td>
                <Link to={`/mantenimiento/usuarios/${item.id}`}>
                  <CButton size="sm" color="warning">
                    Editar
                  </CButton>
                </Link>
                <CButton
                  size="sm"
                  color="danger"
                  className="ml-2"
                  onClick={() => accionInactiveUser(item)}
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
