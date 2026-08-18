import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function Navbar() {
    const { user, setUser } = useAuth();
    console.log("NAVBAR USER:", user);
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await api.post("/users/logout");

            setUser(null);
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <nav>
            <h2 onClick={() => navigate("/")}>
                MyTube
            </h2>

            {user ? (
                <div>
                    <span>
                        {user.username}
                    </span>

                    <img
                        src={user.avatar}
                        alt="avatar"
                        width="40"
                    />

                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            ) : (
                <div>
                    <button onClick={() => navigate("/login")}>
                        Login
                    </button>

                    <button onClick={() => navigate("/register")}>
                        Register
                    </button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;