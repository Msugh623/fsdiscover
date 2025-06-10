import React, { useEffect, useState } from 'react'
import Delay from './Delay'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import PlaceHolder from './PlaceHolder'
import { FaSpinner } from "react-icons/fa";

const Loader = ({ animate }) => {
    const [rm, setRm] = useState(Boolean(animate))

    useEffect(() => {
        setTimeout(() => setRm(true), 800)
    }, [])

    return (
      <div
        className="w-100"
        style={{
          position: "fixed",
          top: "45vh",
        }}
      >
        <div className="d-flex">
          <div className="mx-auto">
            <h1 className="">
              <div className="p-3"></div>
              {animate && (
                <Delay delay={300}>
                  <FaSpinner className="spinner icon mt-5 text-light" />
                </Delay>
              )}
              {!rm && (
                <Delay delay={!animate ? 50 : 0}>
                  <div className="img">
                    <div
                      className="fixed-top d-flex w-100"
                      style={{
                        height: "90%",
                      }}
                    >
                      <div
                        className="m-auto"
                        style={{
                          maxWidth: "70vw",
                          width: "150px",
                        }}
                      >
                        <LazyLoadImage
                          effect="opacity"
                          placeholder={<PlaceHolder />}
                          src="/sprintetS.png"
                          className="m-auto slideUp rounded img-fluid"
                          alt="bg"
                        />
                      </div>
                    </div>
                  </div>
                </Delay>
              )}
            </h1>
          </div>
        </div>
      </div>
    );
}

export default Loader