import { useState, useEffect, useContext } from "react";
import axios from "axios";
import classNames from "classnames/bind";
import Modal from "react-modal";
import { FaCamera } from "react-icons/fa";
import styles from "./Profile.module.scss";
import Image from "~/components/Image";
import Button from "~/components/Button";
import { AppContext } from "~/Context/AppContext";
import images from "~/assets/images";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

Modal.setAppElement("#root");

function Profile() {
  const { user, setUser, token } = useContext(AppContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [avatarModalIsOpen, setAvatarModalIsOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert("You need to log in to access this page!");
      navigate("/login");
    }
  }, [token]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
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
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select an image file!");
    }
  };

  // Handle submitting the avatar change
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
        alert("The avatar has been successfully changed!");
      } else {
        alert("Avatar change failed!");
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi avatar:", error);
      alert("An error occurred. Please try again");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleChangeInfo = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    const formData = new FormData();
    formData.append("user_name", e.target.user_name.value);
    formData.append("phone", e.target.phone.value);
    formData.append("address", e.target.address.value);
    formData.append("bio", e.target.bio.value);

    try {
      const res = await axios.post("http://localhost:8000/api/user/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        const data = res.data;
        setUser((prevUser) => ({
          ...prevUser,
          user_name: data.user.user_name,
          phone: data.user.phone,
          address: data.user.address,
          bio: data.user.bio,
        }));
        closeModal();
      } else {
        alert("Information update failed");
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi thông tin:", error);
      alert("An error occurred. Please try again");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className={cx("profile-container")}>
      <div className={cx("profile-header")}>
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
        <h1 className={cx("profile-name")}>{user?.user_name || "null"}</h1>
        <Button className={cx("edit-profile-button")} onClick={openModal}>
          Edit Profile
        </Button>
      </div>
      <div className={cx("profile-details")}>
        <div className={cx("profile-detail")}>
          <h2>Email</h2>
          <p>{user?.email || "No email provided"}</p>
        </div>
        <div className={cx("profile-detail")}>
          <h2>Phone</h2>
          <p>{user?.phone || "null"}</p>
        </div>
        <div className={cx("profile-detail")}>
          <h2>Address</h2>
          <p>{user?.address || "null"}</p>
        </div>
        <div className={cx("profile-detail")}>
          <h2>Bio</h2>
          <p>{user?.bio || "null"}</p>
        </div>
      </div>
      <Button className={cx("back-button")} onClick={() => window.history.back()}>
        Quay lại
      </Button>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Profile"
        className={cx("modal")}
        overlayClassName={cx("overlay")}
      >
        <h2>Edit Profile</h2>
        <form onSubmit={handleChangeInfo}>
          <div className={cx("form-group")}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="user_name"
              defaultValue={user?.user_name || ""}
              placeholder="Enter your name"
            />
          </div>

          <div className={cx("form-group")}>
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              defaultValue={user?.phone || ""}
              placeholder="Enter your phone number"
            />
          </div>
          <div className={cx("form-group")}>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              defaultValue={user?.address || ""}
              placeholder="Enter your address"
            />
          </div>
          <div className={cx("form-group")}>
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              defaultValue={user?.bio || ""}
              placeholder="Write a short bio about yourself"
            ></textarea>
          </div>
          <div className={cx("form-actions")}>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
            <Button type="button" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Avatar Change Modal */}
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
            <Button type="submit" disabled={!avatarPreview || isLoading}>
              {isLoading ? "Uploading..." : "Thay Đổi Avatar"}
            </Button>
            <Button onClick={avatarCloseModal} outline>
              Đóng
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Profile;
