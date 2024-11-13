import { useState } from 'react';
import classNames from 'classnames/bind';
import Modal from 'react-modal';
import { FaCamera } from 'react-icons/fa'; // Import biểu tượng máy ảnh từ react-icons
import styles from './Profile.module.scss';
import Image from '~/components/Image';
import Button from '~/components/Button';

const cx = classNames.bind(styles);


Modal.setAppElement('#root'); // Thiết lập phần tử gốc cho modal

function Profile() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [avatarModalIsOpen, setAvatarModalIsOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const avatarOpenModal = () => {
    setAvatarModalIsOpen(true);
  }

 
  const avatarCloseModal = () => {
    setAvatarModalIsOpen(false);
    setAvatarPreview(null); // Reset preview khi đóng modal
  };

  // Xử lý thay đổi ảnh (cập nhật avatar preview)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result); // Cập nhật preview
      };
      reader.readAsDataURL(file);
    } else {
      alert('Vui lòng chọn một tệp ảnh!');
    }
  };

  // Xử lý gửi ảnh (hoặc thay đổi avatar)
  const handleSubmit = (event) => {
    event.preventDefault();
    // Gửi ảnh lên server hoặc xử lý logic thay đổi avatar ở đây
    alert('Avatar đã được thay đổi!');
    avatarCloseModal(); // Đóng modal sau khi gửi
  };
  return (
    <div className={cx('profile-container')}>
      <div className={cx('profile-header')}>
        <div className={cx('avatar-container')}
         onClick={avatarOpenModal}
        >
          <Image
            className={cx('profile-avatar')}
            src="https://via.placeholder.com/150"
            alt="User Avatar"
          />
          <div className={cx('camera-icon')}>
            <FaCamera />
          </div>
        </div>
        <h1 className={cx('profile-name')}>John Doe</h1>
        <Button className={cx('edit-profile-button')} onClick={openModal}>Edit Profile</Button>
      </div>
      <div className={cx('profile-details')}>
        <div className={cx('profile-detail')}>
          <h2>Email</h2>
          <p>john.doe@example.com</p>
        </div>
        <div className={cx('profile-detail')}>
          <h2>Phone</h2>
          <p>(123) 456-7890</p>
        </div>
        <div className={cx('profile-detail')}>
          <h2>Address</h2>
          <p>123 Main St, Anytown, USA</p>
        </div>
        <div className={cx('profile-detail')}>
          <h2>Bio</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non urna vitae odio sagittis bibendum.</p>
        </div>
      </div>
      <Button className={cx('back-button')} onClick={() => window.history.back()}>Quay lại</Button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Profile"
        className={cx('modal')}
        overlayClassName={cx('overlay')}
      >
        <h2>Edit Profile</h2>
        <form>
          <div className={cx('form-group')}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" defaultValue="John Doe" />
          </div>
          <div className={cx('form-group')}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" defaultValue="john.doe@example.com" />
          </div>
          <div className={cx('form-group')}>
            <label htmlFor="phone">Phone</label>
            <input type="tel" id="phone" name="phone" defaultValue="(123) 456-7890" />
          </div>
          <div className={cx('form-group')}>
            <label htmlFor="address">Address</label>
            <input type="text" id="address" name="address" defaultValue="123 Main St, Anytown, USA" />
          </div>
          <div className={cx('form-group')}>
            <label htmlFor="bio">Bio</label>
            <textarea id="bio" name="bio" defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non urna vitae odio sagittis bibendum."></textarea>
          </div>
          <Button type="submit">Save</Button>
          <Button type="button" onClick={closeModal}>Cancel</Button>
        </form>
      </Modal>

      <Modal
        isOpen={avatarModalIsOpen}
        onRequestClose={avatarCloseModal}
        contentLabel="Thay đổi Avatar"
        className={cx('modalAvatar')}
      >
        <h2>Chọn Avatar Mới</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="avatarInput">Chọn ảnh avatar:</label>
            <input
              type="file"
              id="avatarInput"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          {avatarPreview && (
            <div style={{ marginTop: '20px' }}>
              <h4>Preview Avatar:</h4>
              <img
                src={avatarPreview}
                alt="Avatar Preview"    
                width="300"
                height="300"
                style={{ borderRadius: '50%' }}
              />
            </div>
          )}
          
        </form>
       <div className={cx("groupButton")}>
          <Button type="submit" disabled={!avatarPreview}>
              Thay Đổi Avatar
            </Button>
          <Button onClick={avatarCloseModal} outline >Đóng</Button>
       </div>
      </Modal>
    </div>
  );
}

export default Profile;