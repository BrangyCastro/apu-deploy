import React from "react";
import {
  CDataTable,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import { Link } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import * as moment from "moment";
import { downloadCsv, downloadEcxel } from "src/domain/utils/download";

export const TableApu = ({ data, mes }) => {
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
      label: "Total Proveedor",
    },
    {
      key: "total",
      label: "Total T. Humano",
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
      <div className="d-flex justify-content-between align-items-cente">
        <h2>APU</h2>
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
          placeholder: "Titulo...",
        }}
        itemsPerPageSelect={{ label: "Elementos por página: " }}
        itemsPerPage={10}
        pagination
        scopedSlots={{
          total: (item) => <td style={{ textAlign: "right" }}>{item.total}</td>,
          totalProveedor: (item) => (
            <td style={{ textAlign: "right" }}>{item.totalProveedor}</td>
          ),
          aporte: (item) => (
            <td style={{ textAlign: "right" }}>{item.aporte}</td>
          ),
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
          accion: (item) => (
            <td>
              <Link to={`/pagos/talento-humano/apu/${item.tthh_id}`}>
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
