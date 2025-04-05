import React, { useState } from 'react';
import { useFsContext } from '../../../state/FsContext';
import { FaBars, FaUpload } from 'react-icons/fa6';
import { BiLeftArrowCircle, BiSelectMultiple } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import api from '../../../../axios/api';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import { useStateContext } from '../../../state/StateContext';

const Header = () => {
    const { setIsHidden } = useFsContext();
    const {hostname}=useStateContext()
    const navigate = useNavigate()
    const [uProgres, setProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [files,setFiles] = useState([])

    const uploadFiles = async () => {
        if (files.length > 0) {
            setIsUploading(true)
            const formData = new FormData();
            for (const file of files) {
                formData.append('files', file);
              }
              formData.append('dir', location.pathname.replace('/fsexplorer', ''));
              
            try {
                const res = await api.post('/fs/upload', formData,{
                    onUploadProgress: (progressEvent) => {
                        const { loaded, total } = progressEvent;
                        const percent = Math.floor((loaded * 100) / total);
                        setProgress(percent);
                    },
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                toast.success(res.data)
                setFiles([])
            } catch (err) {
                toast.error(`ERROR: ${err}`)
            } finally {
                setIsUploading(false)
            }
        }
    }


    return (
        <>
        <nav className="navbar flex-column navbar-expand-lg mb-0 navbar-dark themebg ani slideIn shadow-sm" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <div className="container-fluid">
                <div className={`w-100 d-flex ${false ? 'd-none' : ''}`} id="navbarNav"> 
                    <a className="nav-link my-auto fs-3 border-end px-2 pe-3" onClick={()=>navigate(-1)}>
                        <BiLeftArrowCircle className='icon'/> 
                    </a>
                        <a className="nav-link my-auto ms-2 p-2" style={{
                            cursor:'pointer'
                        }} onClick={() => {
                            if (!files.length) {
                                document.getElementById('filer').click()
                            } else {
                                confirm(`Press "Okay" to upload ${files.length} files to ${hostname}'s computer!`) ? uploadFiles()
                                    :toast('Operation requires user permission which has been denied')
                            }
                    }}>
                            <FaUpload className='icon' /> Upload {files.length ? files.length + ' files' : ''}
                            {files?.length ? <span title='Change selection' onClick={(e) => {
                                e.stopPropagation()
                                document.getElementById('filer').click()
                            }} className='rounded ms-2'><BiSelectMultiple className='icon fs-4'/></span>:''}
                            {files?.length ? <span title='Cancel Selection' onClick={(e) => {
                                e.stopPropagation()
                                confirm('Do you want to Unselect all selected Files?')&&setFiles([])
                            }} className=' rounded fs-5 ms-2'><FaTimes className='icon'/></span>:''}
                    </a>
                    <input type="file" name="files" id="filer" multiple style={{ opacity: '0', width:'0px', height:'0px' }} 
                    onChange={({ target }) => setFiles(target.files)} 
                    />
                    <div className="d-flex ms-auto">
                        <button className="btn btn-outline-light" type="submit" onClick={() => setIsHidden(prev=>!prev)}>
                            <FaBars className='icon'/>
                        </button>
                    </div>
                </div>
            </div>
            </nav>
           {isUploading&& <progress className='w-100 mt-0' style={{
                position: 'relative',
                bottom:'5px'
            }} value={uProgres} max={100}></progress>}
        </>
    );
};

export default Header;