import React from "react";

export const Loader = () => {
  return (
    <>
      <div class="spinner-grow loader d-flex align-items-center justify-content-center align-content-center" role="status">
        <span className="text-white" style={{ fontSize: "14px", fontWeight: "700" }}>Loading</span>
      </div>
    </>
  );
};
