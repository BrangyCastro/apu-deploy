import React from "react";
import {
  CDataTable,
  CCard,
  CCardBody,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import * as moment from "moment";
import { downloadCsv, downloadEcxel } from "src/domain/utils/download";

export const TableGenerate = ({ data, mes, total }) => {
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

  const exportExcel = () => {
    downloadEcxel(data, `APU_${moment(mes).format("MMMM_YYYY")}`);
  };

  const exportCsv = () => {
    downloadCsv(data, `APU_${moment(mes).format("MMMM_YYYY")}`);
  };

  return (
    <div>
      <CCard>
        <CCardBody>
          <div className="d-flex justify-content-between">
            <div style={{ fontSize: "20px" }}>
              <strong>Total:</strong>{" "}
              <span>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(total)}
              </span>
            </div>
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
              aporte: (item) => (
                <td style={{ textAlign: "right" }}>{item.aporte}</td>
              ),
              totalProveedor: (item) => (
                <td style={{ textAlign: "right" }}>{item.totalProveedor}</td>
              ),
              total: (item) => (
                <td style={{ textAlign: "right" }}>{item.total}</td>
              ),
            }}
          />
        </CCardBody>
      </CCard>
    </div>
  );
};
