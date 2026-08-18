import { useEffect, useState } from "react";
import api from "../api/axios";
import VideoCard from "../components/VideoCard";

function Home() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const getVideos = async () => {
            try {
                const response = await api.get("/videos");

                setVideos(response.data.data.videos);
            } catch (error) {
                console.log(error);
            }
        };

        getVideos();
    }, []);
    const handleLogout = async () => {
        try {
            const response = await api.post("/users/logout");

            console.log("LOGOUT:", response.data);
        } catch (error) {
            console.log("LOGOUT ERROR:", error);
        }
    };
    const getCurrentUser = async () => {
        try {
            const response = await api.get("/users/current-user");

            console.log("CURRENT USER:", response.data);

        } catch (error) {
            console.log("CURRENT USER ERROR:", error);
        }
    };
    return (
        <div>
            <h1>Home</h1>

            {videos.map((video) => (
                <VideoCard
                    key={video._id}
                    video={video}
                />
            ))}
            <button onClick={getCurrentUser}>
                Get Current User
            </button>
            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default Home;