import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useErrorHandler } from "src/presentation/hooks";

export const EmailSendTableAlert = (
  user,
  messageSuccess,
  action,
  actionEmail,
  refresh
) => {
  const handleError = useErrorHandler((error) => {
    toast.error(error.message);
  });

  if (!user.email) {
    Swal.fire({
      title: "¡Advertencia!",
      html: `El usuario <strong>${user.nombres}</strong> no cuenta con un correo electrónico para notificarle sus credenciales.<br> <strong>¿ Desea continuar ?</strong>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.value) {
        try {
          await action();
          refresh();
          toast.success(messageSuccess);
        } catch (error) {
          handleError(error);
        }
      }
    });
  } else {
    Swal.fire({
      title: "¡Advertencia!",
      html: `¿ Desea notificarle a <strong>${user.nombres}</strong> sus credenciales mediante correo electronico ?`,
      icon: "warning",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Si",
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await action();
          await actionEmail();
          refresh();
          toast.success(messageSuccess);
        } catch (error) {
          handleError(error);
        }
      } else if (result.isDenied) {
        try {
          await action();
          refresh();
          toast.success(messageSuccess);
        } catch (error) {
          handleError(error);
        }
      }
    });
  }
};
