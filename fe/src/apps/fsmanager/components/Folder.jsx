import React from 'react'
import { FaFolder } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

const Folder = ({data}) => {
  return (
    <Link to={location.pathname+'/'+data?.name} className='text-light' >
      <FaFolder className='icon' /> <span className="text-truncate">{data?.name}</span>
    </Link>
  )
}

export default Folder