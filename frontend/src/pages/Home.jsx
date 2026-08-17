import { useEffect, useState } from "react";
import api from "../api/axios";

function Home() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const getVideos = async () => {
            try {
                const response = await api.get("/videos");

                console.log("BACKEND RESPONSE:", response.data);

                setVideos(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        getVideos();
    }, []);

    return (
        <div>
            <h1>Home</h1>

            {videos?.map((video) => (
                <div key={video._id}>
                    <h2>{video.title}</h2>
                    <p>{video.description}</p>
                </div>
            ))}
        </div>
    );
}

export default Home;