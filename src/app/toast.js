import { toast } from "react-toastify";

// function to display the toast in our project
const toastDisplay = function (data, type) {
  if (typeof data === "object") {
    data = JSON.stringify(data);
  }
  if (type === "success") {
    toast.success(data, {
      position: "bottom-left",
      autoClose: 10000,
      className: "rounded-lg text-dark font-weight-bold",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  if (type === "error") {
    toast.error(data, {
      position: "bottom-left",
      autoClose: 10000,
      className: "rounded-lg text-dark font-weight-bold",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }
  if (type === "info") {
    toast.info(data, {
      position: "bottom-left",
      autoClose: 5000,
      className: "rounded-lg text-dark font-weight-bold",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }
  if (type === "warn") {
    toast.warn(data, {
      position: "bottom-left",
      autoClose: 5000,
      className: "rounded-lg text-dark font-weight-bold",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }
};

export default toastDisplay;
