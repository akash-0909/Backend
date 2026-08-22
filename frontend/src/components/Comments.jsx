import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import LoginRequiredModal from "./LoginRequiredModal";
import EmojiPicker from "emoji-picker-react";
function Comments({ videoId }) {

    const navigate = useNavigate();
    const { user } = useAuth();

    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);

    const [commentLikes, setCommentLikes] = useState({});
    const [commentLikeStatus, setCommentLikeStatus] = useState({});
    const [commentLikeLoading, setCommentLikeLoading] = useState({});
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const handleCommentLike = async (commentId) => {

        if (!user) {
            setShowLoginModal(true);
            return;
        }

        if (commentLikeLoading[commentId]) {
            return;
        }

        try {

            setCommentLikeLoading((prev) => ({
                ...prev,
                [commentId]: true
            }));

            await api.post(
                `/likes/toggle/comment/${commentId}`
            );

            const currentlyLiked =
                commentLikeStatus[commentId];

            setCommentLikeStatus((prev) => ({
                ...prev,
                [commentId]: !currentlyLiked
            }));

            setCommentLikes((prev) => ({
                ...prev,
                [commentId]:
                    currentlyLiked
                        ? prev[commentId] - 1
                        : prev[commentId] + 1
            }));

        } catch (error) {

            console.log(
                "COMMENT LIKE ERROR:",
                error
            );

        } finally {

            setCommentLikeLoading((prev) => ({
                ...prev,
                [commentId]: false
            }));

        }
    };
    const getCommentLikeInfo = async (commentId) => {
        try {
            const [countResponse, statusResponse] =
                await Promise.all([
                    api.get(`/likes/comment/${commentId}`),
                    api.get(`/likes/comment/${commentId}/status`)
                ]);

            setCommentLikes((prev) => ({
                ...prev,
                [commentId]:
                    countResponse.data.data.likeCount
            }));

            setCommentLikeStatus((prev) => ({
                ...prev,
                [commentId]:
                    statusResponse.data.data.isLiked
            }));

        } catch (error) {
            console.log(
                "COMMENT LIKE ERROR:",
                error
            );
        }
    };
    const handleEmojiClick = (emojiData) => {
        setContent((prev) => prev + emojiData.emoji);
    };
    const [showLoginModal, setShowLoginModal] =
        useState(false);

    const [editingId, setEditingId] =
        useState(null);

    const [editContent, setEditContent] =
        useState("");


    // ==========================================
    // GET COMMENTS
    // ==========================================

    const getComments = async () => {
        try {
            setLoading(true);

            const response = await api.get(
                `/comments/${videoId}`
            );

            const fetchedComments = response.data.data;

            setComments(fetchedComments);

            fetchedComments.forEach((comment) => {
                getCommentLikeInfo(comment._id);
            });

        } catch (error) {
            console.log("COMMENTS ERROR:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getComments();
    }, [videoId]);


    // ==========================================
    // ADD COMMENT
    // ==========================================

    const handleAddComment = async () => {

        if (!user) {
            setShowLoginModal(true);
            return;
        }

        if (!content.trim()) {
            return;
        }

        try {

            setPosting(true);

            const response = await api.post(
                `/comments/${videoId}`,
                {
                    content
                }
            );

            setComments((prev) => [
                response.data.data,
                ...prev
            ]);

            setContent("");

        } catch (error) {

            console.log(
                "ADD COMMENT ERROR:",
                error
            );

        } finally {

            setPosting(false);

        }
    };


    // ==========================================
    // DELETE COMMENT
    // ==========================================

    const handleDelete = async (commentId) => {

        const confirmDelete =
            window.confirm(
                "Delete this comment?"
            );

        if (!confirmDelete) return;

        try {

            await api.delete(
                `/comments/${commentId}`
            );

            setComments((prev) =>
                prev.filter(
                    (comment) =>
                        comment._id !== commentId
                )
            );

        } catch (error) {

            console.log(
                "DELETE COMMENT ERROR:",
                error
            );

        }
    };


    // ==========================================
    // START EDIT
    // ==========================================

    const handleEditStart = (comment) => {

        setEditingId(comment._id);

        setEditContent(
            comment.content
        );
    };


    // ==========================================
    // UPDATE COMMENT
    // ==========================================

    const handleEditSave = async (commentId) => {

        if (!editContent.trim()) {
            return;
        }

        try {

            const response = await api.patch(
                `/comments/${commentId}`,
                {
                    content: editContent
                }
            );

            setComments((prev) =>
                prev.map((comment) =>
                    comment._id === commentId
                        ? response.data.data
                        : comment
                )
            );

            setEditingId(null);
            setEditContent("");

        } catch (error) {

            console.log(
                "UPDATE COMMENT ERROR:",
                error
            );

        }
    };


    return (
        <section className="comments-section">

            <div className="comments-header">

                <h2>
                    Comments
                    <span>
                        {comments.length}
                    </span>
                </h2>

            </div>


            {/* ADD COMMENT */}

            <div className="comment-input-area">

                {user && (
                    <img
                        src={user.avatar}
                        alt={user.username}
                        className="comment-user-avatar"
                    />
                )}

                <div className="comment-input-wrapper">

                    <div className="comment-textarea-container">

                        <textarea
                            value={content}
                            onChange={(e) =>
                                setContent(e.target.value)
                            }
                            onFocus={() => {
                                if (!user) {
                                    setShowLoginModal(true);
                                }
                            }}
                            placeholder={
                                user
                                    ? "Add a comment..."
                                    : "Login to comment..."
                            }
                            rows={2}
                        />

                        {user && (
                            <button
                                type="button"
                                className="emoji-button"
                                onClick={() =>
                                    setShowEmojiPicker(
                                        (prev) => !prev
                                    )
                                }
                            >
                                🙂
                            </button>
                        )}

                        {showEmojiPicker && user && (
                            <div className="emoji-picker-container">
                                <EmojiPicker
                                    onEmojiClick={handleEmojiClick}
                                    theme="dark"
                                    width={300}
                                    height={350}
                                />
                            </div>
                        )}

                    </div>

                    {content.trim() && (
                        <div className="comment-input-actions">

                            <button
                                className="comment-cancel"
                                onClick={() =>
                                    setContent("")
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="comment-post"
                                onClick={
                                    handleAddComment
                                }
                                disabled={posting}
                            >
                                {posting
                                    ? "Posting..."
                                    : "Comment"}
                            </button>

                        </div>
                    )}

                </div>

            </div>


            {/* COMMENTS */}

            {loading ? (

                <div className="comments-loading">
                    Loading comments...
                </div>

            ) : comments.length === 0 ? (

                <div className="no-comments">

                    <div>
                        💬
                    </div>

                    <h3>
                        No comments yet
                    </h3>

                    <p>
                        Be the first to comment.
                    </p>

                </div>

            ) : (

                <div className="comments-list">

                    {comments.map((comment) => (

                        <article
                            className="comment-item"
                            key={comment._id}
                        >

                            <img
                                src={
                                    comment.owner?.avatar
                                }
                                alt={
                                    comment.owner?.username
                                }
                                className="comment-avatar"
                            />


                            <div className="comment-body">

                                <div className="comment-author">

                                    <strong>
                                        @
                                        {
                                            comment.owner
                                                ?.username
                                        }
                                    </strong>

                                    <span>
                                        {formatDate(
                                            comment.createdAt
                                        )}
                                    </span>

                                </div>


                                {editingId ===
                                    comment._id ? (

                                    <div className="edit-comment">

                                        <textarea
                                            value={
                                                editContent
                                            }
                                            onChange={(e) =>
                                                setEditContent(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <div>

                                            <button
                                                onClick={() => {
                                                    setEditingId(
                                                        null
                                                    );
                                                }}
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleEditSave(
                                                        comment._id
                                                    )
                                                }
                                            >
                                                Save
                                            </button>

                                        </div>

                                    </div>

                                ) : (

                                    <p className="comment-content">
                                        {comment.content}
                                    </p>

                                )}


                                {/* ACTIONS */}

                                <div className="comment-actions">

                                    {/* LIKE — everyone can use this */}
                                    {user && (
                                        <button
                                            className={`comment-like-button ${commentLikeStatus[comment._id]
                                                    ? "comment-liked"
                                                    : ""
                                                }`}
                                            onClick={() =>
                                                handleCommentLike(comment._id)
                                            }
                                            disabled={
                                                commentLikeLoading[comment._id]
                                            }
                                        >
                                            {commentLikeStatus[comment._id]
                                                ? "❤️"
                                                : "🤍"}

                                            <span>
                                                {commentLikes[comment._id] || 0}
                                            </span>
                                        </button>
                                    )}

                                    {/* EDIT + DELETE — only comment owner */}
                                    {user &&
                                        user._id === comment.owner?._id && (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        handleEditStart(comment)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(comment._id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}

                                </div>
                            </div>

                        </article>

                    ))}

                </div>

            )}


            <LoginRequiredModal
                show={showLoginModal}
                onClose={() =>
                    setShowLoginModal(false)
                }
                action="comment on this video"
            />

        </section>
    );
}


// ==========================================
// DATE FORMAT
// ==========================================

function formatDate(date) {

    if (!date) return "";

    const now = new Date();

    const created = new Date(date);

    const seconds = Math.floor(
        (now - created) / 1000
    );

    const minutes =
        Math.floor(seconds / 60);

    const hours =
        Math.floor(minutes / 60);

    const days =
        Math.floor(hours / 24);


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


export default Comments;