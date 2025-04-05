import React from 'react'
import { useFsContext } from '../../state/FsContext'
import DirItem from './components/DirItem'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import { useEffect } from 'react'
import { FaSpinner } from 'react-icons/fa'

const MainSection = () => {
  const { isFetching, locChildren,isHidden,setIsHidden} = useFsContext()
    
  useEffect(() => {
    // console.log(locChildren)
    window.innerWidth < 768 ? setIsHidden(true) : setIsHidden(false)
  },[window.innerWidth])  

  return (
    <div style={{
      minWidth:'300px'
    }} >
      
      <div className="d-flex w-100">
        {isHidden?false:<Sidebar />}
        <div className="w-100 bg-dark" style={{
            minWidth:window.innerWidth<500&&!isHidden?'100vw':''
        }}>
          <Header />
          <div className="p-4 pt-3 w-100" style={{
            maxWidth: '100%',
          }}>
            {isFetching && !locChildren.length ? <div className='fs-4 text-center'style={{
                position: 'fixed',
                bottom: '10px',
                right:'10px'
              }}>
              <FaSpinner className='spinner' />
              </div>:''
              }
            {locChildren.map((item, i) => (<DirItem key={'' + item + i} item={item} />))}
          </div>
        </div>
      </div>
        
    </div>
  )
}

export default MainSection