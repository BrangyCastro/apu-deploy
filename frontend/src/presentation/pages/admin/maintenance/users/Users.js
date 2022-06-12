import React, { useEffect, useState } from "react";
import {
  CWidgetIcon,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CTabContent,
  CTabPane,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  getUserTotalApi,
  getAllsUserApi,
  getAllsFacultyApi,
} from "src/domain/services";
import { useErrorHandler } from "src/presentation/hooks";
import { Error } from "src/presentation/components";
import {
  TableAffiliates,
  TableNoAffiliates,
  TableProveedor,
  NewUserForm,
  ReportByUser,
} from "./components";

const Users = () => {
  const [active, setActive] = useState(0);
  const [state, setState] = useState({
    afiliados: 0,
    proveedores: 0,
    todos: 0,
    perPage: 10,
    totalRows: 1,
    status: "ACTIVE",
    user: [],
    userActive: [],
    faculty: [],
    error: "",
    reload: false,
    loadingTotal: false,
    loadingUser: true,
    loadingFaculty: false,
    loadingActiveUser: false,
  });

  const reload = () =>
    setState((old) => ({
      afiliados: 0,
      proveedores: 0,
      todos: 0,
      perPage: 10,
      totalRows: 1,
      status: "ACTIVE",
      userActive: [],
      user: [],
      faculty: [],
      error: "",
      reload: !old.reload,
      loadingTotal: true,
      loadingUser: true,
      loadingFaculty: !old.loadingFaculty,
      loadingActiveUser: !old.loadingActiveUser,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Usuarios";
    getUserTotal();

    // eslint-disable-next-line
  }, [state.reload]);

  useEffect(() => {
    if (active === 0) {
      getAllsUser("ACTIVE");
      return;
    }
    if (active === 1) {
      getAllsUser("INACTIVE");
      return;
    }
    if (active === 2) {
      getAllsUser("PROVE");
      return;
    }
    if (active === 3) {
      getAllsUser(null);
      return;
    }
    if (active === 4) {
      getAllsFaculty();
      return;
    }
    if (active === 5) {
      getAllsActiveUser();
      return;
    }
    // eslint-disable-next-line
  }, [active, state.reload]);

  const getUserTotal = async () => {
    setState((old) => ({ ...old, loadingTotal: true }));
    try {
      const response = await getUserTotalApi();
      setState((old) => ({
        ...old,
        afiliados: response.afiliados,
        proveedores: response.proveedores,
        todos: response.todos,
        loadingTotal: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const getAllsUser = async (status) => {
    setState((old) => ({ ...old, loadingUser: true }));
    try {
      const response = await getAllsUserApi(status);
      setState((old) => ({
        ...old,
        user: response,
        loadingUser: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const getAllsActiveUser = async () => {
    setState((old) => ({ ...old, loadingActiveUser: true }));
    try {
      const response = await getAllsUserApi("ACTIVE");
      setState((old) => ({
        ...old,
        userActive: response,
        loadingActiveUser: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

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

  return (
    <div>
      {state.error ? (
        <Error error={state.error} reload={reload} />
      ) : (
        <>
          <CRow>
            <CCol sm="6" md="4" lg="3">
              <CWidgetIcon
                header={state.afiliados.toString()}
                text="Afiliados"
                color="gradient-success"
              >
                <CIcon name="cil-user" />
              </CWidgetIcon>
            </CCol>
            <CCol sm="6" md="4" lg="3">
              <CWidgetIcon
                header={state.proveedores.toString()}
                text="Proveedores"
                color="gradient-info"
              >
                <CIcon name="cil-building" />
              </CWidgetIcon>
            </CCol>
            <CCol sm="6" md="4" lg="3">
              <CWidgetIcon
                header={state.todos.toString()}
                text="Todos"
                color="gradient-danger"
              >
                <CIcon name="cil-people" />
              </CWidgetIcon>
            </CCol>
          </CRow>
          <CCard>
            <CCardBody>
              <CTabs
                activeTab={active}
                onActiveTabChange={(idx) => setActive(idx)}
              >
                <CNav variant="tabs">
                  <CNavItem>
                    <CNavLink>
                      <CIcon name="cil-user" />
                      {active === 0 && " Afiliados"}
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      <CIcon name="cil-user-unfollow" />
                      {active === 1 && " No Afiliados"}
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      <CIcon name="cil-building" />
                      {active === 2 && " Proveedores"}
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      <CIcon name="cil-people" />
                      {active === 3 && " Todos"}
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      <CIcon name="cil-plus" /> Nuevo afiliado
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      <CIcon name="cil-description" /> Reportes
                    </CNavLink>
                  </CNavItem>
                </CNav>
                <CTabContent>
                  <CTabPane>
                    <TableAffiliates data={state} reload={reload} />
                  </CTabPane>
                  <CTabPane>
                    <TableNoAffiliates data={state} reload={reload} />
                  </CTabPane>
                  <CTabPane>
                    <TableProveedor data={state} reload={reload} />
                  </CTabPane>
                  <CTabPane>
                    <TableAffiliates data={state} reload={reload} />
                  </CTabPane>
                  <CTabPane>
                    <NewUserForm
                      reload={reload}
                      faculty={state.faculty}
                      loadingFaculty={state.loadingFaculty}
                    />
                  </CTabPane>
                  <CTabPane>
                    <ReportByUser
                      data={state.userActive}
                      loadingActiveUser={state.loadingActiveUser}
                    />
                  </CTabPane>
                </CTabContent>
              </CTabs>
            </CCardBody>
          </CCard>
        </>
      )}
    </div>
  );
};

export default Users;
