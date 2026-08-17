function VideoCard({ video }) {
    return (
        <div>
            <img
                src={video.thumbnail}
                alt={video.title}
            />

            <h2>{video.title}</h2>

            <p>{video.description}</p>

            <p>{video.views} views</p>
        </div>
    );
}

export default VideoCard;