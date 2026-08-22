import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function EditVideo() {
    const { videoId } = useParams();
    const navigate = useNavigate();

    const [video, setVideo] = useState(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [thumbnail, setThumbnail] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const getVideo = async () => {
            try {
                const response = await api.get(
                    `/videos/${videoId}`
                );

                const videoData = response.data.data;

                setVideo(videoData);
                setTitle(videoData.title || "");
                setDescription(videoData.description || "");

            } catch (error) {
                console.log("GET VIDEO ERROR:", error);
            } finally {
                setLoading(false);
            }
        };

        getVideo();
    }, [videoId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const formData = new FormData();

            formData.append("title", title);
            formData.append("description", description);

            if (thumbnail) {
                formData.append("thumbnail", thumbnail);
            }

            const response = await api.patch(
                `/videos/${videoId}`,
                formData
            );

            console.log("UPDATED VIDEO:", response.data);

            navigate(-1);

        } catch (error) {
            console.log("UPDATE VIDEO ERROR:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="edit-video-page">
                <p>Loading video...</p>
            </div>
        );
    }

    if (!video) {
        return (
            <div className="edit-video-page">
                <h2>Video not found</h2>
            </div>
        );
    }

    return (
        <main className="edit-video-page">

            <div className="edit-video-card">

                <h1>Edit Video</h1>

                <form onSubmit={handleSubmit}>

                    <label>
                        Title
                    </label>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                    />

                    <label>
                        Description
                    </label>

                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        rows="6"
                    />

                    <label>
                        Thumbnail
                    </label>

                    <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="edit-video-thumbnail"
                    />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setThumbnail(e.target.files[0])
                        }
                    />

                    <div className="edit-video-actions">

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>

                </form>

            </div>

        </main>
    );
}

export default EditVideo;