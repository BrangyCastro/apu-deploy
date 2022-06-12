import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CDataTable,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  getAllsFacultyApi,
  getAllsLocationApi,
  deleteLocationApi,
  deleteFacultyApi,
} from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { Error, DeleteTableAlert, Loading } from "src/presentation/components";
import {
  EditLocationForm,
  NewLocationForm,
  EditFacultyForm,
  NewFacultyForm,
} from "./components";

const Faculty = () => {
  const [activeEditLocation, setActiveEditLocation] = useState(false);
  const [activeNewLocation, setActiveNewLocation] = useState(false);
  const [editLocation, setEditLocation] = useState({});
  const [activeEditFaculty, setActiveEditFaculty] = useState(false);
  const [activeNewFaculty, setActiveNewFaculty] = useState(false);
  const [editFaculty, setEditFaculty] = useState({});
  const [state, setState] = useState({
    faculty: [],
    location: [],
    error: "",
    reload: false,
    loadingLocation: true,
    loadingFaculty: true,
  });

  const reload = () =>
    setState((old) => ({
      faculty: [],
      location: [],
      error: "",
      reload: !old.reload,
      loadingFaculty: true,
      loadingLocation: true,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Facultades";
    getAllsFaculty();
    getAllsLocalidad();
    // eslint-disable-next-line
  }, [state.reload]);

  const getAllsFaculty = async () => {
    setState((old) => ({ ...old, loadingFaculty: true }));
    try {
      const response = await getAllsFacultyApi();
      setState((old) => ({
        ...old,
        faculty: response,
        loadingFaculty: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const getAllsLocalidad = async () => {
    setState((old) => ({ ...old, loadingLocation: true }));
    try {
      const response = await getAllsLocationApi();
      setState((old) => ({
        ...old,
        location: response,
        loadingLocation: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const accionDeleteLocation = async (data) => {
    await DeleteTableAlert(
      "Se ha eliminado correctamente",
      () => deleteLocationApi(data.id),
      () => reload()
    );
  };

  const accionEditLocation = async (data) => {
    setEditLocation(data);
    setActiveEditLocation(true);
  };

  const accionDeleteFaculty = async (data) => {
    await DeleteTableAlert(
      "Se ha eliminado correctamente",
      () => deleteFacultyApi(data.id),
      () => reload()
    );
  };

  const accionEditFaculty = async (data) => {
    setEditFaculty(data);
    setActiveEditFaculty(true);
  };

  const fieldsLocation = [
    {
      key: "extension",
      label: "Extension",
      _style: { width: "45%" },
    },
    {
      key: "accion",
      label: "Acción",
    },
  ];

  const fieldsFaculty = [
    {
      key: "nombreFacultad",
      label: "Nombre",
      sorter: true,
      filter: true,
    },
    {
      key: "localidadExtension",
      label: "Extension",
    },
    {
      key: "accion",
      label: "Acción",
    },
  ];

  return (
    <div>
      {state.error ? (
        <Error error={state.error} reload={reload} />
      ) : (
        <>
          {state.loadingFaculty || state.loadingLocation ? (
            <Loading />
          ) : (
            <CRow>
              <CCol md="12" xs="12" xl="4">
                {activeEditLocation ? (
                  <EditLocationForm
                    title="Editar Extensión"
                    setActive={setActiveEditLocation}
                    active={activeEditLocation}
                    location={editLocation}
                    reload={reload}
                  />
                ) : (
                  <CCard>
                    <CCardHeader>
                      Extensiones
                      <div className="card-header-actions">
                        {!activeNewLocation && (
                          <CButton
                            size="sm"
                            color="primary"
                            onClick={() => setActiveNewLocation(true)}
                          >
                            <CIcon name="cil-plus" />
                          </CButton>
                        )}
                      </div>
                    </CCardHeader>
                    <CCardBody>
                      {activeNewLocation ? (
                        <NewLocationForm
                          reload={reload}
                          setActive={setActiveNewLocation}
                          active={activeNewLocation}
                        />
                      ) : (
                        <CDataTable
                          items={state.location}
                          fields={fieldsLocation}
                          size="sm"
                          itemsPerPage={8}
                          pagination
                          scopedSlots={{
                            localidadExtension: (item) => (
                              <td>{item.localidad.extension}</td>
                            ),
                            accion: (item) => (
                              <td>
                                <CButton
                                  size="sm"
                                  color="warning"
                                  onClick={() => accionEditLocation(item)}
                                >
                                  Editar
                                </CButton>
                                <CButton
                                  size="sm"
                                  color="danger"
                                  className="ml-2"
                                  onClick={() => accionDeleteLocation(item)}
                                >
                                  Eliminar
                                </CButton>
                              </td>
                            ),
                          }}
                        />
                      )}
                    </CCardBody>
                  </CCard>
                )}
              </CCol>
              <CCol md="12" xs="12" xl="8">
                {activeEditFaculty ? (
                  <EditFacultyForm
                    title="Editar Facultad"
                    setActive={setActiveEditFaculty}
                    active={activeEditFaculty}
                    faculty={editFaculty}
                    reload={reload}
                    locationList={state.location}
                  />
                ) : (
                  <CCard>
                    <CCardHeader>
                      Facultades
                      <div className="card-header-actions">
                        {!activeNewFaculty && (
                          <CButton
                            size="sm"
                            color="primary"
                            onClick={() => setActiveNewFaculty(true)}
                          >
                            <CIcon name="cil-plus" />
                          </CButton>
                        )}
                      </div>
                    </CCardHeader>
                    <CCardBody>
                      {activeNewFaculty ? (
                        <NewFacultyForm
                          reload={reload}
                          setActive={setActiveNewFaculty}
                          active={activeNewFaculty}
                          location={state.location}
                        />
                      ) : (
                        <CDataTable
                          items={state.faculty}
                          fields={fieldsFaculty}
                          size="sm"
                          itemsPerPage={8}
                          pagination
                          scopedSlots={{
                            localidadExtension: (item) => (
                              <td>{item.localidad.extension}</td>
                            ),
                            accion: (item) => (
                              <td>
                                <CButton
                                  size="sm"
                                  color="warning"
                                  onClick={() => accionEditFaculty(item)}
                                >
                                  Editar
                                </CButton>
                                <CButton
                                  size="sm"
                                  color="danger"
                                  className="ml-2"
                                  onClick={() => accionDeleteFaculty(item)}
                                >
                                  Eliminar
                                </CButton>
                              </td>
                            ),
                          }}
                        />
                      )}
                    </CCardBody>
                  </CCard>
                )}
              </CCol>
            </CRow>
          )}
        </>
      )}
    </div>
  );
};

export default Faculty;
