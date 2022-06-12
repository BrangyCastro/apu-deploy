import React, { useState } from "react";
import {
  CDataTable,
  CBadge,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  DeleteTableAlert,
  EmailSendTableAlert,
} from "src/presentation/components";
import { useErrorHandler } from "src/presentation/hooks";
import {
  updateStatusApi,
  sendMailCredentialsApi,
  getUserGenerateAllsApi,
} from "src/domain/services";
import { Loading } from "src/presentation/components";
import { downloadEcxel, downloadCsv } from "src/domain/utils/download";
import { ExportByDate } from "./";

export const TableAffiliates = ({ data, reload }) => {
  const { user, loadingUser } = data;

  const [state, setState] = useState({
    error: "",
    loading: false,
    isActiveFecha: false,
  });

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, loading: false }));
    toast.error(error.message);
  });

  const accionActiveUser = async (data) => {
    const isProve = data.roles.find((item) => item.role === "PROVE");
    if (isProve) {
      await DeleteTableAlert(
        "Se ha activado correctamente",
        () => updateStatusApi(data.id, "PROVE"),
        () => reload(),
        "Si, activar"
      );
    } else {
      const dataTemp = {
        nombres: data.nombres,
        cedula: data.cedula,
        email: data.email,
      };
      await EmailSendTableAlert(
        data,
        "Se ha activado correctamente",
        () => updateStatusApi(data.id, "ACTIVE"),
        () => sendMailCredentialsApi(dataTemp),
        () => reload()
      );
    }
  };

  const accionInactiveUser = async (data) => {
    await DeleteTableAlert(
      "Se ha desactivado correctamente",
      () => updateStatusApi(data.id, "INACTIVE"),
      () => reload()
    );
  };

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
      key: "rol",
      label: "Rol",
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
        <>
          {state.isActiveFecha ? (
            <>
              <ExportByDate setStateNext={setState} />
            </>
          ) : (
            <>
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
                  <CDropdownItem onClick={exportExcel}>
                    Todos Excel
                  </CDropdownItem>
                  <CDropdownItem onClick={exportCsv}>Todos Csv</CDropdownItem>
                  <CDropdownItem
                    onClick={() =>
                      setState((old) => ({ ...old, isActiveFecha: true }))
                    }
                  >
                    Por fecha
                  </CDropdownItem>
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
                  extension: (item) => (
                    <td>{item.facultad.localidad.extension}</td>
                  ),
                  rol: (item) => (
                    <td>
                      {item.roles.length > 0 ? (
                        <div>
                          {item?.roles.map((data, index) => (
                            <div key={index}>
                              {data.role === "GENERAL" && (
                                <CBadge color="secondary">{data.role}</CBadge>
                              )}
                              {data.role === "ADMIN" && (
                                <CBadge color="primary">{data.role}</CBadge>
                              )}
                              {data.role === "PROVE" && (
                                <CBadge color="warning">{data.role}</CBadge>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <CBadge color="danger">SIN ROL</CBadge>
                      )}
                    </td>
                  ),
                  accion: (item) => (
                    <td>
                      <Link to={`/mantenimiento/usuarios/${item.id}`}>
                        <CButton size="sm" color="warning">
                          Editar
                        </CButton>
                      </Link>
                      {item.status === "INACTIVE" ? (
                        <CButton
                          size="sm"
                          color="success"
                          className="ml-2"
                          onClick={() => accionActiveUser(item)}
                        >
                          Activar
                        </CButton>
                      ) : (
                        <CButton
                          size="sm"
                          color="danger"
                          className="ml-2"
                          onClick={() => accionInactiveUser(item)}
                        >
                          Eliminar
                        </CButton>
                      )}
                    </td>
                  ),
                }}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};
