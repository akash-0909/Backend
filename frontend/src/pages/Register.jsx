import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");

    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (!username || !email || !fullName || !password || !avatar) {
            setError("Please fill all required fields");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("username", username);
            formData.append("email", email);
            formData.append("fullName", fullName);
            formData.append("password", password);
            formData.append("avatar", avatar);

            if (coverImage) {
                formData.append("coverImage", coverImage);
            }

            await api.post("/users/register", formData);

            navigate("/login");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card register-card">

                <div className="auth-logo">
                    MyTube
                </div>

                <h1>Create your account</h1>

                <p className="auth-subtitle">
                    Join MyTube and start sharing your videos.
                </p>

                <form onSubmit={handleRegister}>

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <div className="file-section">
                        <label>Profile picture *</label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setAvatar(e.target.files[0])
                            }
                        />
                    </div>

                    <div className="file-section">
                        <label>Cover image</label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setCoverImage(e.target.files[0])
                            }
                        />
                    </div>

                    {error && (
                        <p className="auth-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create Account"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <Link to="/login">
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Register;