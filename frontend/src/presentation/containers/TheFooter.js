import React from "react";
import { CFooter } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import useAuth from "../hooks/useAuth";

const TheFooter = () => {
  const user = useAuth();

  return (
    <CFooter fixed={false} className="footer-home">
      <div className="container-footer-all">
        <div className="container-body">
          <div className="colum2">
            <h1>Links de interés</h1>

            <div className="row-r">
              <a
                href="https://www.uleam.edu.ec/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Página web ULEAM
              </a>
            </div>
            {user.user.status === "PROVE" ? (
              <></>
            ) : (
              <>
                <div className="row-r">
                  <a
                    href="https://apptalentohumano.uleam.edu.ec/publicas/menu/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Roles de pago
                  </a>
                </div>
                <div className="row-r">
                  <a
                    href="https://www.aputransparencia.com/recursos/pdf/MANUAL%20DE%20USUARIO%20APU.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Manual de usuario
                  </a>
                </div>
              </>
            )}
          </div>

          <div className="colum3">
            <h1>Dirección</h1>

            <div className="row2">
              <CIcon
                name="cil-location-pin"
                customClasses="c-sidebar-nav-icon"
              />
              <label>
                Av. Circunvalación - Vía a San Mateo Manta - Manabí - Ecuador
              </label>
            </div>
          </div>

          <div className="colum3">
            <h1>Contáctenos</h1>

            <div className="row2">
              <CIcon
                name="cil-envelope-closed"
                customClasses="c-sidebar-nav-icon"
              />
              <label>
                <a
                  href="mailto:info.apu@uleam.edu.ec"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  info.apu@uleam.edu.ec
                </a>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="contenedor-footer">
        <div className="footer">
          <div className="copyright">
            <span>
              APU ULEAM © Copyright {new Date().getFullYear()}, Todos los
              derechos reservados
            </span>
            <span>Manta - Manabí - Ecuador</span>
            <span>v3.1.1</span>
          </div>
        </div>
      </div>
    </CFooter>
  );
};

export default React.memo(TheFooter);
