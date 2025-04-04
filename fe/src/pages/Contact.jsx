import React from 'react'
import { BiEnvelope, BiPlus } from 'react-icons/bi'
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa6'
import Delay from '../components/Delay'
import { Link } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import PlaceHolder from '../components/PlaceHolder'

const Contact = () => {

    return (

        <section id="contact" className="contact section pt-0 darkTheme  m-0 h-100" style={{ minHeight: '100vh' }}>
            {/* <!-- Section Title --> */}
            <div className="container section-title pt-4 growIn" data-aos="fade-up">
                <div className="">
                    <h2 className='mb-0 slideUp d-flex'>
                        <div className="mx-auto row">
                            <div className="col-md-5">
                                <LazyLoadImage effect='opacity' placeholder={<PlaceHolder />} src={'https://res.cloudinary.com/dqbgai7xd/image/upload/v1736547841/IMG_20250108_220759_005_wuzxgh.webp'} height={'250px'} alt="" className='icon rounded slideUp' />
                            </div>
                            <Delay delay={600}>
                                <div className="my-auto col-md-1 px-md-5 slideRight">
                                    <BiPlus className='fs-1' />
                                </div>
                            </Delay>
                            <Delay delay={800}>
                                <div className="my-auto col-md-5">
                                    <Link to={'/'}>
                                        <LazyLoadImage effect='opacity' placeholder={<PlaceHolder />} src={'/sprintetName.png'} height={'120px'} alt="" className='icon slideRight' />
                                    </Link>
                                </div>
                            </Delay>
                        </div>
                    </h2>
                    <Delay delay={1000}>
                        <div className="mb-3 mt-md-5 slideUp">
                            Hey, I'm Chia Ernest, a skilled programmer and the founder of Sprintet. At Sprintet, we're dedicated to transforming innovative ideas into powerful tech solutions. I'm passionate about tackling complex problems and delivering creative, high-impact results. Whether it's building sophisticated web apps or designing robust software, I'm always ready for the next challenge. Let's work together and make something amazing.
                        </div>
                    </Delay>
                    <Delay delay={1300}>
                        <div className="mb-3 slideUp">
                            Ready to bring your vision to life? Whether you have a project in mind or just want to discuss ideas, I'm here to help. Drop me a message, and let's create something amazing together!
                        </div>
                    </Delay>

                </div>
            </div>
            <div className="container section-title d-flex" data-aos="fade" data-aos-delay="100">
                <div className="col-10 social mx-auto text-sm-center panContainer  mt-0 pt-0">
                    <Delay inline={true} delay={1500}>
                        <a target='_blank' className='shadow panel hovShade me-2 slideIn' href="https://github.com/Msugh623">
                            <span className="bi bi-twitter "> <FaGithub className='icon fs-4' />
                                <div className="text">Github
                                </div>
                            </span>
                        </a>
                    </Delay>

                    <Delay inline={true} delay={2000}>
                        <a target='_blank' className='shadow panel hovShade me-2 slideRight' href="mailto:iternenge469@gmail.com"><span className="bi bi-twitter"> <BiEnvelope className='icon fs-4' />
                            <div className="text">
                                Email
                            </div>
                        </span>
                        </a>
                    </Delay>

                    <Delay inline={true} delay={2100}>
                        <a target='_blank' className='shadow panel hovShade me-2 slideRight' href="https://wa.me/2348121667177"><span className="bi bi-facebook"> < FaWhatsapp className='icon fs-4' />
                            <div className="text">
                                Whatsapp
                            </div>
                        </span></a>
                    </Delay>

                    <Delay inline={true} delay={2200}>
                        <a target='_blank' className='shadow panel hovShade me-2 slideRight' href="https://ng.linkedin.com/in/chia-ernest-b923962a9"><span className="bi bi-instagram"><FaLinkedin className='fs-4 icon' />
                            <div className="text">
                                Linkedin
                            </div>
                        </span></a>
                    </Delay >

                    {/* <br />

                    <Delay inline={true} delay={1300}>
                        <a target='_blank' className='shadow hovShade me-2 slideIn' href="https://x.com/ChiaCollin34870?t=L4TBnTrV0yJPHvw8ciPYDQ&s=09"><span className="bi bi-twitter"> <PiXLogo className='icon fs-4' />
                            <div className="text">
                                X
                            </div>
                        </span></a>
                    </Delay >

                    <Delay inline={true} delay={1400}>
                        <a target='_blank' className='shadow hovShade me-2 slideIn' href="https://www.tiktok.com/@collinscuts?_t=8omOEFxDeUw&_r=1"><span className="bi bi-linkedin"><PiTiktokLogoBold className='icon fs-4' />
                            <div className="text">
                                Tiktok
                            </div>
                        </span></a>
                    </Delay > 

                    <Delay inline={true} delay={1200}>

                    </Delay>
                    */}
                </div >
            </div >

        </section >
    )
}

export default Contact