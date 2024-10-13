import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./profileUpdatePage.scss";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";



function ProfileUpdatePage() {
  const {currentUser, updateUser} = useContext(AuthContext);

  console.log(currentUser.avatar);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const navigate = useNavigate();

  async function submitHandler(e) {

    e.preventDefault();
    const formData = new FormData(e.target);
    const {username, email, password} = Object.fromEntries(formData);

    try{
      const res = await apiRequest.put(`/users/${currentUser.id}`, {username , email, password, avatar});
      updateUser(res.data)
      setError("");
      navigate("/profile");
    }catch(err){
      console.log(err);
      setError(err.response.data.message);
    }
    
  }
  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={submitHandler}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.uname}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          {error && <span>{error}</span>}
          <button>Update</button>
        </form>
      </div>
      <div className="sideContainer">
        <img src={avatar || "noavatar.jpg"} alt="" className="avatar" />
        <UploadWidget uwConfig={{
          cloudName : "thomas2001",
          uploadPreset:"estate",
          multiple:false,
          maxImageFileSize:2000000,
          folder:"avatars"
        }} setAvatar={setAvatar}/>
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
