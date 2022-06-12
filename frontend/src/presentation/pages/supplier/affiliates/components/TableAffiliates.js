import React, { useState } from "react";
import {
  CDataTable,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useErrorHandler } from "src/presentation/hooks";
import { getUserGenerateAllsApi } from "src/domain/services";
import { downloadEcxel, downloadCsv } from "src/domain/utils/download";

export const TableAffiliates = ({ data }) => {
  const { user } = data;

  const [state, setState] = useState({
    error: "",
    loading: false,
  });

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, loading: false }));
    toast.error(error.message);
  });

  const exportExcel = async () => {
    setState((old) => ({ ...old, loading: true }));
    try {
      const response = await getUserGenerateAllsApi();
      await downloadEcxel(response.data, "USUARIOS");
      setState((old) => ({
        ...old,
        loading: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const exportCsv = async () => {
    setState((old) => ({ ...old, loading: true }));
    try {
      const response = await getUserGenerateAllsApi();
      await downloadCsv(response.data, "USUARIOS");
      setState((old) => ({
        ...old,
        loading: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
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
      key: "facultad",
      label: "Facultad",
      filter: false,
    },
    {
      key: "extension",
      label: "Extensión",
      filter: false,
    },
    {
      key: "accion",
      label: "Acción",
      filter: false,
      _style: { width: "9%" },
    },
  ];

  return (
    <div>
      <div className="alert alert-primary">
        <p className="h6 m-0">
          Lista actualizada de todos los afiliados de la asosación
        </p>
      </div>
      <CDropdown className="d-flex flex-row-reverse">
        <CDropdownToggle color="primary" disabled={state.loading}>
          {state.loading ? (
            <>Descangando...</>
          ) : (
            <>
              <CIcon name="cil-settings" /> Exportar
            </>
          )}
        </CDropdownToggle>
        <CDropdownMenu>
          <CDropdownItem onClick={exportExcel}>Todos Excel</CDropdownItem>
          <CDropdownItem onClick={exportCsv}>Todos Csv</CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
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
          facultad: (item) => <td>{item.facultad.nombreFacultad}</td>,
          extension: (item) => <td>{item.facultad.localidad.extension}</td>,
          accion: (item) => (
            <td>
              <Link to={`/afiliados/${item.id}`}>
                <CButton size="sm" color="info">
                  Ver Perfil
                </CButton>
              </Link>
            </td>
          ),
        }}
      />
    </div>
  );
};
