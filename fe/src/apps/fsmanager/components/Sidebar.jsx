import React from 'react';
import { useFsContext } from '../../../state/FsContext';
import { Link, useNavigate } from 'react-router-dom';
import { useStateContext } from '../../../state/StateContext';

const Sidebar = () => {
    const { isHidden } = useFsContext(); // Destructure isHidden from the context
    const {hostname}=useStateContext()
    const navigate=useNavigate()
    return (
        <div
            className={`sidebar themebg text-light ${isHidden ? 'd-none' : 'd-block'} shadow`}
            style={{ width: '250px', height: '100vh', padding: '20px',position:'sticky',top:'0' }}
        >
            <h2 className="h4 pb-2 mb-4 slideIn border-bottom">
                <Link to={'/'} className='text-light fw-bold fs-5'>{hostname}</Link> <br />
            <div className='mt-2'>File Manager</div>
            </h2>
            <ul className="list-unstyled">
                <li className="mb-3">
                    <button className="btn text-light w-100 text-start" type="button" onClick={()=>navigate('/fsexplorer')}>
                        Home
                    </button>
                </li>
                <li className="mb-3">
                    <button className="btn text-light w-100 text-start" type="button" onClick={()=>navigate('/fsexplorer/Documents')}>
                        Documents
                    </button>
                </li>
                <li className="mb-3">
                    <button className="btn text-light w-100 text-start" type="button" onClick={()=>navigate('/fsexplorer/Downloads')}>
                        Downloads
                    </button>
                </li>
                <li className="mb-3">
                    <button className="btn text-light w-100 text-start" type="button" onClick={()=>navigate('/fsexplorer/Pictures')}>
                        Pictures
                    </button>
                </li>
                <li className="mb-3">
                    <button className="btn text-light w-100 text-start" type="button" onClick={()=>navigate('/fsexplorer/Videos')}>
                        Videos
                    </button>
                </li>
                <li className="mb-3">
                    <button className="btn text-light w-100 text-start" type="button" onClick={()=>navigate('/fsexplorer/Music')}>
                        Music
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;