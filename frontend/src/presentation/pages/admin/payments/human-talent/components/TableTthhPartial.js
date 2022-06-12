import React, { useState } from "react";
import {
  CDataTable,
  CButton,
  CBadge,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalHeader,
  CModalBody,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { Link } from "react-router-dom";
import * as moment from "moment";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import { useErrorHandler } from "src/presentation/hooks";
import { downloadCsv, downloadEcxel } from "src/domain/utils/download";
import {
  updateStatusTthhPagosApi,
  sendEmailReportAllsApi,
} from "src/domain/services";
import Progress from "src/presentation/assets/svg/progress-indicator-bro.svg";
import MailSend from "src/presentation/assets/svg/mail-sent-bro.svg";
import { SpinnerBouncer } from "src/presentation/components";

export const TableTthhPartial = ({ data, mes, onSubmitReload }) => {
  const [modalPublic, setModalPublic] = useState(false);
  const [modalEmail, setModalEmail] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [loading, setLoading] = useState(false);

  const exportExcel = () => {
    downloadEcxel(data, `APU_${moment(mes).format("MMMM_YYYY")}`);
  };

  const exportCsv = () => {
    downloadCsv(data, `APU_${moment(mes).format("MMMM_YYYY")}`);
  };

  const togglePublic = () => {
    setModalPublic(!modalPublic);
  };

  const toggleEmail = () => {
    setModalEmail(!modalEmail);
  };

  const handleError = useErrorHandler((error) => {
    setLoading(false);
    toast.error(error.message);
  });

  const contextActions = React.useMemo(() => {
    const handlePublic = async () => {
      setLoading(true);
      try {
        await updateStatusTthhPagosApi(selectedRows);
        setToggleCleared(!toggleCleared);
        setLoading(false);
        onSubmitReload({ mes });
      } catch (error) {
        handleError(error);
      }
    };

    return (
      <>
        <CButton
          size="sm"
          className="mr-2"
          color="primary"
          onClick={handlePublic}
        >
          <CIcon name="cil-paper-plane" /> Publicar
        </CButton>
        <CButton
          size="sm"
          color="dark"
          onClick={() => setToggleCleared(!toggleCleared)}
        >
          Cancelar
        </CButton>
      </>
    );
    // eslint-disable-next-line
  }, [toggleCleared, selectedRows]);

  const contextActionsEmail = React.useMemo(() => {
    const handleEmail = async () => {
      console.log(selectedRows);
      setLoading(true);
      try {
        await sendEmailReportAllsApi(selectedRows);
        setToggleCleared(!toggleCleared);
        setLoading(false);
        onSubmitReload({ mes });
      } catch (error) {
        handleError(error);
      }
    };

    return (
      <>
        <CButton
          size="sm"
          className="mr-2"
          color="primary"
          onClick={handleEmail}
        >
          <CIcon name="cil-envelope-letter" /> Enviar
        </CButton>
        <CButton
          size="sm"
          color="dark"
          onClick={() => setToggleCleared(!toggleCleared)}
        >
          Cancelar
        </CButton>
      </>
    );
    // eslint-disable-next-line
  }, [toggleCleared, selectedRows]);

  const handleRowSelected = React.useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

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
      key: "total",
      label: "Total APU",
    },
    {
      key: "tthhPago_total",
      label: "Total T. Humano",
    },
    {
      key: "diferencia",
      label: "Diferencia",
    },
    {
      key: "tthhPago_status",
      label: "Estado",
    },
    {
      key: "tthhPago_email",
      label: "Email",
    },
    {
      key: "accion",
      label: "Acción",
      filter: false,
      _style: { width: "10%" },
    },
  ];

  const columns = [
    {
      selector: "status",
      cell: (row) => (
        <td style={{ verticalAlign: "middle" }}>
          {row.status === "ACTIVE" && <div className="status-success"></div>}
          {row.status === "INACTIVE" && <div className="status-danger"></div>}
        </td>
      ),
      width: "10px",
      center: true,
    },
    {
      name: "Cédula",
      selector: "cedula",
      grow: 0.2,
    },
    {
      name: "Nombres",
      selector: "nombres",
    },
    {
      name: "Estado",
      cell: (row) => (
        <td>
          {row.tthhPago_status === "PUBLICO" && (
            <CBadge color="primary">{row.tthhPago_status}</CBadge>
          )}
          {row.tthhPago_status === "PRIVADO" && (
            <CBadge color="danger">{row.tthhPago_status}</CBadge>
          )}
        </td>
      ),
      width: "15px",
      center: true,
    },
    {
      name: "Total",
      selector: "tthhPago_total",
      right: true,
      grow: 0,
    },
  ];

  const columnsEmail = [
    {
      selector: "status",
      cell: (row) => (
        <td style={{ verticalAlign: "middle" }}>
          {row.status === "ACTIVE" && <div className="status-success"></div>}
          {row.status === "INACTIVE" && <div className="status-danger"></div>}
        </td>
      ),
      width: "10px",
      center: true,
    },
    {
      name: "Cédula",
      selector: "cedula",
      grow: 0.3,
    },
    {
      name: "Nombres",
      selector: "nombres",
    },
    {
      name: "Email",
      selector: "tthhPago_email",
      grow: 0,
      cell: (row) => (
        <td>
          {row.tthhPago_email ? (
            <CBadge color="primary">Si</CBadge>
          ) : (
            <CBadge color="danger">No</CBadge>
          )}
        </td>
      ),
      width: "10px",
    },
    {
      name: "Total",
      selector: "tthhPago_total",
      right: true,
      grow: 0,
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
        <CButton size="sm" className="mr-2" color="info" onClick={toggleEmail}>
          <CIcon name="cil-envelope-letter" /> Correos
        </CButton>
        <CButton
          size="sm"
          className="mr-2"
          color="primary"
          onClick={togglePublic}
        >
          <CIcon name="cil-paper-plane" /> Publicar
        </CButton>
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
          accion: (item) => (
            <td>
              <Link to={`/pagos/talento-humano/venta/${item.tthhPago_id}`}>
                <CButton size="sm" color="info" variant="ghost">
                  Ver mas
                </CButton>
              </Link>
            </td>
          ),
        }}
      />
      <CModal
        show={modalPublic}
        onClose={togglePublic}
        size="lg"
        closeOnBackdrop={false}
      >
        {loading ? (
          <>
            <img
              src={Progress}
              alt="Buscar"
              style={{
                width: "400px",
                margin: "auto",
                display: "block",
              }}
            />
            <div style={{ margin: "auto" }} className="mb-2 ">
              <SpinnerBouncer />
            </div>
          </>
        ) : (
          <>
            <CModalHeader closeButton>Publicar los reportes</CModalHeader>
            <CModalBody>
              <div className="alert alert-warning">
                <p className="h6">IMPORTANTE</p>
                <ul style={{ marginLeft: "25px" }}>
                  <li type="disc">
                    Selecciones los usuarios que desea publicar el reporte.
                  </li>
                  <li type="disc">
                    Los usuario que no este afiliados no se actualizara el
                    estado a publico.
                  </li>
                </ul>
              </div>
              <DataTable
                columns={columns}
                data={data}
                hide="sm"
                pagination
                paginationPerPage={5}
                selectableRows
                onSelectedRowsChange={handleRowSelected}
                contextActions={contextActions}
                clearSelectedRows={toggleCleared}
                contextMessage={{
                  singular: "Usuario",
                  plural: "Usuarios",
                  message: "seleccionado",
                }}
              />
            </CModalBody>
          </>
        )}
      </CModal>
      <CModal show={modalEmail} onClose={toggleEmail} size="lg">
        {loading ? (
          <>
            <img
              src={MailSend}
              alt="Buscar"
              style={{
                width: "400px",
                margin: "auto",
                display: "block",
              }}
            />
            <div style={{ margin: "auto" }} className="mb-2 ">
              <SpinnerBouncer />
            </div>
          </>
        ) : (
          <>
            <CModalHeader closeButton>Enviar correos</CModalHeader>
            <CModalBody>
              <div className="alert alert-warning">
                <p className="h6">IMPORTANTE</p>
                <ul style={{ marginLeft: "25px" }}>
                  <li type="disc">
                    Selecciones los usuarios que desea notificara por correo
                    electrónico.
                  </li>
                  <li type="disc">
                    Los usuario que no este afiliados no se le notificara por
                    correo electrónico.
                  </li>
                  <li type="disc">
                    Los correo electrónico se enviarán entre las 07H00 y 22H00.
                  </li>
                  <li type="disc">
                    Antes de enviar los correos electrónicos asegurese ubicar
                    una observación a cada usuario de esta sección.
                  </li>
                </ul>
              </div>
              <DataTable
                columns={columnsEmail}
                data={data}
                hide="sm"
                pagination
                paginationPerPage={5}
                selectableRows
                onSelectedRowsChange={handleRowSelected}
                contextActions={contextActionsEmail}
                clearSelectedRows={toggleCleared}
                contextMessage={{
                  singular: "Usuario",
                  plural: "Usuarios",
                  message: "seleccionado",
                }}
              />
            </CModalBody>
          </>
        )}
      </CModal>
    </div>
  );
};
