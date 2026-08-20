import { useState } from "react";
import { useNavigate, Link,useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../index.css";
function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/";
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            await login({
                email,
                password
            });

           navigate(from, { replace: true });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">MyTube</div>

                <h1>Welcome back</h1>
                <p className="auth-subtitle">
                    Sign in to continue watching and sharing videos.
                </p>

                <form onSubmit={handleLogin}>
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
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    {error && (
                        <p className="auth-error">{error}</p>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account?{" "}
                    <Link to="/register">Create account</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;