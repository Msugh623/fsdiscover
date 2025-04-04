import React, { useEffect, useState } from 'react'
import { useStateContext } from '../state/StateContext'
import PinnedIcons from './PinnedIcons'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import PlaceHolder from './PlaceHolder'

const Menu = () => {

    const { page } = useParams()
    const navigate = useNavigate()
    const [panelClassName, setPanelClassName] = useState('d-none')
    const [href, setHref] = useState(location.href)
    const [hasPannel, setHasPannel] = useState(page)
    const { apps, vw, handleIconClick } = useStateContext()

    useEffect(() => {
        location.href !== href && setHref(location.href)
    }, [location.href == href])

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

    return (
        <>
            <div className="menu-panel">
                <div className="mx-auto col-12 col-sm-10 col-md-8 col-xl-9">
                    {hasPannel &&
                        <div onClick={() => setHasPannel(false)} className="" style={{ position: 'fixed', left: '0', right: '0', top: '0', bottom: '0' }}>

                        </div>
                    }
                    <div className={`inner rounded shadow-lg p-3 text-light bg-dark text-left slideUp ${panelClassName}`} style={{
                        zIndex: 5,
                    }}>
                        <div className="row ani" style={{
                            minHeight: '400px !important',
                            height: '60vh',
                            maxHeight: '800vh'
                        }}>
                            {
                                page !== 'apps' && <div className={`col-md-7 scrollbs ani ${page == 'apps' && 'd-none'}`} style={{
                                    height: '100%',
                                    overflowY: 'auto'
                                }}>
                                    <div className="d-flex ">
                                        <div className="">
                                            <LazyLoadImage effect='opacity' src="/sprintetName.png" placeholder={<PlaceHolder />} className='menuimg' alt='Sprintet S logo' height={'100px'} />
                                        </div>
                                        {vw < 768 && page !== 'apps' &&
                                            <div className="my-auto ms-auto">
                                                <div className="p-2 active "
                                                    style={{ borderRadius: '3px' }}
                                                    onClick={() => { navigate(page == 'apps' ? '/' : '/apps'); setHref('') }}>
                                                    {page == 'apps' ? <span className="slideLeft aniFast"><BiChevronLeft className='fs-5 icon' />Menu</span>
                                                        : <div className="slideRight aniFast">All Apps<BiChevronRight className='fs-5 icon' /></div>}
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    <div className="d-flex flex-column h-auto" >
                                        Sprintet is a dynamic programming startup dedicated to delivering cutting-edge software solutions that drive business growth. We specialize in agile development methodologies, ensuring efficient project execution, high-quality results, and continuous improvement.

                                        <div className='mt-3'>
                                            <Link to={'?a=about'} title="Learn more" aria-label="About Us - Learn more about Sprintet"  onClick={() => { handleIconClick('about'); setHasPannel(false) }} className="p-2 active d-inline btn" style={{ borderRadius: '3px' }}>
                                                Learn More
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className={`${page == 'apps' ? 'col-12' : 'col-md-5 ps-0'} scrollbs ${vw < 768 && page !== 'apps' && 'd-none'}`} style={{
                                height: '90%',
                                maxHeight: '100%',
                                overflowY: 'auto'
                            }}>
                                <div id="pinned" className={`${page !== 'apps' && 'ps-3'} w-100`} style={{
                                    borderLeft: page !== 'apps' && '1px solid #efefef40',
                                    minHeight: '95%'
                                }}>
                                    <div className="my-2">
                                        <div className="p-2 active d-inline"
                                            style={{ borderRadius: '3px' }}
                                            onClick={() => { navigate(page == 'apps' ? '/' : '/apps'); setHref('') }}>
                                            {page == 'apps' ? <span className="slideLeft aniFast"><BiChevronLeft className='fs-5 icon' />Menu</span>
                                                : <span className="slideRight aniFast">All Apps<BiChevronRight className='fs-5 icon' /></span>}
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        {
                                            apps.map((app) => (
                                                <PinnedIcons key={app?.location} app={app} handleClick={() => setHasPannel(false)} />
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="start" title="Sprintet Menu" className={`app my-auto p-1 btn fs-5 ${hasPannel && 'active'}`} onClick={() => setHasPannel(prev => !prev)}>
                <LazyLoadImage effect='opacity' src='/sprintetS.png' placeholder={<PlaceHolder />} height={40} alt='Sprintet Logo' about='Sprintet Logo Image' style={{}} />
            </div>
            <div className="divider my-auto mx-2" style={{ width: '1px', background: '#efefef60', height: '80%' }}></div>
        </>
    )
}

export default Menu
