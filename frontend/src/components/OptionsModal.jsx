import './OptionsModal.css'
import { useNavigate } from 'react-router-dom'

export default function OptionsModal({ open, closeModal, handleLogout }) {
    const navigate = useNavigate()

    const handleEditProfile = () => {
        closeModal()
        navigate('/users/edit-profile')
    }

    if (!open) return null;

    return (
        <div className='optionsModalOverlay'>
            <div className='options'>
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
    )
}
