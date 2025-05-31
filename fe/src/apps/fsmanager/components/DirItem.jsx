import React, { useState } from 'react'
import Folder from './Folder'
import File from './File'
import { FaDownload, FaEllipsisVertical, FaFileZipper } from 'react-icons/fa6'
import { useFsContext } from '../../../state/FsContext'
import { BiLock } from "react-icons/bi";
import { useStateContext } from "../../../state/StateContext";

const DirItem = ({ item }) => {
    const { key, getFs } = useFsContext();
    const { forbidroute } = useStateContext();
    const type = item.includes(".") ? "file" : "folder";
    const extension = item.slice(item.lastIndexOf(".") + 1) || "";
    const name = item;
    const detailedType =
      type == "file" ? extension.toUpperCase() + " file" : "Folder";
    const url = location.pathname.replace("/fsexplorer", "fs") + "/" + item;
    const psr = {
      type,
      name,
      detailedType,
      extension,
      size: 0,
      createdAt: "",
      modifiedAt: "",
      url,
    };
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [hasDd, setHasDd] = useState(false);


    const dropDownContent = (
      <div
        className=" p-1 small themebg rounded inner"
        onClick={() => {
          setHasDd(false);
        }}
        style={{
          position: "relative",
        }}
      >
        {type == "file" ? (
          <div
            className="p-1 rounded active"
            title="Download File"
            style={{ cursor: "pointer" }}
            onClick={() => {
              const a = document.createElement("a");
              a.href = location.pathname + "/" + psr?.name;
              a.download = psr.name;
              a.click();
            }}
          >
            <FaDownload className="icon" /> Download File
          </div>
        ) : (
          <div
            className="p-1 rounded active"
            title="Download as compressed ZIP"
            style={{ cursor: "pointer" }}
            onClick={() => {
              const a = document.createElement("a");
              a.href = location.href.replace("/fsexplorer", "/zipper");
              a.download = psr.name;
              a.click();
            }}
          >
            <FaFileZipper className="icon" /> Download ZIP
          </div>
        )}
        {localStorage.access && (
          <div
            className="p-1 mt-1 rounded active"
            title="Download as compressed ZIP"
            style={{ cursor: "pointer" }}
            onClick={() => {
              const path = location.pathname.replace("/fsexplorer", "");
              forbidroute(url.replace('fs/',''));
              getFs(path);
            }}
          >
            <BiLock className="icon" /> Protect Route
          </div>
        )}
      </div>
    );
    
    return (name.toLowerCase().includes(key.toLowerCase())||key.toLowerCase().includes(name.toLowerCase()) ?
            <div className='fs-5 my-1 d-flex active p-2'>{type == 'folder' ? <Folder data={psr} /> : <File data={psr} />}
            <div className="ms-auto">
                <div>
                    <div className="pe-2" title="Download File" style={{cursor:'pointer'}} onClick={(e) => {
                        setHasDd(prev => !prev)
                        setPos({
                            x: e.clientX,
                            y:e.clientY
                        })
                }}><FaEllipsisVertical className='icon' /></div>
                </div>
                {
                    hasDd && <>
                        <div className="" onClick={(e) => { e.stopPropagation(); setHasDd(false) }} style={{
                            position:'fixed',
                            top: 0+'px',
                            bottom: 0+'px',
                            left: '0px',
                            right: '0px',
                            // background: '#0e0e030',
                            zIndex:'5'
                        }}></div>
                        <div className="themebg small rounded" style={{
                            width: '150px',
                            position: 'fixed',
                            top: pos.y+'px',
                            left: (pos.x - 150) + 'px',
                            zIndex:6
                    }}>
                        <div className="active rounded p-1">
                                {dropDownContent}
                        </div>
                    </div>
                    </>
                }
            </div>
      </div>:false
  )
}

export default DirItem