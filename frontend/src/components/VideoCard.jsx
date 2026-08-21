import { Link } from "react-router-dom";

function VideoCard({ video }) {
    function formatDuration(seconds) {
        if (!seconds || isNaN(seconds)) {
            return "0:00";
        }

        const totalSeconds = Math.floor(seconds);

        const hours = Math.floor(totalSeconds / 3600);

        const minutes = Math.floor(
            (totalSeconds % 3600) / 60
        );

        const remainingSeconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, "0")}:${String(
                remainingSeconds
            ).padStart(2, "0")}`;
        }

        return `${minutes}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;
    }

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

    function formatDate(date) {
        if (!date) return "";

        const now = new Date();
        const created = new Date(date);

        const difference = now - created;

        const seconds = Math.floor(difference / 1000);
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

    return (
        <Link
            to={`/watch/${video._id}`}
            className="video-card-link"
        >
            <article className="video-card">

                {/* THUMBNAIL */}
                <div className="video-thumbnail-wrapper">

                    <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="video-thumbnail"
                    />

                    {/* DURATION */}
                    <span className="video-duration">
                        {formatDuration(video.duration)}
                    </span>

                </div>

                {/* VIDEO INFO */}
                <div className="video-info">

                    <h2 className="video-title">
                        {video.title}
                    </h2>

                    <p className="video-description">
                        {video.description}
                    </p>

                    <p className="video-meta">
                        {formatViews(video.views)} views
                        {video.createdAt && (
                            <>
                                <span> • </span>
                                {formatDate(video.createdAt)}
                            </>
                        )}
                    </p>

                </div>

            </article>
        </Link>
    );
}

export default VideoCard;