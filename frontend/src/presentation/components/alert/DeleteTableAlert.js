import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useErrorHandler } from "src/presentation/hooks";

export const DeleteTableAlert = (
  messageSuccess,
  action,
  refresh,
  buttonText
) => {
  const handleError = useErrorHandler((error) => {
    toast.error(error.message);
  });

  Swal.fire({
    title: "¿Confirmar esta acción?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: buttonText ? buttonText : "Sí, bórralo!",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await action();
        refresh();
        toast.success(messageSuccess);
      } catch (error) {
        handleError(error);
      }
    }
  });
};
