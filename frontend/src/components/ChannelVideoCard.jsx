import { Link } from "react-router-dom";
import api from "../api/axios";
import { useState } from "react";
function ChannelVideoCard({ video, onDelete }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const handleDelete = async () => {
        try {
            setDeleting(true);

            await api.delete(`/videos/${video._id}`);

            onDelete(video._id);

            setShowDeleteModal(false);

        } catch (error) {
            console.log("DELETE VIDEO ERROR:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete video"
            );

        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="channel-video-card">

            <Link
                to={`/watch/${video._id}`}
                className="channel-video-link"
            >

                <div className="channel-video-thumbnail">

                    <img
                        src={video.thumbnail}
                        alt={video.title}
                    />

                </div>

                <div className="channel-video-info">

                    <h3>{video.title}</h3>

                    <p>
                        {video.views} views
                    </p>

                </div>

            </Link>

            <div className="channel-video-actions">

                <button>
                    ✏️ Edit
                </button>

                <button onClick={() => setShowDeleteModal(true)}>
                    🗑️ Delete
                </button>

            </div>
            {showDeleteModal && (
                <div className="delete-modal-overlay">

                    <div className="delete-modal">

                        <div className="delete-modal-icon">
                            ⚠️
                        </div>

                        <h2>Delete this video?</h2>

                        <p>
                            This action cannot be undone.
                            Your video will be permanently deleted.
                        </p>

                        <div className="delete-modal-actions">

                            <button
                                className="delete-cancel-btn"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                            >
                                Cancel
                            </button>

                            <button
                                className="delete-confirm-btn"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </div>
    );
}

export default ChannelVideoCard;