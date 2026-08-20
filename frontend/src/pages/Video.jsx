import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { requireAuth } from "../../../src/utils/requireAuth";
import { useAuth } from "../context/AuthContext";
import LoginRequiredModal from "../components/LoginRequiredModal";
import Comments from "../components/Comments";
function Video() {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(true);

    const videoRef = useRef(null);
    const hideTimer = useRef(null);
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    const { user } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [subscriberCount, setSubscriberCount] = useState(0);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribeLoading, setSubscribeLoading] = useState(false);

    useEffect(() => {
        const getSubscriptionInfo = async () => {
            if (!video?.owner?._id) return;

            try {
                const [countResponse, statusResponse] =
                    await Promise.all([
                        api.get(
                            `/subscriptions/c/${video.owner._id}/count`
                        ),
                        api.get(
                            `/subscriptions/c/${video.owner._id}/status`
                        )
                    ]);

                setSubscriberCount(
                    countResponse.data.data.subscriberCount
                );

                setIsSubscribed(
                    statusResponse.data.data.isSubscribed
                );

            } catch (error) {
                console.log(
                    "SUBSCRIPTION INFO ERROR:",
                    error
                );
            }
        };

        getSubscriptionInfo();

    }, [video]);
    const handleSubscribe = async () => {

        if (!user) {
            setShowLoginModal(true);
            return;
        }

        if (!video?.owner?._id) return;

        if (subscribeLoading) return;

        try {

            setSubscribeLoading(true);

            await api.post(
                `/subscriptions/c/${video.owner._id}`
            );

            setIsSubscribed((prev) => !prev);

            setSubscriberCount((prev) =>
                isSubscribed
                    ? prev - 1
                    : prev + 1
            );

        } catch (error) {

            console.log(
                "SUBSCRIBE ERROR:",
                error
            );

        } finally {

            setSubscribeLoading(false);

        }
    };
    useEffect(() => {
        const getLikeInfo = async () => {
            try {
                const [countResponse, statusResponse] =
                    await Promise.all([
                        api.get(`/likes/video/${videoId}`),
                        api.get(`/likes/video/${videoId}/status`)
                    ]);

                setLikeCount(
                    countResponse.data.data.likeCount
                );

                setIsLiked(
                    statusResponse.data.data.isLiked
                );

            } catch (error) {
                console.log("LIKE INFO ERROR:", error);
            }
        };

        getLikeInfo();

    }, [videoId]);
    const handleLike = async () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }

        if (likeLoading) return;

        try {
            setLikeLoading(true);

            const response = await api.post(
                `/likes/toggle/video/${videoId}`
            );

            console.log("LIKE:", response.data);

            setIsLiked((prev) => !prev);

            setLikeCount((prev) =>
                isLiked ? prev - 1 : prev + 1
            );

        } catch (error) {
            console.log("LIKE ERROR:", error);
        } finally {
            setLikeLoading(false);
        }
    };
    const handlePlayPause = () => {
        const video = videoRef.current;

        if (!video) return;

        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }

        showVideoControls();
    };


    const showVideoControls = () => {
        setShowControls(true);

        if (hideTimer.current) {
            clearTimeout(hideTimer.current);
        }

        hideTimer.current = setTimeout(() => {
            if (videoRef.current && !videoRef.current.paused) {
                setShowControls(false);
            }
        }, 2000);
    };


    const handleVideoPlay = () => {
        setIsPlaying(true);
        showVideoControls();
    };


    const handleVideoPause = () => {
        setIsPlaying(false);
        setShowControls(true);

        if (hideTimer.current) {
            clearTimeout(hideTimer.current);
        }
    };
    useEffect(() => {
        const getVideo = async () => {
            try {
                setLoading(true);

                const response = await api.get(
                    `/videos/${videoId}`
                );

                setVideo(response.data.data);

            } catch (error) {
                console.log("VIDEO ERROR:", error);
                setError("Unable to load this video");
            } finally {
                setLoading(false);
            }
        };

        getVideo();
    }, [videoId]);


    if (loading) {
        return (
            <div className="watch-loading">
                <div className="loader"></div>
                <p>Loading video...</p>
            </div>
        );
    }


    if (error || !video) {
        return (
            <div className="watch-error">
                <h2>Video not found</h2>
                <p>{error}</p>

                <button onClick={() => navigate("/")}>
                    Back to Home
                </button>
            </div>
        );
    }


    return (
        <main className="watch-page">

            <div className="watch-container">

                {/* Video Player */}

                <div
                    className="player-wrapper"
                    onMouseMove={showVideoControls}
                    onMouseEnter={showVideoControls}
                >
                    <video
                        ref={videoRef}
                        src={video.videoFile}
                        poster={video.thumbnail}
                        controls
                        className="watch-player"
                        onPlay={handleVideoPlay}
                        onPause={handleVideoPause}
                    />

                    <button
                        className={`center-play-button ${showControls ? "visible" : "hidden"
                            }`}
                        onClick={handlePlayPause}
                    >
                        {isPlaying ? "❚❚" : "▶"}
                    </button>
                </div>


                {/* Video Info */}

                <section className="watch-info">

                    <h1 className="watch-title">
                        {video.title}
                    </h1>


                    <div className="watch-meta">

                        <span>
                            {formatViews(video.views)} views
                        </span>

                        <span>•</span>

                        <span>
                            {formatDate(video.createdAt)}
                        </span>

                    </div>


                    {/* Owner */}

                    {video.owner && (
                        <div className="watch-owner">

                            <img
                                src={video.owner.avatar}
                                alt={video.owner.username}
                                className="watch-owner-avatar"
                            />

                            <div className="watch-owner-info">

                                <h3>
                                    {video.owner.fullName ||
                                        video.owner.username}
                                </h3>

                                <p>
                                    @{video.owner.username}
                                    {" • "}
                                    {subscriberCount} subscribers
                                </p>

                            </div>
                            {user?._id === video.owner?._id ? (
                                <button className="subscribe-button own-channel">
                                    Your Channel
                                </button>
                            ) : (
                                <button
                                    className={`subscribe-button ${isSubscribed ? "subscribed" : ""
                                        }`}
                                    onClick={handleSubscribe}
                                    disabled={subscribeLoading}
                                >
                                    {isSubscribed
                                        ? "✓ Subscribed"
                                        : "Subscribe"}
                                </button>
                            )}

                        </div>
                    )}


                    {/* Description */}

                    <div className="watch-description">

                        <h3>Description</h3>

                        <p>
                            {video.description}
                        </p>

                    </div>


                    {/* Actions */}

                    <div className="watch-actions">

                        <button
                            className={`watch-action like-button ${isLiked ? "liked" : ""
                                }`}
                            onClick={handleLike}
                            disabled={likeLoading}
                        >
                            {isLiked ? "❤️ Liked" : "👍 Like"}

                            <span>
                                {likeCount}
                            </span>
                        </button>
                        <button className="watch-action">
                            💬 Comment
                        </button>

                        <button className="watch-action">
                            ↗ Share
                        </button>
                    </div>
                    <Comments videoId={videoId} />

                </section>

            </div>
            <LoginRequiredModal
                show={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                action="like this video"
            />
        </main>
    );
}


/* ================================
   FORMAT VIEWS
================================ */

function formatViews(views) {

    if (!views) return "0";

    if (views >= 1000000) {
        return `${(views / 1000000).toFixed(1)}M`;
    }

    if (views >= 1000) {
        return `${(views / 1000).toFixed(1)}K`;
    }

    return views;
}


/* ================================
   FORMAT DATE
================================ */

function formatDate(date) {

    if (!date) return "";

    const now = new Date();
    const created = new Date(date);

    const seconds = Math.floor(
        (now - created) / 1000
    );

    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days}d ago`;
    }

    if (hours > 0) {
        return `${hours}h ago`;
    }

    if (minutes > 0) {
        return `${minutes}m ago`;
    }

    return "Just now";
}

export default Video;