import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("username", username);
      formData.append("email", email);
      formData.append("fullName", fullName);
      formData.append("password", password);

      formData.append("avatar", avatar);
      formData.append("coverImage", coverImage);

      const response = await api.post(
        "/users/register",
        formData
      );

      console.log("REGISTER RESPONSE:", response.data);

      navigate("/login");

      //console.log("REGISTER RESPONSE:", response.data);

    } catch (error) {
      console.log("REGISTER ERROR:", error);
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleRegister}>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <br /><br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <label>Avatar:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
        />

        <br /><br />

        <label>Cover Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverImage(e.target.files[0])}
        />

        <br /><br />

        <button type="submit">
          Register
        </button>

      </form>
    </div>
  );
}

export default Register;