import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CTabContent,
  CTabPane,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import * as moment from "moment";
import { getUserApi, getAllsFacultyApi } from "src/domain/services";
import { Error, Loading } from "src/presentation/components";
import { useErrorHandler } from "src/presentation/hooks";
import { EditUserForm, EditPassForm, EditRoleForm } from "./components";

const UserDetails = ({ match }) => {
  const { params } = match;

  const [active, setActive] = useState(0);
  const [state, setState] = useState({
    user: {},
    endSesion: [],
    faculty: [],
    error: "",
    loading: true,
    reload: false,
    loadingFaculty: true,
  });

  const reload = () =>
    setState((old) => ({
      user: {},
      endSesion: [],
      faculty: [],
      error: "",
      reload: !old.reload,
      loading: !old.loading,
      loadingFaculty: !old.loadingFaculty,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Usuario";
    getUser(params.id);
    getAllsFaculty();
    // eslint-disable-next-line
  }, [params.id, state.reload]);

  const getUser = async (id) => {
    setState((old) => ({ ...old, loading: true }));
    try {
      const response = await getUserApi(id);
      setState((old) => ({
        ...old,
        user: response.found,
        endSesion: response.ultimo,
        loading: false,
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
          {state.loadingFaculty || state.loading ? (
            <Loading />
          ) : (
            <>
              <div className="d-flex">
                <div className="d-flex flex-grow-1 align-items-center">
                  <label>Fecha Afiliado: </label>
                  {state.user.fechaAfiliado === null ? (
                    <p>
                      <CBadge color="danger"> No cuenta con una fecha</CBadge>
                    </p>
                  ) : (
                    <p>
                      <CBadge color="primary">
                        {moment(state.user.fechaAfiliado).format("llll")}
                      </CBadge>
                    </p>
                  )}
                </div>
                <div className="d-flex flex-grow-1 align-items-center">
                  <label>Fecha Desafiliado: </label>
                  {state.user.fechaDesafiliado === null ? (
                    <p>
                      <CBadge color="danger"> No cuenta con una fecha</CBadge>
                    </p>
                  ) : (
                    <p>
                      <CBadge color="primary">
                        {moment(state.user.fechaDesafiliado).format("llll")}
                      </CBadge>
                    </p>
                  )}
                </div>
              </div>
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
                          {active === 0 && " Datos personales"}
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink>
                          <CIcon name="cil-contact" />
                          {active === 1 && " Roles"}
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink>
                          <CIcon name="cil-lock-locked" />
                          {active === 2 && " Cambiar contraseña"}
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                    <CTabContent>
                      <CTabPane>
                        <EditUserForm
                          user={state.user}
                          faculty={state.faculty}
                        />
                      </CTabPane>
                      <CTabPane>
                        <EditRoleForm user={state.user} reload={reload} />
                      </CTabPane>
                      <CTabPane>
                        <EditPassForm user={state.user} />
                      </CTabPane>
                    </CTabContent>
                  </CTabs>
                </CCardBody>
              </CCard>
            </>
          )}
        </>
      )}
    </div>
  );
};
export default withRouter(UserDetails);
