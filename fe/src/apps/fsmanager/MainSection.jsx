import React from 'react'
import { useFsContext } from '../../state/FsContext'
import DirItem from './components/DirItem'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import { useEffect } from 'react'
import { FaSpinner, FaTimes } from 'react-icons/fa'
import { useStateContext } from '../../state/StateContext'
import { useLocation } from 'react-router-dom'

const MainSection = () => {
  const { isFetching, locChildren, isHidden, setIsHidden ,err,key,setKey,modal,setModal,title} = useFsContext()
  const { hostname } = useStateContext()
  const location=useLocation()
    
  useEffect(() => {
    // console.log(locChildren)
    window.innerWidth < 768 ? setIsHidden(true) : setIsHidden(false)
    document.title = '' + hostname + ' - File System: ' + (location.pathname.replace('/fsexplorer', '') || '/')
    key&&setKey('')
  },[window.innerWidth, location.pathname])  

  return (
    <div
      style={{
        minWidth: "300px",
      }}
    >
      <div className="d-flex w-100">
        {isHidden ? false : <Sidebar />}
        <div
          className="w-100 bg-dark"
          style={{
            minWidth: window.innerWidth < 500 && !isHidden ? "100vw" : "",
          }}
        >
          <Header />
          <div className="p-2 px-4 pb-0">
            {location.pathname.replace("/fsexplorer", "") ? "Home > " : ""}
            {location.pathname
              .replace("/fsexplorer", "")
              .replaceAll("%20", " ")
              .slice(1)
              .replaceAll("/", " > ") || "Home"}
          </div>
          <div
            className="p-4 pt-3 w-100"
            style={{
              maxWidth: "100%",
            }}
          >
            {isFetching && !locChildren.length ? (
              <div
                className="fs-4 text-center"
                style={{
                  position: "fixed",
                  bottom: "10px",
                  right: "10px",
                }}
              >
                <FaSpinner className="spinner" />
              </div>
            ) : (
              ""
            )}
            {!isFetching && !locChildren.length ? (
              <div
                className="fs-4 text-center mt-5"
                dangerouslySetInnerHTML={{
                  __html: err || "Empty Directory",
                }}
                style={{}}
              >
              </div>
            ) : (
              ""
            )}
            {locChildren.map((item, i) => (
              <DirItem key={"" + item + i} item={item} />
            ))}
            <div className="my-3"></div>
            {locChildren.length ? <>{locChildren.length} Items</> : ""}
          </div>
        </div>
      </div>

      {modal && (
        <>
          <div
            className="d-flex"
            style={{
              position: "fixed",
              top: 0 + "px",
              bottom: 0 + "px",
              left: "0px",
              right: "0px",
              background: "#0e0e030",
              zIndex: "10",
            }}
          >
            <div className="m-auto p-1 active">
              <div className="d-flex fw-bold">
                {title}
                <div
                  className="ms-auto rounded themebg fs-5"
                  onClick={() => setModal("")}
                >
                  <FaTimes className="icon" />
                </div>
              </div>
              <div className="themebg round">{modal}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MainSection