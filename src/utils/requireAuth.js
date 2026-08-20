export const requireAuth = (user, setShowLoginModal) => {
    if (!user) {
        setShowLoginModal(true);
        return false;
    }

    return true;
};