import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useErrorHandler } from "src/presentation/hooks";

export const DeleteArchivedTableAlert = (
  messageSuccess,
  messageArchived,
  actionDelete,
  actionArchived,
  refresh
) => {
  const handleError = useErrorHandler((error) => {
    toast.error(error.message);
  });

  Swal.fire({
    title: "¡Advertencia!",
    html: `¡Puedes finalizar la promoción!`,
    icon: "warning",
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonColor: "#d33",
    denyButtonColor: "#3085d6",
    cancelButtonColor: "#8799a6",
    confirmButtonText: "Eliminar",
    denyButtonText: `Finalizar`,
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await actionDelete();
        refresh();
        toast.success(messageSuccess);
      } catch (error) {
        handleError(error);
      }
    } else if (result.isDenied) {
      try {
        await actionArchived();
        refresh();
        toast.success(messageArchived);
      } catch (error) {
        handleError(error);
      }
    }
  });
};
