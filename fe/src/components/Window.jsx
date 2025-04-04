import React, { useEffect, useState } from 'react'
import { FaMaximize, FaX } from 'react-icons/fa6'
import { useStateContext } from '../state/StateContext'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { BiArrowBack, BiCategory, BiLinkExternal } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import PlaceHolder from './PlaceHolder'

const AppWindow = ({ app }) => {
  const { upDateWindow, killWindow, defaults, setToTop } = useStateContext()
  const { location } = app
  const [lastMsDown, setLastMsDown] = useState({ x: 0, y: 0, diffX: 0, diffY: 0 })
  const [prev, setPrev] = useState({ x: app.x, y: app.y })
  const [isAbouting, setIsAbouting] = useState(false)
  const defVal = defaults()
  const [dd, setDd] = useState(false)

  const handleMiniMax = () => {
    app.x && setPrev(prev => ({
      ...prev,
      x: app.x
    }))
    app.y && setPrev(prev => ({
      ...prev,
      y: app.y
    }))
    if (app.width == window.innerWidth && app.height == window.innerHeight) {
      upDateWindow(location, 'height', Number(localStorage.getItem('h-' + app.location)) || defVal.height)
      upDateWindow(location, 'width', Number(localStorage.getItem('w-' + app.location)) || defVal.width)
      upDateWindow(location, 'x', prev.x)
      upDateWindow(location, 'y', prev.y)
    } else {
      upDateWindow(location, 'y', 0)
      upDateWindow(location, 'x', 0)
      upDateWindow(location, 'width', window.innerWidth)
      upDateWindow(location, 'height', window.innerHeight)
    }
  }

  function handleDrag(e, end) {
    end == 'start' && (e.target.style.opacity = '0')
    end == 'start' && setTimeout(() => {
      e.target.style.opacity = '1'
    }, 0);

    const xcurr = e.clientX || e.touches[0].clientX;
    const ycurr = e.clientY || e.touches[0].clientY;

    let appX = xcurr
    let appY = ycurr

    upDateWindow(location, 'x', appX - lastMsDown.diffX)
    upDateWindow(location, 'y', appY)

    if (appY <= 5 || appY >= window.innerHeight - 5) {
      upDateWindow(location, 'x', 0)
      upDateWindow(location, 'y', 0)
      upDateWindow(location, 'height', window.innerHeight - 75)
      upDateWindow(location, 'width', window.innerWidth)
      setTimeout(() => {
        upDateWindow(location, 'width', window.innerWidth)
      }, 20);
    } else if (appY > 5 && appY < window.innerHeight - 5) {
      upDateWindow(location, 'height', Number(localStorage.getItem('h-' + app.location)) || defVal.height)
    }
    if (appX <= 5 || appX >= window.innerWidth - 5) {
      upDateWindow(location, 'x', 0)
      upDateWindow(location, 'y', 0)
      upDateWindow(location, 'height', window.innerHeight - 75)
      upDateWindow(location, 'width', window.innerWidth)
    } else if (appX > 5 && appX < window.innerWidth - 5) {
      if (appY > 0 && appY < window.innerHeight) { upDateWindow(location, 'width', Number(localStorage.getItem('w-' + app.location)) || defVal.width) }
    }
  }

  const changeKey = (key, val) => {
    const swap = ['w', 's'].includes(key)
    const prevVal = Number(localStorage.getItem(key + '-' + app.location)) || 0
    const diff = !swap ? prevVal - val : val - prevVal
    setTimeout(() => localStorage.setItem(key + '-' + app.location, val), 0)
    return diff < 100 && diff > -100 ? diff : 0
  }

  function handleTouchStart(e) {
    const touch = e.touches[0];
    handleDrag({
      clientX: touch.clientX,
      clientY: touch.clientY,
    }, 'start');
  }

  function handleTouchMove(e) {
    const touch = e.touches[0];
    handleDrag({
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
  }

  function handleTouchEnd(e) {
    handleDrag({
      clientX: touch.clientX,
      clientY: touch.clientY,
    }, 'end');
  }

  const Handlers = (clientX, clientY) => {
    const prevWidth = app.width
    const prevHeight = app.height
    return {
      n: () => {

        const diff = changeKey('n', clientY)
        const newHeight = prevHeight + diff
        newHeight > 400 && (() => {
          localStorage.setItem('h-' + app.location, "" + newHeight)
          upDateWindow(location, 'height', newHeight)
          upDateWindow(location, 'y', clientY)
        })()
      },
      s: () => {
        const diff = changeKey('s', clientY)
        const newHeight = prevHeight + diff
        newHeight > 400 && (() => {
          localStorage.setItem('h-' + app.location, "" + newHeight)
          upDateWindow(location, 'height', newHeight)
        })()
      },
      e: () => {
        const diff = changeKey('e', clientX)
        const newWidth = prevWidth + diff
        newWidth > 300 && (() => {
          localStorage.setItem('w-' + app.location, "" + newWidth)
          upDateWindow(location, 'width', newWidth)
          upDateWindow(location, 'x', clientX)
        })()
      },
      w: () => {
        const diff = changeKey('w', clientX)
        const newWidth = prevWidth + diff
        newWidth > 300 && (() => {
          localStorage.setItem('w-' + app.location, "" + newWidth)
          upDateWindow(location, 'width', newWidth)
        })()
      }
    }
  }

  async function handleResize(e, end) {
    end == 'start' && (e.target.style.opacity = '0')
    end == 'start' && setTimeout(() => {
      e.target.style.opacity = '1'
    }, 50);
    const { title } = e.target
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    const handlers = Handlers(clientX, clientY)
    handlers[title]()
  }

  useEffect(() => {
    upDateWindow(location, 'height', Number(localStorage.getItem('h-' + app.location)) || defVal.height)
    upDateWindow(location, 'width', Number(localStorage.getItem('w-' + app.location)) || defVal.width)
    // return () => localStorage.clear()
    localStorage.setItem('focused', app.location)
    setToTop(app.location)
  }, [])

  useEffect(() => {
    app.height > 0 && app.height < window.innerHeight && localStorage.setItem('h-' + app.location, "" + app.height || defVal.height)
    app.width > 0 && app.width < window.innerWidth && localStorage.setItem('w-' + app.location, "" + app.width || defVal.width)
  }, [app.width, app.height])

  return (
    <div id={`window-${app.location}`} className={`rounded window ${app.zIndex == 3 ? 'shadow-lg' : 'shadow-md'} ${app.isMini && 'd-none'} d-flex`}
      onMouseEnter={() => {
        localStorage.setItem('focused', app.location)
        setToTop(app.location)
      }}
      style={{
        position: 'fixed',
        width: app.width + 'px',
        height: app.height + 'px',
        top: app.y + 'px',
        left: app.x + 'px',
        zIndex: app.zIndex,
        transition: 'all, .1s'
      }}>
      <div className="divider my-auto h-100 resizeHr"
        title='e'
        onDragStart={(e) => handleResize(e, 'start')}
        onDrag={(e) => handleResize(e)}
        onDragEnd={(e) => handleResize(e, true)}
        onTouchStart={(e) => handleResize(e, 'start')}
        onTouchMove={(e) => handleResize(e)}
        onTouchEnd={(e) => handleResize(e, true)}
        draggable='true'
        style={{ width: '2px', background: '#0e0e0e', height: '80%', cursor: 'w-resize' }}>
      </div>
      <div className="growIn" style={{ width: 'calc(100% - 4px)' }}>
        <hr className='m-0 bg-light border-light resizeHr resN' title='n'
          onDragStart={(e) => handleResize(e, 'start')}
          onDrag={(e) => handleResize(e)}
          onDragEnd={(e) => handleResize(e, true)}
          onTouchStart={(e) => handleResize(e, 'start')}
          onTouchMove={(e) => handleResize(e)}
          onTouchEnd={(e) => handleResize(e, true)}
          draggable='true' />
        <header draggable="true"
          id={`window-header-${app.location}`}
          onMouseDown={(e) => {
            const appOtherEnd = (app.width / 2) + e.clientX
            const xDiff = appOtherEnd - e.clientX
            setLastMsDown({ x: e.clientX, y: e.clientY, diffX: xDiff, diffY: e.screenY - e.clientY })
          }}
          onDoubleClick={handleMiniMax}
          onDragStart={(e) => handleDrag(e, 'start')}
          onDrag={(e) => handleDrag(e, 'mid')}
          onDragEnd={(e) => handleDrag(e, 'end')}
          onTouchStart={(e) => {
            const appOtherEnd = (app.width / 2) + e.touches[0].clientX
            const xDiff = appOtherEnd - e.clientX
            setLastMsDown({ x: e.clientX, y: e.clientY, diffX: xDiff, diffY: e.screenY - e.clientY })
            handleTouchStart(e);
          }}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="d-flex window-header text-dark">
          <div className="my-auto ps-2">
            {isAbouting ?
              <BiArrowBack className='fs-5 slideUp aniFast' onClick={() => setIsAbouting(prev => !prev)} />
              : <AiOutlineInfoCircle className='fs-5 slideUp aniFast' onClick={() => setDd(prev => !prev)} />
            }
            <LazyLoadImage effect='opacity' placeholder={<PlaceHolder />} src={app.icon} width={'20px'} draggable={false} className='rounded me-1' /> {app.name}
          </div>
          <div className="ms-auto py-1">
            <button onClick={() => upDateWindow(app.location, 'isMini', !app.isMini)}
              style={{ width: '40px', height: '40px' }}
              className="btn rounded-circle shadow-sm me-1 btn-light">
              __
            </button>
            <button onClick={handleMiniMax}
              style={{ width: '40px', height: '40px' }}
              className="btn rounded-circle shadow-sm me-1 btn-light">
              <FaMaximize className='h-ico' />
            </button>
            <button onClick={() => killWindow(app.location)}
              style={{ width: '40px', height: '40px' }}
              className="btn rounded-circle shadow-sm me-1 btn-danger">
              <FaX className='h-ico' />
            </button>
          </div>
        </header>
        <iframe src={app.location} className={(isAbouting ? 'd-none' : '') + 'window-inner'} draggable="false" id={'iframe-' + app.location} />
        {isAbouting && <AppAbout app={app} />}
        <hr className='m-0 bg-light border-light resizeHr resS'
          draggable='true'
          title='s'
          onDragStart={(e) => handleResize(e, 'start')}
          onDrag={(e) => handleResize(e)}
          onDragEnd={(e) => handleResize(e, true)}
          onTouchStart={(e) => handleResize(e, 'start')}
          onTouchMove={(e) => handleResize(e)}
          onTouchEnd={(e) => handleResize(e, true)}
          style={{ zIndex: 5, position: 'relative', bottom: '8px' }} />
        {dd &&
          <AppDropDown app={app} abouter={setIsAbouting} ddSetter={setDd} />
        }
      </div>
      <div className="divider my-auto h-100 resizeHr"
        draggable='true'
        title='w'
        onDragStart={(e) => handleResize(e, 'start')}
        onDrag={(e) => handleResize(e)}
        onDragEnd={(e) => handleResize(e, true)}
        onTouchStart={(e) => handleResize(e, 'start')}
        onTouchMove={(e) => handleResize(e)}
        onTouchEnd={(e) => handleResize(e, true)}
        style={{ width: '2px', background: '#0e0e0e', height: '80%', cursor: 'e-resize' }}></div>
    </div >
  )
}

export default AppWindow

const AppAbout = ({ app = {} }) => {

  return <div className="w-100 darkTheme p-3 bg-dark" id='window-inner'>
    <div className="slideUp aniFast">
      <h3 className='mb-1'> <LazyLoadImage effect='opacity' placeholder={<PlaceHolder />} src={app.icon} height={'30px'} alt="" className='icon' /> {app.name}</h3>
      <div className=""><a target='_blank' href={app.location}>{app.location}</a></div>
      <div className='shadow-sm btn btn-dark rounded p-1 pt-0 d-inline'><BiCategory className='icon' /> {app?.category}</div>
      <pre className='mt-3 pre' style={{
        whiteSpace: 'pre-wrap',
        fontFamily: 'inherit',
        fontSize: 'inherit',
      }}>
        {app?.about || ''}
      </pre>
    </div>
  </div>
}

const AppDropDown = ({ app, abouter, ddSetter }) => {
  const navigate = useNavigate()
  return <div className="darkTheme rounded" style={{ position: 'fixed', left: app.x + 'px', top: app.y + 'px', }}>
    <div className='rounded shadow-lg p-3 panel ' style={{
      width: '220px',
      zIndex: app.zIndex + 10
    }}>
      <div>
        <BiArrowBack className='fs-5' onClick={() => {
          ddSetter(prev => !prev);
          navigate(-1)
        }} />
      </div>
      <div className="rounded pt-1">
        <div className="border p-1 rounded c-pointer" onClick={() => {
          ddSetter(prev => !prev);
          abouter(prev => !prev)
        }}>
          <AiOutlineInfoCircle className='text-dark icon' /> App info
        </div>
        <div className="border p-1 mt-1 rounded c-pointer" onClick={() => {
          ddSetter(prev => !prev);
          window.open(app.location, '_blank')
        }}>
          <div className="d-flex">
            <BiLinkExternal className='text-dark my-auto me-1' /> Run in browser
          </div>
        </div>
      </div>
    </div>
  </div>
}