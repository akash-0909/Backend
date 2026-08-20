import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Upload() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);

    const [videoPreview, setVideoPreview] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleVideoChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setThumbnail(file);
        setThumbnailPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!title.trim()) {
            setError("Please enter a video title");
            return;
        }

        if (!description.trim()) {
            setError("Please enter a description");
            return;
        }

        if (!videoFile) {
            setError("Please select a video");
            return;
        }

        if (!thumbnail) {
            setError("Please select a thumbnail");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("title", title);
            formData.append("description", description);
            formData.append("videoFile", videoFile);
            formData.append("thumbnail", thumbnail);

            await api.post("/videos", formData);

            setSuccess("Video published successfully!");

            setTitle("");
            setDescription("");
            setVideoFile(null);
            setThumbnail(null);
            setVideoPreview("");
            setThumbnailPreview("");

            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (error) {
            console.log("UPLOAD ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Something went wrong while uploading the video"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-page">

            <div className="upload-container">

                {/* Header */}

                <div className="upload-header">
                    <button
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        ←
                    </button>

                    <div>
                        <h1>Upload Video</h1>
                        <p>
                            Share your content with the MyTube community
                        </p>
                    </div>
                </div>


                <form
                    className="upload-form"
                    onSubmit={handleSubmit}
                >

                    {/* Video Section */}

                    <div className="upload-section">

                        <h2>Video</h2>

                        <label
                            htmlFor="video-upload"
                            className={`upload-dropzone ${
                                videoFile ? "has-file" : ""
                            }`}
                        >

                            {videoPreview ? (
                                <video
                                    src={videoPreview}
                                    className="video-preview"
                                    controls
                                />
                            ) : (
                                <>
                                    <div className="upload-icon">
                                        ↑
                                    </div>

                                    <h3>
                                        Select your video
                                    </h3>

                                    <p>
                                        MP4, WebM or MOV
                                    </p>

                                    <span className="browse-button">
                                        Browse video
                                    </span>
                                </>
                            )}

                            <input
                                id="video-upload"
                                type="file"
                                accept="video/*"
                                onChange={handleVideoChange}
                            />

                        </label>

                        {videoFile && (
                            <p className="selected-file">
                                ✓ {videoFile.name}
                            </p>
                        )}

                    </div>


                    {/* Thumbnail Section */}

                    <div className="upload-section">

                        <h2>Thumbnail</h2>

                        <label
                            htmlFor="thumbnail-upload"
                            className={`thumbnail-dropzone ${
                                thumbnail ? "has-file" : ""
                            }`}
                        >

                            {thumbnailPreview ? (
                                <img
                                    src={thumbnailPreview}
                                    alt="Thumbnail preview"
                                    className="thumbnail-preview"
                                />
                            ) : (
                                <>
                                    <div className="upload-icon">
                                        🖼
                                    </div>

                                    <h3>
                                        Choose a thumbnail
                                    </h3>

                                    <p>
                                        JPG, PNG or WEBP
                                    </p>

                                    <span className="browse-button">
                                        Browse image
                                    </span>
                                </>
                            )}

                            <input
                                id="thumbnail-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                            />

                        </label>

                        {thumbnail && (
                            <p className="selected-file">
                                ✓ {thumbnail.name}
                            </p>
                        )}

                    </div>


                    {/* Details */}

                    <div className="upload-section">

                        <h2>Details</h2>

                        <div className="form-group">

                            <label>
                                Title
                            </label>

                            <input
                                type="text"
                                placeholder="Give your video a title"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                maxLength={100}
                            />

                            <span className="character-count">
                                {title.length}/100
                            </span>

                        </div>


                        <div className="form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                placeholder="Tell viewers about your video..."
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                maxLength={5000}
                                rows={6}
                            />

                            <span className="character-count">
                                {description.length}/5000
                            </span>

                        </div>

                    </div>


                    {/* Messages */}

                    {error && (
                        <div className="upload-message error-message">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="upload-message success-message">
                            {success}
                        </div>
                    )}


                    {/* Submit */}

                    <div className="upload-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="publish-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Publishing..."
                                : "Publish Video"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default Upload;