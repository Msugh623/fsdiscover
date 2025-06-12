import React from 'react'
import { useState } from 'react';
import { useInputContext } from '../../../state/InputContext';
import {  FaRegKeyboard } from 'react-icons/fa'
import { useEffect } from 'react';

const KeyboardFocusable = ({hasDivider}) => {
    const [panelClassName, setPanelClassName] = useState("d-none");
    const [href, setHref] = useState(location.href);
    const [hasPannel, setHasPannel] = useState(undefined);
    const { toggleKeyboard, handleKeydown, handleKeyUp } = useInputContext();
  
    useEffect(() => {
      location.href !== href && setHref(location.href);
    }, [location.href == href]);
  
    useEffect(() => {
      if (!hasPannel) {
        if (hasPannel == undefined) {
          return;
        }
        toggleKeyboard(false);
        setPanelClassName("slideOut");
        setTimeout(() => {
          setPanelClassName("d-none");
        }, 500);
      } else {
        setPanelClassName("d-block");
        toggleKeyboard(true)
      }
    }, [hasPannel]);
  
    return (
      <>
        <div className="menu-panel">
          <div className="mx-auto col-12 col-sm-10 col-md-8 col-xl-9">
            <div
              className={`inner ani  rounded shadow-lg p-3 text-light bg-dark text-left slideUp ${panelClassName}`}
              style={{
                // zIndex: ,
                bottom: "10px",
                position: "relative",
              }}
            >
              <div
                className="row text-light ani"
                style={{
                  minHeight: "400px !important",
                  height: "20vh",
                  maxHeight: "800vh",
                }}
              >
                <h4 className="text-light mt-0 mb-0">Remote Keyboard</h4>
                <small>This feature is not fully implemented Yet</small>
                <div className="px-2">
                  <input
                    type="text"
                    onKeyDown={handleKeydown}
                    onKeyUp={handleKeyUp}
                    key={[panelClassName]}
                    className="form-control bg-dark border rounded text-light"
                    value={"Write Here (Writeup will not display here)"}
                    autoFocus
                    id="keystroke"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="start"
          title="Sprintet Menu"
          className={`app my-auto p-2 py-1 btn fs-5 ${hasPannel && "active"}`}
          onClick={() => setHasPannel((prev) => !prev)}
        >
          <FaRegKeyboard
            className="text-light"
            style={{
              fontSize: "35px",
            }}
          />
        </div>
        {hasDivider !== false && (
          <div
            className="divider my-auto mx-2"
            style={{ width: "1px", background: "#efefef60", height: "80%" }}
          ></div>
        )}
      </>
    );
  };

export default KeyboardFocusable