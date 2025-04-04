import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'

const Clock = () => {
    const [date, setDate] = useState(new Date())
    const [hasPannel, setHasPannel] = useState(undefined)
    const [panelClassName, setPanelClassName] = useState('d-none')
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    useEffect(() => {
        if (!hasPannel) {
            if (hasPannel == undefined) {
                return
            }
            setPanelClassName('slideOut')
            setTimeout(() => {
                setPanelClassName('d-none')
            }, 500);
        } else {
            setPanelClassName('d-block')
        }
    }, [hasPannel])

    useEffect(() => {
        setInterval(() => {
            setDate(new Date())
        }, 1000);
    }, [])

    return (
        <>
            {hasPannel &&
                <div onClick={() => setHasPannel(prev => !prev)} className="d-block" style={{ position: 'fixed', left: '0', right: '0', top: '0', bottom: '0', }}>
                </div>
            }
            <div className="clock-panel" onClick={() => setHasPannel(false)}>
                <div className="ms-auto col-12 col-sm-8 col-md-8">

                    <div className={`inner rounded shadow-lg p-3 text-light bg-dark text-left slideUp ${panelClassName}`} onClick={(e) => e.stopPropagation()} style={{
                        zIndex: 5,
                    }}>
                        <div className="mb-2">
                            <div className="panel">
                                <Calendar value={date} />
                            </div>
                        </div>
                        <div className="active p-2 rounded">
                            <div>{weekDays[date.getDay()]}</div>
                            <div className="fs-5">{months[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='ms-auto text-center rounded my-auto py-1' style={{ minWidth: '80px', backgroundColor: '#efefef10', scrollPadding: '10px' }} onClick={() => setHasPannel(prev => !prev)}>
                <div className="c-default" style={{ cursor: 'default' }}>
                    <div style={{ fontSize: '.9em'  }}>
                        {
                            date.getHours() < 10 ?
                                `0${date.getHours()}`
                                : date.getHours()
                        }:{
                            date.getMinutes() < 10 ?
                                `0${date.getMinutes()}`
                                : date.getMinutes()
                        }
                    </div>
                    <div style={{ fontSize: '.9em' }}>
                        {date.toDateString().split(' ').slice(0, 3).join(' ')}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Clock