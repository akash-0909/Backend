import { useNavigate } from "react-router-dom";

function LoginRequiredModal({
    show,
    onClose,
    action = "continue"
}) {
    const navigate = useNavigate();

    if (!show) return null;

    const handleLogin = () => {
        onClose();
        navigate("/login", {
            state: {
                from: window.location.pathname
            }
        });
    };

    return (
        <div
            className="login-modal-overlay"
            onClick={onClose}
        >
            <div
                className="login-modal"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Icon */}

                <div className="login-modal-icon">
                    🔐
                </div>


                {/* Content */}

                <h2>
                    Login required
                </h2>

                <p>
                    Please login to {action}.
                    <br />
                    It only takes a few seconds.
                </p>


                {/* Buttons */}

                <div className="login-modal-actions">

                    <button
                        className="modal-cancel"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="modal-login"
                        onClick={handleLogin}
                    >
                        Login
                    </button>

                </div>

            </div>
        </div>
    );
}

export default LoginRequiredModal;