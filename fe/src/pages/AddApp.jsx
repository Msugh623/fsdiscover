import React, { useEffect, useState } from 'react'
import { useStateContext } from '../state/StateContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import api from '../../axios/api'
import { App } from '../assets/schemas'
import { FaSpinner } from 'react-icons/fa'

const AddApp = () => {
  const { fetchSrc } = useStateContext()
  const navigate = useNavigate()
  const [newData, setNewData] = useState({ ...(new App({})) })

  function handleChange({ target }) {
    const { name, value } = target
    setNewData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const tst = toast('Please Wait...', {
      autoClose: false,
      icon: <FaSpinner className='spinner icon' />
    })
    try {
      const fd = { ...(new App(newData)) }
      const _ = await api.post('/rq/apps', fd)
      navigate('/admin', { replace: true })
    } catch (err) {
      toast.error(`ERROR: ${err.message}`)
    } finally {
      toast.dismiss(tst)
    }
  }

  useEffect(() => {
    fetchSrc()
  }, [])

  return (
    <section id="contact" className="contact section pt-1  darkTheme">
      {/* <!-- Section Title --> */}
      <div className="container section-title py-4 growIn" data-aos="fade-up">
        <h2>Add App</h2>
      </div>
      <div className="container slideUp" data-aos="fade" data-aos-delay="100">
        <div className="row ">
          <div className="col-md-8 mx-auto">
            {
              <form onSubmit={handleSubmit} className="php-email-form" data-aos="fade-up" data-aos-delay="200">
                <div className="row gy-4">

                  <div className="col-md-12">
                    <input type="text" name="name" value={newData.name} onChange={handleChange} className="form-control shadow-sm " placeholder="Creation Name" required />
                  </div>

                  <div className="col-md-12">
                    <input type="text" name="icon" value={newData.icon} onChange={handleChange} className="form-control shadow-sm " placeholder="App Icon" required />
                  </div>

                  <div className="col-md-12">
                    <input type="text" name="category" value={newData.category} onChange={handleChange} className="form-control shadow-sm " placeholder="App Category" required />
                  </div>

                  <div className="col-md-12">
                    <input type="text" name="location" value={newData.location} onChange={handleChange} className="form-control shadow-sm" placeholder="Web URL" required />
                  </div>

                  <div className="col-md-12">
                    <div className="panel">
                      <label className='px-2'>Is Pinned</label>
                      <hr className="m-0" />
                      <select type="text" name="pinned" value={newData.pinned} onChange={handleChange} className="form-control shadow-sm" >
                        <option value={''}>false</option>
                        <option value={true}>true</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <textarea className="form-control shadow-sm" name="about" value={newData.about} onChange={handleChange} rows="6" placeholder="Description" required></textarea>
                  </div>

                  <div className="col-md-12 text-center">
                    {<button type="submit">Add Creation</button>}
                  </div>

                </div>
              </form>
            }
          </div>

        </div>

      </div>

    </section >
  )
}

export default AddApp
