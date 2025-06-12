import React, { useEffect, useState } from "react";
import Panel from "./components/Panel";
import Controller from "./components/Controller";
import InputConext from "../../state/InputContext";
import Opened from "../../components/Opened";

const TouchPad = () => {
  return (
    <div
      className="themebg"
      style={{
        height: "100dvh",
        maxHeight: "100dvh",
        overscrollBehavior: "contain",
        overscrollBehaviorBlock: "contain",
        overscrollBehaviorInline: "contain",
        overflow: "hidden",
      }}
    >
      <InputConext>
        <Opened/>
        <Panel />
        <Controller />
      </InputConext>
    </div>
  );
};

export default TouchPad;
