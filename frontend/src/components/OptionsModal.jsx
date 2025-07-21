import './OptionsModal.css'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

export default function OptionsModal({ open, closeModal, handleLogout }) {
    const navigate = useNavigate();
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, closeModal]);

    const handleEditProfile = () => {
        closeModal();
        navigate('/users/edit-profile');
    };

    if (!open) return null;

    return (
        <div className='optionsModalOverlay'>
            <div className='options' ref={modalRef}>
                <div className='settings' onClick={handleEditProfile}>
                    Profile Settings
                </div>
                <div className='logout' onClick={() => {
                    handleLogout();
                    closeModal();
                }}>
                    Log Out
                </div>
            </div>
        </div>
    );
}

