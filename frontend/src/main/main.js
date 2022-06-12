import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Routing } from "./router/Routing";
import { AuthContext } from "../presentation/hooks";
import { isUserLogedApi } from "../domain/services";
import "../presentation/assets/scss/style.scss";
import "react-toastify/dist/ReactToastify.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-datepicker/dist/react-datepicker.css";
import "sweetalert2/src/sweetalert2.scss";
import "cropperjs/dist/cropper.css";
import "moment/locale/es";
import es from "date-fns/locale/es";
import { registerLocale } from "react-datepicker";

export const Main = () => {
  const [user, setUser] = useState(null);

  const [refreshCheckLogin, setRefreshCheckLogin] = useState(false);
  const [loadUser, setLoadUser] = useState(false);

  useEffect(() => {
    setUser(isUserLogedApi());
    setRefreshCheckLogin(false);
    setLoadUser(true);
  }, [refreshCheckLogin]);

  if (!loadUser) return null;

  registerLocale("es", es);

  return (
    <AuthContext.Provider value={{ user }}>
      <Routing setRefreshCheckLogin={setRefreshCheckLogin} user={user} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />
    </AuthContext.Provider>
  );
};
