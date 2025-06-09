import React from "react";
import Delay from "../../../components/Delay";
import Menu from "../../../components/Menu";

const Controller = () => {
  return (
    <div>
      <Delay delay={800}>
        <div
          id="taskBar"
          className={`fixed-bottom d-flex ${false && "d-none"}`}
        >
          <div
            className="p-3 w-100 d-flex"
            style={{
              position: "fixed",
              bottom: window.innerWidth > 700 ? "0" : "50px",
              left: "4px",
              zIndex: 10,
            }}
          >
            <Menu hasDivider={false} />
          </div>
          <div
            id="taskbarInner"
            className="custom-navmenu mx-auto text-light slideUp p-2 col-11 col-sm-10 col-md-8 col-xl-9 mb-2 bg-dark rounded d-flex text-light"
          >
            <button className="btn text-light shadow themebg ">{"< lc"}</button>
            <button className="btn text-light shadow ms-auto themebg">
              {"rc >"}
            </button>
          </div>
        </div>
      </Delay>
    </div>
  );
};

export default Controller;
