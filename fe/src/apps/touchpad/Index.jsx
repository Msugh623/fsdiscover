import React, { useEffect, useState } from "react";
import Panel from "./components/Panel";
import Controller from "./components/Controller";
import InputConext from "../../state/InputContext";

const TouchPad = () => {
  return (
    <div
      className="themebg"
      style={{
        minHeight: "100vh",
        maxHeight: "100vh",
        overscrollBehavior: "contain",
        overscrollBehaviorBlock: "contain",
        overscrollBehaviorInline: "contain",
        overflow: "hidden",
      }}
    >
      <InputConext>
        <Panel />
        <Controller />
      </InputConext>
    </div>
  );
};

export default TouchPad;
