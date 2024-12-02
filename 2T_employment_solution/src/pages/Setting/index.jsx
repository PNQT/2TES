import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { FaCamera, FaSignOutAlt, FaCog } from "react-icons/fa";
import styles from "./Setting.module.scss";
import Image from "~/components/Image";
import Button from "~/components/Button";
import { AppContext } from "~/Context/AppContext";
import axios from "axios";
import images from "~/assets/images";


const cx = classNames.bind(styles);

Modal.setAppElement("#root");

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
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  async function handleLogout(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      if (res.status === 200) {
        setUser(null);
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      // Optionally display an error message to the user
    }
  }

  useEffect(() => {
    if (!token) {
      alert("Bạn cần đăng nhập để truy cập trang này!");
      navigate("/login");
    }
  }, [token]);

  const openPasswordModal = () => setPasswordModalIsOpen(true);
  const closePasswordModal = () => setPasswordModalIsOpen(false);
  const openDeleteModal = () => setDeleteModalIsOpen(true);
  const closeDeleteModal = () => setDeleteModalIsOpen(false);

  const avatarOpenModal = () => setAvatarModalIsOpen(true);
  const avatarCloseModal = () => {
    setAvatarModalIsOpen(false);
    setAvatarPreview(null);
  };

  const HandleDelete = async () => {
    try {
      const res = await axios.delete("http://localhost:8000/api/account/delete", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,  
        },
      });
  
      if (res.status === 200) {
        alert("Tài khoản đã được xóa thành công!");
        setUser(null); 
        localStorage.removeItem("token");
        navigate("/"); 
      }
    } catch (error) {
      console.error("Delete failed:", error.response?.data || error.message);
      alert("Xóa tài khoản thất bại. Vui lòng thử lại.");
    }
  };
  

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert("Vui lòng chọn một tệp ảnh!");
    }
  };

  const handleAvatarChange = async (event) => {
    event.preventDefault();
    setIsLoading(true);

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
    } finally {
      setIsLoading(false); 
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== newPasswordConfirmation) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }
    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/user/changePassword",
        {
          password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: newPasswordConfirmation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (res.status === 200) {
        alert("Mật khẩu đã được thay đổi thành công!");
        closePasswordModal(); 
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Có lỗi xảy ra.");
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className={cx("setting-container")}>
      <div className={cx("setting-header")}>
        <h1>
          <FaCog className={cx("iconSetting")} />
          Settings
        </h1>
      </div>
      <div className={cx("setting-body")}>
        <div className={cx("avatar-section")}>
          <div className={cx("avatar-container")} onClick={avatarOpenModal}>
          {user ? (
            <Image
              className={cx("profile-avatar")}
              src={user.avatar || images.dafaultAvatar}
              alt="User Avatar"
              onError={(e) => (e.target.src = images.dafaultAvatar)}
            />
          ) : (
            <Image
              className={cx("profile-avatar")}
              src={images.dafaultAvatar}
              alt="Default Avatar"
            />
          )}
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
      <Link to="/logout" className={cx("menuItem", "logout")} onClick={handleLogout}>
        <FaSignOutAlt className={cx("icon")} />
        Logout
      </Link>

      {/* Avatar Change Modal */}
      <Modal isOpen={avatarModalIsOpen} onRequestClose={avatarCloseModal} className={cx("modalAvatar")}>
        <h2>Chọn Avatar Mới</h2>
        <form onSubmit={handleAvatarChange}>
          <div>
            <label htmlFor="avatarInput">Chọn ảnh avatar:</label>
            <input type="file" id="avatarInput" accept="image/*" onChange={handleFileChange} />
          </div>
          {avatarPreview && (
            <div className={cx("avatar-preview")}>
              <h4>Preview Avatar:</h4>
              <img src={avatarPreview} alt="Avatar Preview" width="300" height="300" style={{ borderRadius: "50%" }} />
            </div>
          )}
          <div className={cx("groupButton")}>
            <Button type="submit" disabled={!avatarPreview || isLoading}>
              {isLoading ? "Uploading..." : "Change Avatar"}
            </Button>
            <Button onClick={avatarCloseModal} outline>
              Close
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal isOpen={passwordModalIsOpen} onRequestClose={closePasswordModal} className={cx("modal")}>
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" onClick={closePasswordModal}>
            Cancel
          </Button>
          {error && <p className={cx("error-message")}>{error}</p>}
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
