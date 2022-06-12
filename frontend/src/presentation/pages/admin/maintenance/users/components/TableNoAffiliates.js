import React from "react";
import { CDataTable, CBadge, CButton } from "@coreui/react";
import { Link } from "react-router-dom";
import { EmailSendTableAlert, Loading } from "src/presentation/components";
import { updateStatusApi, sendMailCredentialsApi } from "src/domain/services";

export const TableNoAffiliates = ({ data, reload }) => {
  const { user, loadingUser } = data;

  const accionActiveUser = async (data) => {
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
      _style: { width: "15%" },
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
            facultad: (item) => <td>{item.facultad.nombreFacultad}</td>,
            extension: (item) => <td>{item.facultad.localidad.extension}</td>,
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
                <CButton
                  size="sm"
                  color="success"
                  className="ml-2"
                  onClick={() => accionActiveUser(item)}
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
