import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import AspectRatio from "react-aspect-ratio";
import ReactMarkdown from "react-markdown";
import * as moment from "moment";
import Countdown from "react-countdown";
import { getPromotionsApi } from "src/domain/services";
import {
  Error,
  Loading,
  SimplyCountdown,
  ShimmerCustom,
} from "src/presentation/components";
import { useErrorHandler } from "src/presentation/hooks";
import Img from "src/presentation/assets/img/png/No-imagen.png";
import { API_KEY } from "src/domain/utils/constant";

const PromotionsDeatils = ({ match }) => {
  const { params } = match;
  const [state, setState] = useState({
    promotions: {},
    error: "",
    reload: false,
    loadingPromotions: true,
  });

  const reload = () =>
    setState((old) => ({
      promotions: {},
      error: "",
      reload: !old.reload,
      loadingPromotions: !old.loadingPromotions,
    }));

  const handleErrorLoad = useErrorHandler((error) => {
    setState((old) => ({ ...old, error: error.message }));
  });

  useEffect(() => {
    document.title = "APU | Proveedor";
    getPromotionsId(params.id);
    // eslint-disable-next-line
  }, [params.id, state.reload]);

  const getPromotionsId = async (id) => {
    setState((old) => ({ ...old, loadingPromotions: true }));

    try {
      const response = await getPromotionsApi({ id });
      setState((old) => ({
        ...old,
        promotions: response,
        loadingPromotions: false,
      }));
    } catch (error) {
      handleErrorLoad(error);
    }
  };

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <h2>completado</h2>;
    } else {
      // Render a countdown
      return (
        <SimplyCountdown
          days={days}
          hours={hours}
          minutes={minutes}
          seconds={seconds}
        />
      );
    }
  };

  return (
    <div>
      {state.error ? (
        <Error error={state.error} reload={reload} />
      ) : (
        <>
          {state.loadingPromotions ? (
            <Loading />
          ) : (
            <div className="card">
              <div className="product-page-main">
                <AspectRatio ratio="16/9">
                  <ShimmerCustom
                    url={
                      state.promotions.url === ""
                        ? state.promotions.proveedor.url === ""
                          ? Img
                          : `${API_KEY}/proveedor/publico/${state.promotions.proveedor.url}`
                        : `${API_KEY}/promo/${state.promotions.url}`
                    }
                    path="promo"
                    height="500px"
                    width="100%"
                  />
                </AspectRatio>
                <div className="product-page-details  mt-3">
                  <h4 className="font-weight-bold">
                    {state.promotions.titulo}
                  </h4>
                  <div className="d-flex">
                    <span>{state.promotions.proveedor?.nombre}</span>
                  </div>
                </div>
                <hr />
                <div>
                  <table>
                    <tbody>
                      <tr>
                        {state.promotions.fechaFin ? (
                          <div className="row d-flex justify-content-center align-items-center">
                            <div className="col-xl-4">
                              <td className="font-weight-bold ">
                                <span className="h5 text-center">
                                  ¡NO TE LO PIERDAS! ESTA PROMOCIÓN EXPIRA EN
                                </span>
                              </td>
                            </div>
                            <td>
                              <label className="font-italic text-danger">
                                Valido hasta{" "}
                                {moment(state.promotions.fechaFin).format(
                                  "LLL"
                                )}
                              </label>
                              <Countdown
                                date={moment(
                                  state.promotions.fechaFin
                                ).format()}
                                renderer={renderer}
                              />
                            </td>
                          </div>
                        ) : (
                          <td className="font-weight-bold">
                            {moment(state.promotions.createdAt).fromNow()}
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <hr />
                <ReactMarkdown
                  children={state.promotions.descripcion}
                  skipHtml={true}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default withRouter(PromotionsDeatils);
