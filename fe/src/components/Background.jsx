import React, { useEffect } from 'react'
import Delay from './Delay'
import bgSrc from '/bg.jpg'
import sprintetLogoNameSrc from "/sprintetName.png"
import { LazyLoadImage } from 'react-lazy-load-image-component'
import PlaceHolder from './PlaceHolder'
import { Link } from 'react-router-dom'
import '../css/cse.css'


const Background = () => {

    return (
        <div className="bg p-0" style={{ position: 'fixed', left: '0', right: '0', top: '0', bottom: '0', zIndex: 0, background: '#0e0e0e' }}>
            {/* <Suspense fallback={'img loader'}> */}
            <LazyLoadImage effect='opacity' className='fadeIn' draggable={false} placeholder={<PlaceHolder />} src={bgSrc} height={'100%'} alt="bg" style={{
                opacity: .3,
                minWidth: '100vw',
                alignSelf: 'center'
            }} />

            {/* bn */}
            {/* </Suspense> */}
            <div className="fixed-top d-flex w-100 pt-md-5" style={{
                height: '90%'
            }}>
                <Delay delay={1300}>
                    {/* <Suspense fallback={'img loader'}> */}
                    <div className="m-auto mt-md-5 bg-dark p-4 shadow-lg slideUp" style={{
                        maxWidth: '70vw',
                        width: '400px',
                        borderRadius: '18px'
                    }}>
                        <Link to={'/'}>
                            <LazyLoadImage effect='opacity' src={sprintetLogoNameSrc} draggable={false} className='rounded growIn  img-fluid' placeholder={<PlaceHolder />} alt='Sprintet Name Logo' about='Sprintet name logo image' />
                        </Link>
                        <div className='no-theme w-100'>
                        </div>
                    </div>
                    {/* </Suspense> */}
                </Delay>
            </div>
        </div>
    )
}

export default Background