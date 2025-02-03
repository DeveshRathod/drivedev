import React from "react";
import { SyncLoader } from "react-spinners";
const Loader = () => {
  return (
    <div>
      <SyncLoader color="#2563eb" margin={10} size={30} speedMultiplier={0.5} />
    </div>
  );
};

export default Loader;
