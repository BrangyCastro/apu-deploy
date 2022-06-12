import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardTitle,
  CRow,
  CCol,
  CTabContent,
  CTabPane,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
} from "@coreui/react";
import * as moment from "moment";
import CIcon from "@coreui/icons-react";
import useAuth from "../../hooks/useAuth";
import { getUserApi, getAllsFacultyApi } from "../../../domain/services";
import { Avatar, Error, Loading } from "../../components";
import { useErrorHandler } from "../../hooks";
import { EditUserForm, EditPassForm } from "./components";

const Profile = () => {
  const user = useAuth();
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
    document.title = "APU | Perfil";
    getUser(user.user.id);
    getAllsFaculty();
    // eslint-disable-next-line
  }, [user.user.id, state.reload]);

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
              <CCard>
                <CCardBody>
                  <CRow>
                    <CCol
                      xs={2}
                      md={1}
                      className="d-none d-sm-inline mr-md-5 mr-xl-3"
                    >
                      <Avatar size="big big-xs" name={user.user.nombres} />
                    </CCol>
                    <CCol xs={10}>
                      <CCardTitle>{state.user.nombres}</CCardTitle>
                      <span className="text-muted">
                        Última ingreso{" "}
                        {moment(state.endSesion[1]?.fecha).format("LLLL")}{" "}
                      </span>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
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
                          <CIcon name="cil-lock-locked" />
                          {active === 1 && " Cambiar contraseña"}
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

export default Profile;
