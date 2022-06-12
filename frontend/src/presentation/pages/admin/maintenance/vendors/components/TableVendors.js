import React from "react";
import { Link } from "react-router-dom";
import { deleteVendorsApi } from "src/domain/services";
import { DeleteTableAlert, Loading } from "src/presentation/components";
import { CDataTable, CBadge, CButton } from "@coreui/react";

export const TableVendors = ({ data, reload }) => {
  const { vendors, loadingVendors } = data;

  const accionDeleteVendors = async (data) => {
    await DeleteTableAlert(
      "Se ha eliminado correctamente",
      () => deleteVendorsApi(data.id, "INACTIVE"),
      () => reload()
    );
  };

  const fields = [
    {
      key: "status",
      label: "Estado",
      _style: { width: "10%" },
      filter: false,
    },
    {
      key: "nombre",
      label: "Nombres",
    },
    {
      key: "razonSocial",
      label: "Propietario",
    },
    {
      key: "accion",
      label: "Acción",
      filter: false,
      _style: { width: "18%" },
    },
  ];

  return (
    <div className="p-3">
      {loadingVendors ? (
        <Loading />
      ) : (
        <CDataTable
          items={vendors}
          fields={fields}
          size="sm"
          columnFilter
          tableFilter={{
            label: "Buscar: ",
            placeholder: "Nombres",
          }}
          itemsPerPageSelect={{ label: "Elementos por página: " }}
          itemsPerPage={10}
          pagination
          scopedSlots={{
            status: (item) => (
              <td>
                {item.publico ? (
                  <CBadge color="primary">PUBLICO</CBadge>
                ) : (
                  <CBadge color="danger">PRIVADO</CBadge>
                )}
              </td>
            ),
            accion: (item) => (
              <td>
                <Link to={`/mantenimiento/proveedores/${item.id}`}>
                  <CButton size="sm" color="warning">
                    Editar
                  </CButton>
                </Link>
                <CButton
                  size="sm"
                  color="danger"
                  className="ml-2"
                  onClick={() => accionDeleteVendors(item)}
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
