import { useEffect, useState } from "react";
import api from "../api/axios";
import VideoCard from "../components/VideoCard";

function Home() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getVideos = async () => {
            try {
                const response = await api.get("/videos");

                setVideos(response.data.data.videos);
            } catch (error) {
                console.log("GET VIDEOS ERROR:", error);
                setError("Unable to load videos");
            } finally {
                setLoading(false);
            }
        };

        getVideos();
    }, []);

    return (
        <main className="home-page">

            <section className="home-header">
                <div>
                    <h1>Latest Videos</h1>
                    <p>
                        Discover what's happening on MyTube
                    </p>
                </div>
            </section>

            {loading && (
                <div className="home-status">
                    <div className="loader"></div>
                    <p>Loading videos...</p>
                </div>
            )}

            {error && (
                <div className="home-status error">
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && videos.length === 0 && (
                <div className="empty-videos">
                    <div className="empty-icon">▶</div>

                    <h2>No videos yet</h2>

                    <p>
                        Be the first person to upload a video
                        on MyTube.
                    </p>
                </div>
            )}

            {!loading && videos.length > 0 && (
                <section className="video-grid">
                    {videos.map((video) => (
                        <VideoCard
                            key={video._id}
                            video={video}
                        />
                    ))}
                </section>
            )}

        </main>
    );
}

export default Home;