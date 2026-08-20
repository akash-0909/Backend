import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import VideoCard from "../components/VideoCard";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
function Channel() {

    const { username } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const getChannel = async () => {

            try {

                setLoading(true);
                const response = await api.get(
                    `/users/c/${username}`
                );

                const channelData = response.data.data;

                // console.log("CHANNEL DATA:", channelData);

                setChannel(channelData);

                // console.log("CHANNEL ID:", channelData._id);

                const videosUrl = `/videos/channel/${channelData._id}`;

                // console.log("VIDEOS URL:", videosUrl);

                const videosResponse = await api.get(videosUrl);

                // console.log("VIDEOS RESPONSE:", videosResponse.data);

                setVideos(videosResponse.data.data);
                // setChannel(channelData);

            } catch (error) {

                console.log(
                    "CHANNEL ERROR:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        getChannel();

    }, [username]);


    if (loading) {
        return (
            <div className="channel-loading">
                Loading channel...
            </div>
        );
    }


    if (!channel) {
        return (
            <div className="channel-error">
                <h2>Channel not found</h2>
            </div>
        );
    }


    const isOwnChannel =
        user?._id === channel._id;

    const handleSubscribe = async () => {
        try {
            const response = await api.post(
                `/subscriptions/c/${channel._id}`
            );

            console.log("SUBSCRIPTION:", response.data);

            const wasSubscribed = channel.isSubscribed;

            setChannel((prev) => ({
                ...prev,
                isSubscribed: !wasSubscribed,
                subscriberCount:
                    wasSubscribed
                        ? prev.subscriberCount - 1
                        : prev.subscriberCount + 1
            }));

        } catch (error) {
            console.log("SUBSCRIBE ERROR:", error);
        }
    };
    return (
        <main className="channel-page">

            {/* COVER */}

            <div className="channel-cover">

                {channel.coverImage ? (
                    <img
                        src={channel.coverImage}
                        alt="Cover"
                    />
                ) : (
                    <div className="default-cover"></div>
                )}

            </div>


            {/* PROFILE */}

            <section className="channel-profile">

                <img
                    src={channel.avatar}
                    alt={channel.username}
                    className="channel-avatar"
                />

                <div className="channel-details">

                    <h1>
                        {channel.fullName}
                    </h1>

                    <p className="channel-username">
                        @{channel.username}
                    </p>

                    <p className="channel-stats">

                        {channel.subscriberCount}
                        {" "}
                        subscribers

                        <span>•</span>

                        {channel.subscribedToCount}
                        {" "}
                        subscriptions

                    </p>

                </div>


                {/* BUTTON */}

                <div className="channel-actions">

                    {isOwnChannel ? (

                        <button
                            className="channel-own-button"
                            onClick={() => navigate("/edit-channel")}
                        >
                            ✏️ Edit Channel
                        </button>

                    ) : (

                        <button
                            onClick={handleSubscribe}
                            className={`channel-subscribe ${channel.isSubscribed
                                ? "subscribed"
                                : ""
                                }`}
                        >
                            {channel.isSubscribed
                                ? "✓ Subscribed"
                                : "Subscribe"}
                        </button>

                    )}

                </div>

            </section>


            {/* VIDEOS */}

            <section className="channel-videos">

                <div className="channel-videos-header">

                    <h2>
                        Videos
                    </h2>

                </div>


                {videos.length === 0 ? (

                    <div className="channel-empty">

                        <div>🎥</div>

                        <h3>
                            No videos yet
                        </h3>

                        <p>
                            This channel hasn't
                            uploaded any videos.
                        </p>

                    </div>

                ) : (

                    <div className="channel-video-grid">

                        {videos.map((video) => (

                            <VideoCard
                                key={video._id}
                                video={video}
                            />

                        ))}

                    </div>

                )}

            </section>

        </main>
    );
}

export default Channel;