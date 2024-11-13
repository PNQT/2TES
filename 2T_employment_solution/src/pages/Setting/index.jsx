import { useState } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { FaCamera } from 'react-icons/fa'; // Import biểu tượng máy ảnh từ react-icons
import styles from './Setting.module.scss';
import Image from '~/components/Image';
import Button from '~/components/Button';
import { FaSignOutAlt, FaCog } from 'react-icons/fa';

const cx = classNames.bind(styles);

Modal.setAppElement('#root'); // Thiết lập phần tử gốc cho modal

function Setting() { 
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [avatarModalIsOpen, setAvatarModalIsOpen] = useState(false);
  const [passwordModalIsOpen, setPasswordModalIsOpen] = useState(false);
  const [avatar, setAvatar] = useState("https://via.placeholder.com/150"); 
  const [newAvatar, setNewAvatar] = useState(null);

  const openAvatarModal = () => {
    setAvatarModalIsOpen(true);
  };

  // Đóng modal
  const closeAvatarModal = () => {
    setAvatarModalIsOpen(false);
    setNewAvatar(null); 
  };

  const openPasswordModal = () => {
    setPasswordModalIsOpen(true);
  };

  const closePasswordModal = () => {
    setPasswordModalIsOpen(false);
  };

  const openDeleteModal = () => {
    setDeleteModalIsOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Vui lòng chọn một tệp ảnh!');
    }
  };

  const HandleDelete = (e) =>{
    e.preventDefault();
    alert('Tài khoản đã được xóa!');
    closePasswordModal();

  }

  

  // Lưu avatar mới
  const handleSaveAvatar = () => {
    if (newAvatar) {
      setAvatar(newAvatar); 
    }
    closeAvatarModal(); 
  };

  // Xử lý thay đổi mật khẩu
  const handleChangePassword = (event) => {
    event.preventDefault();   
    alert('Mật khẩu đã được thay đổi!');
    closePasswordModal(); 
  };

  return (  
    <div className={cx('setting-container')}>
     <div className={'setting'}>
        
        <h1 ><FaCog className={cx('iconSetting')}/></h1>
     </div>
     <div className={cx('section')}>
        <div className={cx('avatar-section')}>
          <div className={cx('avatar-container')} onClick={openAvatarModal}>
            <Image
              className={cx('profile-avatar')}
              src={avatar} // Sử dụng avatar mới hoặc cũ
              alt="User Avatar"
            />
            <div className={cx('camera-icon')}>
              <FaCamera />
            </div>
          </div>
          <Button className={cx('change-avatar-button')} onClick={openAvatarModal}>Change Avatar</Button>
        </div>
        <div className={cx('sectionRight')}>
          <div className={cx('password-section')}>
            <h2>Change Password:</h2>
            <Button className={cx('change-password-button')} onClick={openPasswordModal}>Change Password</Button>
          </div>
    
          <div className={cx('profile-section')}>
            <h2>Change Profile:</h2>
            <Link to="/profile">
              <Button className={cx('change-profile-button')}>Go to Profile</Button>
            </Link>
          </div>
        <div className={cx("deleteAccount") }  onClick={openDeleteModal}>Xóa tài khoản:</div>
        </div>
     </div>
      <Link to="/logout" className={cx('menuItem', 'logout')}>
            <FaSignOutAlt className={cx('icon')} />
            Logout
      </Link>

      <Modal
        isOpen={avatarModalIsOpen}
        onRequestClose={closeAvatarModal}
        contentLabel="Change Avatar"
        className={cx('modal')}
        overlayClassName={cx('overlay')}
      >
        <h2>Change Avatar</h2>
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
        {newAvatar && <img src={newAvatar} alt="New Avatar" className={cx('new-avatar-preview')} />}
        <Button onClick={handleSaveAvatar}>Save</Button>
        <Button onClick={closeAvatarModal}>Cancel</Button>
      </Modal>

      <Modal
        isOpen={passwordModalIsOpen}
        onRequestClose={closePasswordModal}
        contentLabel="Change Password"
        className={cx('modal')}
        overlayClassName={cx('overlay')}
      >
        <h2>Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <div className={cx('form-group')}>
            <label htmlFor="current-password">Current Password</label>
            <input type="password" id="current-password" name="current-password" required />
          </div>
          <div className={cx('form-group')}>
            <label htmlFor="new-password">New Password</label>
            <input type="password" id="new-password" name="new-password" required />
          </div>
          <div className={cx('form-group')}>
            <label htmlFor="confirm-password">Confirm New Password</label>
            <input type="password" id="confirm-password" name="confirm-password" required />
          </div>
          <Button type="submit">Save</Button>
          <Button type="button" onClick={closePasswordModal}>Cancel</Button>
        </form>
      </Modal>

      
      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Account"
        className={cx('modal')}
        overlayClassName={cx('overlay')}
      >
        <h2>Delete Account</h2>
        <form onSubmit={HandleDelete}>
          <div className={cx('form-group')}>
            <label htmlFor="delete-password">Enter Password to Confirm</label>
            <input
              type="password"
              id="delete-password"
              name="delete-password"

              required
            />
          </div>
          <Button type="submit">Delete</Button>
          <Button type="button" onClick={closeDeleteModal}>Cancel</Button>
        </form>
      </Modal>
    </div>
  );
}

export default Setting;