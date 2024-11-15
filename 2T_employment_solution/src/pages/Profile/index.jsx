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

const cx = classNames.bind(styles);

Modal.setAppElement("#root"); 

function Profile() {
  const { user, setUser, token } = useContext(AppContext); 
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [avatarModalIsOpen, setAvatarModalIsOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

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
        setAvatarPreview(reader.result); // Update avatar preview
      };
      reader.readAsDataURL(file);
    } else {
      alert("Vui lòng chọn một tệp ảnh!");
    }
  };

  // Handle submitting the avatar change
  const handleAvatarChange = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append("avatar", event.target.avatarInput.files[0]);
  
    try {
      const response = await axios.post("http://localhost:8000/api/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
          "Content-Type": "multipart/form-data", // Đảm bảo gửi dưới dạng form-data
        },
      });
  
      if (response.status === 200) {
        const data = response.data;
        setUser((prevUser) => ({ ...prevUser, avatar: data.avatar_url })); // Cập nhật URL avatar mới
        avatarCloseModal();
        alert("Avatar đã được thay đổi thành công!");
      } else {
        alert("Thay đổi avatar thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi avatar:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    }

  }



  return (
    <div className={cx("profile-container")}>
      <div className={cx("profile-header")}>
        <div className={cx("avatar-container")} onClick={avatarOpenModal}>
          <Image
            className={cx("profile-avatar")}
            src={user.avatar}
            alt="User Avatar"
            onError={(e) => (e.target.src = images.dafaultAvatar)}
          />
          <div className={cx("camera-icon")}>
            <FaCamera />
          </div>
        </div>
        <h1 className={cx("profile-name")}>{user.name || "null"}</h1>
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
        <form>
          <div className={cx("form-group")}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={user?.name || "null"}
            />
          </div>
          <div className={cx("form-group")}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={user?.email || "null"}
            />
          </div>
          <div className={cx("form-group")}>
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              defaultValue={user?.phone || "null"}
            />
          </div>
          <div className={cx("form-group")}>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              defaultValue={user?.address || "null"}
            />
          </div>
          <div className={cx("form-group")}>
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              defaultValue={
                user?.bio || "null"
              }
            ></textarea>
          </div>
          <Button type="submit">Save</Button>
          <Button type="button" onClick={closeModal}>
            Cancel
          </Button>
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
            <Button type="submit" disabled={!avatarPreview}>
              Thay Đổi Avatar
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
