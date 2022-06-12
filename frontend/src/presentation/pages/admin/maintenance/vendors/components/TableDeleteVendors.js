import React from "react";
import { deleteVendorsApi } from "src/domain/services";
import { DeleteTableAlert, Loading } from "src/presentation/components";
import { CDataTable, CButton } from "@coreui/react";

export const TableDeleteVendors = ({ data, reload }) => {
  const { vendors, loadingVendors } = data;

  const accionDeleteVendors = async (data) => {
    await DeleteTableAlert(
      "Se ha eliminado correctamente",
      () => deleteVendorsApi(data.id, "ACTIVE"),
      () => reload(),
      "Si, activar"
    );
  };

  const fields = [
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
            accion: (item) => (
              <td>
                <CButton
                  size="sm"
                  color="primary"
                  className="ml-2"
                  onClick={() => accionDeleteVendors(item)}
                >
                  Activar
                </CButton>
              </td>
            ),
          }}
        />
      )}
    </div>
  );
};
