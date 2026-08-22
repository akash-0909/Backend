import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { requireAuth } from "../../../src/utils/requireAuth";


function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <nav className="navbar">

            {/* Logo */}
            <div
                className="navbar-logo"
                onClick={() => navigate("/")}
            >
                <span className="navbar-logo-icon">▶</span>
                <span>MyTube</span>
            </div>

            {/* Navigation */}
            <div className="navbar-links">

                <button
                    className="nav-link"
                    onClick={() => navigate("/")}
                >
                    Home
                </button>

                <button
                    className="upload-nav-btn"
                    onClick={() => {
                        if (requireAuth(user)) {
                            navigate("/upload");
                        }
                    }}
                >
                    + Upload
                </button>

            </div>

            {/* Right Side */}
            <div className="navbar-right">

                {user ? (
                    <>
                        <div
                            className="navbar-user"
                            onClick={() =>
                                navigate(`/c/${user.username}`)
                            }
                        >
                            <img
                                src={user.avatar}
                                alt="Profile"
                                className="navbar-avatar"
                            />

                            <span className="navbar-username">
                                {user.username}
                            </span>
                        </div>

                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="nav-login-btn"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>

                        <button
                            className="nav-register-btn"
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </button>
                    </>
                )}

            </div>

        </nav>
    );
}

export default Navbar;