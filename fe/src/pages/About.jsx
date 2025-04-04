import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Delay from '../components/Delay'
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa6'
import { BiEnvelope } from 'react-icons/bi'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import PlaceHolder from '../components/PlaceHolder'

const About = () => {
    const [vars, setVars] = useState({ vh: window.innerHeight, sh: scrollY })

    useEffect(() => {
        const p = document.getElementById('contact')

        onscroll = () => {
            const rect = p.getBoundingClientRect()
            const { bottom } = rect
            const vh = window.innerHeight
            const sh = bottom
            setVars({
                vh,
                sh
            })
        }

    }, [])

    return (
        <div className="p-3 slideUp container darkTheme">
            <h2 className='mb-0'>
                <Link to={'/'}><LazyLoadImage effect='opacity' placeholder={<PlaceHolder />} src={'/sprintetName.png'} height={'80px'} alt="" className='icon' /></Link>
            </h2>
            <div className="mb-3">
                Learn more about <Link to={'/contact'} className='' style={{ textDecoration: 'underline' }}>Chia Ernest</Link>, the guy who owes and runs this place.
            </div>
            <p>
                <div className="container">
                    <p className="">Sprintet is a dynamic programming startup dedicated to delivering cutting-edge software solutions that drive business growth. We specialize in agile development methodologies, ensuring efficient project execution, high-quality results, and continuous improvement.</p>
                    <p className="mb-4">Our team of skilled programmers and engineers are passionate about transforming ideas into reality. We leverage the latest technologies and industry best practices to create innovative solutions that meet your unique needs. Whether you're looking to develop a new mobile app, build a robust web platform, or modernize your existing systems, Sprintet is your trusted partner.</p>
                    <h4 className=''>Why Choose Sprintet?</h4>

                    <ul className='mb-4'>
                        <li className='my-2'>
                            <strong>Agile Development:</strong> We embrace agile principles for flexibility, collaboration, and rapid delivery.
                        </li>
                        <li className='my-2'>
                            <strong>Custom Solutions:</strong> Our team tailors solutions to your specific requirements and goals.
                        </li>
                        <li className='my-2'>
                            <strong>Technological Expertise:</strong> We stay up-to-date with the latest trends and technologies.
                        </li>
                        <li className='my-2'>
                            <strong>Client-Centric Approach:</strong> Your satisfaction is our top priority.
                        </li>
                        <li className='my-2'>
                            <strong>Experienced Team:</strong> Our team has a proven track record of delivering successful projects.
                        </li>
                        <li className='my-2'>
                            <strong>Transparent Communication:</strong> We maintain open and honest communication throughout the development process.
                        </li>
                        <li className='my-2'>
                            <strong>Scalability:</strong> Our solutions can grow with your business as your needs evolve.
                            Let's Build Something Great Together.
                        </li>

                    </ul>
                    Contact us today to discuss your project and explore how Sprintet can help you achieve your business objectives. We're excited to partner with you and deliver exceptional results.
                    <h4 className=" mt-4">Let's Build Something Great Together.</h4>
                    <p className="">Contact us today to discuss your project and explore how Sprintet can help you achieve your business objectives. We're excited to partner with you and deliver exceptional results.</p>

                    <div className="col-10 social panContainer  mt-0 pt-0" id='contact' style={{
                        minHeight: '100px',
                        height: '100px'
                    }}>
                        {(vars.vh - vars.sh) > -50 &&
                            <div>
                                <Delay inline={true} delay={500}>
                                    <a target='_blank' className='shadow hovShade me-2 slideIn panel' href="https://github.com/Msugh623">
                                        <span className="bi bi-twitter "> <FaGithub className='icon fs-4' />
                                            <div className="text">Github
                                            </div>
                                        </span>
                                    </a>
                                </Delay>
                                <Delay inline={true} delay={800}>
                                    <a target='_blank' className='shadow hovShade me-2 slideRight panel' href="mailto:iternenge469@gmail.com"><span className="bi bi-twitter"> <BiEnvelope className='icon fs-4' />
                                        <div className="text">
                                            Email
                                        </div>
                                    </span>
                                    </a>
                                </Delay>
                                <Delay inline={true} delay={900}>
                                    <a target='_blank' className='shadow hovShade me-2 slideRight panel' href="https://wa.me/2348121667177"><span className="bi bi-facebook"> < FaWhatsapp className='icon fs-4' />
                                        <div className="text">
                                            Whatsapp
                                        </div>
                                    </span></a>
                                </Delay>
                                <Delay inline={true} delay={1000}>
                                    <a target='_blank' className='shadow hovShade me-2 slideRight panel' href="https://ng.linkedin.com/in/chia-ernest-b923962a9"><span className="bi bi-instagram"><FaLinkedin className='fs-4 icon' />
                                        <div className="text">
                                            Linkedin
                                        </div>
                                    </span></a>
                                </Delay >
                            </div>
                        }
                    </div >
                </div>
            </p >
        </div >
    )
}

export default About