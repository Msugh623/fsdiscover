import React from 'react'
import { useStateContext } from '../state/StateContext'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import PlaceHolder from './PlaceHolder'

const PinnedIcons = ({ app, handleClick = () => null, onTaskbar = false }) => {
    const { handleIconClick, opened } = useStateContext()
    const aio = opened.find(win => win.location == app.location)
    return (
        <div draggable={true} className={`app btn fs-5 ico px-1 shadow my-auto me-1`} style={{ minWidth: '',background:"#aee0f120",width:'60px' }} title={app.name} id={app.location} onClick={() => { handleIconClick(app.location); handleClick() }}>
        <LazyLoadImage draggable={false} effect='opacity' alt={app.name}  src={app.icon} width={'35px'} placeholder={<PlaceHolder />} height={'35px'}   />
            {!onTaskbar &&
                <div style={{maxWidth:''}}>
                    <div className='small text-center text-light text-truncate mt-1' style={{ fontSize: '.55em', minWidth: '50px', maxWidth: '70px' }}>{app.name}</div>
                </div>
            }
            {aio?.zIndex &&
                <hr className={`m-0`} style={{
                    position: 'relative',
                    top: '3px',
                    border: `${aio?.zIndex == 5 ? 2 : 1}px solid #3f8ee9ff`,
                    opacity: 1,
                    borderRadius: '3px',
                    transition: 'all, .3s'
                }} />
            }
        </div>
    )
}

export default PinnedIcons
