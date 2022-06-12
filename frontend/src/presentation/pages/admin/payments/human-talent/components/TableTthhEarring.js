import React from "react";
import {
  CDataTable,
  CBadge,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import * as moment from "moment";
import { downloadCsv, downloadEcxel } from "src/domain/utils/download";

export const TableTthhEarring = ({ data, mes }) => {
  const exportExcel = () => {
    downloadEcxel(data, `APU_${moment(mes).format("MMMM_YYYY")}`);
  };

  const exportCsv = () => {
    downloadCsv(data, `APU_${moment(mes).format("MMMM_YYYY")}`);
  };

  const fields = [
    {
      key: "status",
      label: "",
      filter: false,
    },
    {
      key: "cedula",
      label: "Cédula",
      filter: false,
    },
    {
      key: "nombres",
      label: "Nombres",
    },
    {
      key: "aporte",
      label: "Aporte",
    },
    {
      key: "totalProveedor",
      label: "Proveedor",
    },
    {
      key: "total",
      label: "Total APU",
    },
  ];

  return (
    <div className="p-3">
      <div className="d-flex flex-row-reverse">
        <CDropdown>
          <CDropdownToggle color="light" size="sm">
            <CIcon name="cil-settings" /> Exportar
          </CDropdownToggle>
          <CDropdownMenu size="sm">
            <CDropdownItem onClick={exportExcel}>Todos Excel</CDropdownItem>
            <CDropdownItem onClick={exportCsv}>Todos Csv</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </div>
      <CDataTable
        items={data}
        fields={fields}
        size="sm"
        tableFilter={{
          label: "Buscar: ",
          placeholder: "Nombres o cédula...",
        }}
        itemsPerPageSelect={{ label: "Elementos por página: " }}
        itemsPerPage={10}
        pagination
        scopedSlots={{
          status: (item) => (
            <td style={{ verticalAlign: "middle" }}>
              {item.status === "ACTIVE" && (
                <div className="status-success"></div>
              )}
              {item.status === "INACTIVE" && (
                <div className="status-danger"></div>
              )}
            </td>
          ),
          tthhPago_status: (item) => (
            <td style={{ verticalAlign: "middle", textAlign: "center" }}>
              {item.tthhPago_status === "PUBLICO" && (
                <CBadge color="primary">{item.tthhPago_status}</CBadge>
              )}
              {item.tthhPago_status === "PRIVADO" && (
                <CBadge color="danger">{item.tthhPago_status}</CBadge>
              )}
            </td>
          ),
          tthhPago_email: (item) => (
            <td style={{ verticalAlign: "middle", textAlign: "center" }}>
              {item.tthhPago_email === 0 && <CBadge color="danger">No</CBadge>}
              {item.tthhPago_email === 1 && <CBadge color="primary">Si</CBadge>}
            </td>
          ),
          tthhPago_total: (item) => (
            <td style={{ textAlign: "right" }}>{item.tthhPago_total}</td>
          ),
          diferencia: (item) => (
            <td style={{ textAlign: "right" }}>
              {(item.total - item.tthhPago_total).toFixed("2")}
            </td>
          ),
          total: (item) => <td style={{ textAlign: "right" }}>{item.total}</td>,
        }}
      />
    </div>
  );
};
