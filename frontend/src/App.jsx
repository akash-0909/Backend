import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Video from "./pages/Video";
import Upload from "./pages/Upload"
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Channel from "./pages/Channel";
import EditChannel from "./pages/EditChannel";
function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/watch/:videoId" element={<Video />} />
                <Route path="/upload" element={<Upload />} />
                <Route
                    path="/upload"
                    element={
                        <ProtectedRoute>
                            <Upload />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/c/:username"
                    element={<Channel />}
                />
                <Route
                    path="/edit-channel"
                    element={<EditChannel />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;