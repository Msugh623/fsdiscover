import React, { useEffect, useState } from 'react'
import Delay from './Delay'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import PlaceHolder from './PlaceHolder'

const Loader = ({ animate }) => {
    const [rm, setRm] = useState(Boolean(animate))

    useEffect(() => {
        setTimeout(() => setRm(true), 800)
    }, [])

    return (
        <div className='w-100' style={{
            position: 'fixed',
            top: '45vh'
        }}>
            <div className="fixed-top w-100 h-100 bg-dark" style={{ zIndex: -1 }}>

            </div>

            <div className="d-flex">
                <div className="mx-auto">
                    <h1 className=''>
                        {/* <FaSpinner className='spinner icon' /> */}
                        {!rm &&
                            <Delay delay={!animate ? 50 : 0}>
                                <div className="img">
                                    <div className="fixed-top d-flex w-100" style={{
                                        height: '90%'
                                    }}>
                                        <div className="m-auto" style={{
                                            maxWidth: '70vw',
                                            width:'150px'
                                        }}>
                                            <LazyLoadImage effect='opacity' placeholder={<PlaceHolder />} src="/sprintetS.png" className='m-auto slideUp rounded img-fluid'  alt="bg"  />
                                        </div>
                                    </div>
                                </div>
                            </Delay>
                        }
                        {animate &&
                            <Delay delay={!animate ? 800 : 0}>
                                <div className="img">
                                    <div className="fixed-top d-flex w-100" style={{
                                        height: '90%'
                                    }}>
                                        <div className="m-auto" style={{
                                            maxWidth: '70%',
                                            width:'400px'
                                        }}>
                                            <LazyLoadImage effect='opacity' placeholder={<PlaceHolder />} src="/sprintetName.png" className={`m-auto rounded slideLeft  img-fluid`} alt="bg" />
                                        </div>
                                    </div>
                                </div>
                            </Delay>
                        }
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default Loader