import React from 'react'
import { useFsContext } from '../../state/FsContext'

const MainSection = () => {
    const { isFetching, locChildren } = useFsContext()
    
  return (
    <div>
        MainSection
        {isFetching}
        {locChildren}
    </div>
  )
}

export default MainSection