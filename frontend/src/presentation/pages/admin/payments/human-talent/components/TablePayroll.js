import React from "react";
import { CDataTable, CButton } from "@coreui/react";
import { Link } from "react-router-dom";

export const TablePayroll = ({ data }) => {
  const fields = [
    {
      key: "concepto",
      label: "Concepto",
    },
    {
      key: "producto",
      label: "Producto",
    },
    {
      key: "cuota",
      label: "Cuota",
    },
    {
      key: "valorCuota",
      label: "V. Cuota",
    },
    {
      key: "accion",
      label: "Acción",
      filter: false,
      _style: { width: "10%" },
    },
  ];

  return (
    <div>
      <CDataTable
        items={data}
        fields={fields}
        size="sm"
        pagination
        scopedSlots={{
          concepto: (item) => (
            <td>{item.apuExtension ? item.apuExtension : item.proveedor}</td>
          ),
          cuota: (item) => (
            <td>
              {item.totalMeses}/{item.cuotaMeses}
            </td>
          ),
          accion: (item) => (
            <td>
              <Link to={`/pagos/nomina/${item.venta_id}`}>
                <CButton size="sm" color="info" variant="ghost">
                  Ver mas
                </CButton>
              </Link>
            </td>
          ),
        }}
      />
    </div>
  );
};
