import React, { useState, useEffect } from "react";
import { CButton } from "@coreui/react";
import { withRouter } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  getVendorsIdApi,
  getConventionVendorsIdApi,
} from "src/domain/services";
import { Error, Loading, ShimmerCustom } from "src/presentation/components";
import { useErrorHandler } from "src/presentation/hooks";
import { API_KEY } from "src/domain/utils/constant";
import Img from "src/presentation/assets/img/png/No-imagen.png";

const VendorsDetails = ({ match }) => {
  const { params } = match;

  const [state, setState] = useState({
    vendors: {},
    convention: {},
    error: "",
    reload: false,
    loadingVendors: true,
    laodingConvetion: true,
  });

  const reload = () =>
    setState((old) => ({
      vendors: {},
      convention: {},
      error: "",
      reload: !old.reload,
      loadingVendors: !old.loadingVendors,
      laodingConvetion: !old.laodingConvetion,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Proveedor";
    getVendorsId(params.id);
    getConventionVendorsId(params.id);
    // eslint-disable-next-line
  }, [params.id, state.reload]);

  const getVendorsId = async (id) => {
    setState((old) => ({ ...old, loadingVendors: true }));
    try {
      const response = await getVendorsIdApi(id);
      setState((old) => ({
        ...old,
        vendors: response,
        loadingVendors: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const getConventionVendorsId = async (id) => {
    setState((old) => ({ ...old, laodingConvetion: true }));
    try {
      const response = await getConventionVendorsIdApi(id);
      setState((old) => ({
        ...old,
        convention: response,
        laodingConvetion: false,
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
          {state.loadingVendors ? (
            <Loading />
          ) : (
            <div className="card">
              <div className="row product-page-main">
                <div className="col-xl-4 col-md-4">
                  <ShimmerCustom
                    url={
                      state.vendors.url === ""
                        ? Img
                        : `${API_KEY}/proveedor/publico/${state.vendors.url}`
                    }
                    path="promo"
                    height="300px"
                    width="100%"
                  />
                </div>
                <div className="col-xl-8 col-md-8 mt-3">
                  <div className="product-page-details">
                    <h4 className="font-weight-bold">{state.vendors.nombre}</h4>
                    <div className="d-flex">
                      <span>{state.vendors.razonSocial}</span>
                    </div>
                  </div>
                  <hr />
                  <div>
                    <table>
                      <tbody>
                        <tr>
                          <td className="font-weight-bold pr-3">Teléfonos:</td>
                          <td>{state.vendors.telefono}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold">Dirección:</td>
                          <td className="in-stock">
                            {state.vendors.direccion}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <hr />
                  <ReactMarkdown
                    children={state.vendors.descripcion}
                    skipHtml={true}
                  />
                  <div className="m-t-15">
                    {state.convention.archivo && (
                      <CButton
                        size="sm"
                        color="info"
                        href={`${API_KEY}/convenio/pdf/${state.convention.archivo}`}
                        target="_blank"
                      >
                        Ver convenio
                      </CButton>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default withRouter(VendorsDetails);
