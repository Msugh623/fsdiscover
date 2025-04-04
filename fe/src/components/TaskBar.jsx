import React from 'react'
import { useStateContext } from '../state/StateContext'
import PinnedIcons from './PinnedIcons'
import Menu from './Menu'
import Delay from './Delay'
import Clock from './Clock'

const TaskBar = () => {
    const { pinned, winIsFs, opened } = useStateContext()
    
    return ( 
        <div>
            <Delay delay={800}>
                <div id="taskBar" className={`fixed-bottom d-flex ${winIsFs && 'd-none'}`}>
                    <div id="taskbarInner"
                        className="custom-navmenu mx-auto slideUp p-2 col-11 col-sm-10 col-md-8 col-xl-9 mb-2 bg-dark rounded d-flex text-light">
                        <Menu />
                        <div id="pinned" className='w-100 d-flex' style={{
                            overflowX: 'auto'
                        }}>
                            {
                                [...(opened.filter(app => !app.pinned)), ...pinned].map((app) => (
                                    <PinnedIcons key={app?.location} app={app} onTaskbar={true} />
                                ))
                            }
                        </div>
                        <Clock/>
                    </div>

                </div>
            </Delay>
        </div>
    )
}

export default TaskBar