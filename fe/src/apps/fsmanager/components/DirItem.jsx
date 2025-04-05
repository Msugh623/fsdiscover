import React from 'react'
import Folder from './Folder'
import File from './File'
import { FaDownload } from 'react-icons/fa6'

const DirItem = ({ item }) => {
    const type = item.includes('.') ? 'file' : 'folder'
    const extension=item.slice(item.lastIndexOf('.')+1)||''
    const name = item
    const detailedType = type == 'file' ? extension.toUpperCase() + ' file' : 'Folder'
    const url=location.pathname.replace('/fsexplorer','fs') + '/' + item
    const psr = {
        type,
        name,
        detailedType,
        extension,
        size: 0,
        createdAt: '',
        modifiedAt: '',
        url
    }
  return (
      <div className='fs-5 my-1 d-flex active p-2'>{type == 'folder' ? <Folder data={psr} /> : <File data={psr} />}
          <div className="ms-auto">
              {type == 'file' ? <div className="pe-2" style={{cursor:'pointer'}} onClick={() => {
                  const a = document.createElement('a')
                  a.href = psr.url
                  a.download = psr.name
                  a.click()
             }}><FaDownload className='icon'/></div>:''}
          </div>
      </div>
  )
}

export default DirItem