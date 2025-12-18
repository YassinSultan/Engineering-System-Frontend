// src/hooks/useAuth.js
import { useSelector } from "react-redux";

export const useAuth = () => {
    const { token, claims, profile, loading } = useSelector((state) => state.auth);

    const user = profile || claims; // لو الـ profile لسه بيحمل → نستخدم claims

    const hasPermission = (permission) => {
        console.log("profile", profile);
        console.log("claims", claims);
        if (claims?.role === "SUPER_ADMIN") return true;
        return claims?.permissions?.map((p) => p.action).includes(permission) || false;
    };

    return {
        token,
        user,           // فيه name و avatar لو موجود
        profile,        // الداتا الكاملة
        claims,         // role + permissions
        isLoading: loading,
        hasPermission,
    };
};