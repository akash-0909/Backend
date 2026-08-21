import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function EditChannel() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState(
        user?.fullName || ""
    );

    const [email, setEmail] = useState(
        user?.email || ""
    );

    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            // 1. Update name and email
            const accountResponse = await api.patch(
                "/users/update-account",
                {
                    fullName,
                    email
                }
            );

            let updatedUser = accountResponse.data.data;

            // 2. Update avatar
            if (avatar) {
                const formData = new FormData();

                formData.append("avatar", avatar);

                const avatarResponse = await api.patch(
                    "/users/avatar",
                    formData
                );

                updatedUser = avatarResponse.data.data;
            }

            // 3. Update cover image
            if (coverImage) {
                const formData = new FormData();

                formData.append("coverImage", coverImage);

                const coverResponse = await api.patch(
                    "/users/cover-image",
                    formData
                );

                updatedUser = coverResponse.data.data;
            }

            setUser(updatedUser);

            navigate(`/c/${user.username}`);

        } catch (error) {
            console.log("UPDATE CHANNEL ERROR:", error);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-channel-page">

            <div className="edit-channel-card">

                <h1>Edit Channel</h1>

                <form onSubmit={handleSubmit}>

                    <label>
                        Full Name
                    </label>

                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) =>
                            setFullName(e.target.value)
                        }
                    />

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <label>
                        Avatar
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setAvatar(e.target.files[0])
                        }
                    />

                    <label>
                        Cover Image
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setCoverImage(e.target.files[0])
                        }
                    />

                    <div className="edit-channel-actions">

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditChannel;