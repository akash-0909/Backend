import { useState } from "react";
import api from "../api/axios";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await api.post("/users/login", {
                email,
                password
            });

            console.log(response.data);

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h1>Login</h1>

            <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>
                Login
            </button>
        </div>
    );
}

export default Login;