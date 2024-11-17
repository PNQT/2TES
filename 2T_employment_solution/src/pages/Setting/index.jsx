import { useState, useEffect, useContext } from "react";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { FaCamera } from "react-icons/fa"; // Import biểu tượng máy ảnh từ react-icons
import styles from "./Setting.module.scss";
import Image from "~/components/Image";
import Button from "~/components/Button";
import { FaSignOutAlt, FaCog } from "react-icons/fa";
import { AppContext } from "~/Context/AppContext";
import axios from "axios";

const cx = classNames.bind(styles);

Modal.setAppElement("#root"); // Thiết lập phần tử gốc cho modal

function Setting() {
  const { user, setUser, token } = useContext(AppContext);

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [passwordModalIsOpen, setPasswordModalIsOpen] = useState(false);
  const [avatarModalIsOpen, setAvatarModalIsOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (!user && token) {
      fetchUserData();
    }
  }, [token, user, setUser]);

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

  const HandleDelete = (e) => {
    e.preventDefault();
    alert("Tài khoản đã được xóa!");
    closePasswordModal();
  };

  const avatarOpenModal = () => {
    setAvatarModalIsOpen(true);
  };

  const avatarCloseModal = () => {
    setAvatarModalIsOpen(false);
    setAvatarPreview(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result); // Update avatar preview
      };
      reader.readAsDataURL(file);
    } else {
      alert("Vui lòng chọn một tệp ảnh!");
    }
  };

  const handleAvatarChange = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("avatar", event.target.avatarInput.files[0]);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const data = response.data;
        setUser((prevUser) => ({ ...prevUser, avatar: data.avatar_url }));
        avatarCloseModal();
        alert("Avatar đã được thay đổi thành công!");
      } else {
        alert("Thay đổi avatar thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi avatar:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');

    // Kiểm tra mật khẩu mới và mật khẩu xác nhận có trùng khớp
    if (newPassword !== newPasswordConfirmation) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      console.log(user)
      console.log(currentPassword)
      console.log(newPassword)
      console.log(newPasswordConfirmation)
      setUser((prevUser) => ({ ...prevUser }));
      const res = await axios.post(
        "http://localhost:8000/api/user/changePassword",
        {
          password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: newPasswordConfirmation,
          user
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    
      
      if (res.status === 200) {
        alert("Password successfully updated!");
        closePasswordModal(); // Đóng modal sau khi thành công
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "An error occurred");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className={cx("setting-container")}>
      <div className={"setting"}>
        <h1>
          <FaCog className={cx("iconSetting")} />
        </h1>
      </div>
      <div className={cx("section")}>
        <div className={cx("avatar-section")}>
          <div className={cx("avatar-container")} onClick={avatarOpenModal}>
            <Image className={cx("profile-avatar")} src={user.avatar} alt="User Avatar" />
            <div className={cx("camera-icon")}>
              <FaCamera />
            </div>
          </div>
          <Button className={cx("change-avatar-button")} onClick={avatarOpenModal}>
            Change Avatar
          </Button>
        </div>
        <div className={cx("sectionRight")}>
          <div className={cx("password-section")}>
            <h2>Change Password:</h2>
            <Button className={cx("change-password-button")} onClick={openPasswordModal}>
              Change Password
            </Button>
          </div>

          <div className={cx("profile-section")}>
            <h2>Change Profile:</h2>
            <Link to="/profile">
              <Button className={cx("change-profile-button")}>Go to Profile</Button>
            </Link>
          </div>
          <div className={cx("deleteAccount")} onClick={openDeleteModal}>
            Xóa tài khoản:
          </div>
        </div>
      </div>
      <Link to="/logout" className={cx("menuItem", "logout")}>
        <FaSignOutAlt className={cx("icon")} />
        Logout
      </Link>

      <Modal
        isOpen={avatarModalIsOpen}
        onRequestClose={avatarCloseModal}
        contentLabel="Thay đổi Avatar"
        className={cx("modalAvatar")}
      >
        <h2>Chọn Avatar Mới</h2>
        <form onSubmit={handleAvatarChange}>
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
            <div style={{ marginTop: "20px" }}>
              <h4>Preview Avatar:</h4>
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                width="300"
                height="300"
                style={{ borderRadius: "50%" }}
              />
            </div>
          )}
          <div className={cx("groupButton")}>
            <Button type="submit" disabled={!avatarPreview}>
              Thay Đổi Avatar
            </Button>
            <Button onClick={avatarCloseModal} outline>
              Đóng
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={passwordModalIsOpen}
        onRequestClose={closePasswordModal}
        contentLabel="Change Password"
        className={cx("modal")}
        overlayClassName={cx("overlay")}
      >
        <h2>Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <div className={cx("form-group")}>
            <label htmlFor="current-password">Current Password</label>
            <input
              type="password"
              id="current-password"
              name="current_password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className={cx("form-group")}>
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              name="new_password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className={cx("form-group")}>
            <label htmlFor="confirm-password">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm_password"
              required
              value={newPasswordConfirmation}
              onChange={(e) => setNewPasswordConfirmation(e.target.value)}
            />
          </div>
          <Button type="submit">Save</Button>
          <Button type="button" onClick={closePasswordModal}>
            Cancel
          </Button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </Modal>

      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Account"
        className={cx("modal")}
        overlayClassName={cx("overlay")}
      >
        <h2>Delete Account</h2>
        <form onSubmit={HandleDelete}>
          <div className={cx("form-group")}>
            <label htmlFor="delete-password">Enter Password to Confirm</label>
            <input type="password" id="delete-password" name="delete-password" required />
          </div>
          <Button type="submit">Delete</Button>
          <Button type="button" onClick={closeDeleteModal}>
            Cancel
          </Button>
        </form>
      </Modal>
    </div>
  );
}

export default Setting;
