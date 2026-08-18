import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function Video() {

    const { videoId } = useParams();

    const [video, setVideo] = useState(null);

    useEffect(() => {
        const getVideo = async () => {
            try {
                const response = await api.get(
                    `/videos/${videoId}`
                );

                console.log("VIDEO:", response.data);

                setVideo(response.data.data);

            } catch (error) {
                console.log(error);
            }
        };
     //console.log("VIDEO FILE:", response.data.data.videoFile);
        getVideo();
    }, [videoId]);

    if (!video) {
        return <h2>Loading...</h2>;
    }

    return (
        <div>
            <h1>{video.title}</h1>

            <video
                src={video.videoFile}
                controls
                width="700"
            />

            <p>{video.description}</p>

            <p>{video.views} views</p>
        </div>
    );
}

export default Video;