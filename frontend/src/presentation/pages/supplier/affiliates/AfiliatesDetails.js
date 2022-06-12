import React, { useState, useEffect } from "react";
import { CCard, CCardBody } from "@coreui/react";
import { withRouter } from "react-router-dom";
import { getUserApi } from "src/domain/services";
import { Error, Loading, Avatar } from "src/presentation/components";
import { useErrorHandler } from "src/presentation/hooks";

const AfiliatesDetails = ({ match }) => {
  const { params } = match;

  const [state, setState] = useState({
    user: {},
    error: "",
    loading: true,
    reload: false,
  });

  const reload = () =>
    setState((old) => ({
      user: {},
      error: "",
      reload: !old.reload,
      loading: !old.loading,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Afiliado Perfil";
    getUser(params.id);
    // eslint-disable-next-line
  }, [params.id, state.reload]);

  const getUser = async (id) => {
    setState((old) => ({ ...old, loading: true }));
    try {
      const response = await getUserApi(id);
      setState((old) => ({
        ...old,
        user: response.found,
        loading: false,
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
            <CCard>
              <CCardBody>
                <div className="row product-page-main">
                  <div className="col-xl-4 col-md-4 d-flex justify-content-center">
                    <Avatar
                      className="img-fluid top-radius-blog"
                      size="max-big"
                      name={state.user.nombres}
                    />
                  </div>
                  <div className="col-xl-8 col-md-8 mt-3">
                    <div className="product-page-details">
                      <h4 className="font-weight-bold">{state.user.nombres}</h4>
                      <div className="d-flex">
                        <span>
                          {state.user.facultad.nombreFacultad} -{" "}
                          {state.user.facultad.localidad.extension}
                        </span>
                      </div>
                    </div>
                    <hr />
                    <div>
                      <table>
                        <tbody>
                          <tr>
                            <td className="font-weight-bold pr-3">Cédula:</td>
                            <td>{state.user.cedula}</td>
                          </tr>
                          <tr>
                            <td className="font-weight-bold">
                              Correo Institucional:
                            </td>
                            <td className="in-stock">{state.user.email}</td>
                          </tr>
                          <tr>
                            <td className="font-weight-bold">
                              Correo Personal:
                            </td>
                            <td className="in-stock">
                              {state.user.emailPersonal}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-weight-bold">Teléfono:</td>
                            <td className="in-stock">{state.user.telefono}</td>
                          </tr>
                          <tr>
                            <td className="font-weight-bold">Celular:</td>
                            <td className="in-stock">{state.user.celular}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <hr />
                  </div>
                </div>
              </CCardBody>
            </CCard>
          )}
        </>
      )}
    </div>
  );
};

export default withRouter(AfiliatesDetails);
