import { Link } from "react-router-dom";

function VideoCard({ video }) {
    return (
        <Link to={`/watch/${video._id}`}>
            <div>
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    width="300"
                />

                <h2>{video.title}</h2>

                <p>{video.description}</p>

                <p>{video.views} views</p>
            </div>
        </Link>
    );
}

export default VideoCard;