"use client"
import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

// 定义与 Prisma 模型一致的用户接口
interface User {
    email: string;
    name: string;
    givenName?: string;
    picture: string;
    credits: string; // 数据库存的是 string
    googleUserId: string;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    credits: number; // 总积分 (本地 + 账户)
    isLoaded: boolean;
    login: () => void;
    logout: () => void;
    deductCredit: () => Promise<boolean>;
    refreshCredits: () => Promise<void>; // 新增：刷新方法
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [dbCredits, setDbCredits] = useState(0); // 数据库积分
    const [guestCredits, setGuestCredits] = useState(0); // 本地游客积分
    const [isLoaded, setIsLoaded] = useState(false);
    const [tokenClient, setTokenClient] = useState<any>(null);

    // --- 1. 获取本地游客积分 (1分/天) ---
    const getGuestCreditsValue = useCallback(() => {
        if (typeof window === "undefined") return 1;
        const today = new Date().toDateString();
        const lastReset = localStorage.getItem("guest_reset_date");
        const stored = localStorage.getItem("local_credits");

        if (lastReset !== today) {
            localStorage.setItem("guest_reset_date", today);
            localStorage.setItem("local_credits", "1");
            return 1;
        }
        return stored ? parseInt(stored) : 1;
    }, []);

    // --- 2. 后端登录/同步逻辑 ---
    const syncUserToDatabase = useCallback(async (accessToken: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessToken }) // 对应后端接口字段
            });

            if (res.ok) {
                const data = await res.json();
                // 假设后端返回格式为 { status: "success", user: { ... } }
                const dbUser = data.user;
                setUser(dbUser);
                setDbCredits(parseInt(dbUser.credits || "0"));
                localStorage.setItem("auth_token", accessToken);
                localStorage.setItem("yt_db_user", JSON.stringify(dbUser));
            }
        } catch (e) {
            console.error("Database sync failed", e);
        }
    }, []);

    // --- 3. 新增：刷新积分方法 ---
    const refreshCredits = useCallback(async () => {
        const savedToken = localStorage.getItem("auth_token");
        if (savedToken) {
            await syncUserToDatabase(savedToken);
        }
        setGuestCredits(getGuestCreditsValue());
    }, [getGuestCreditsValue, syncUserToDatabase]);

    // --- 4. 初始化加载 ---
    useEffect(() => {
        const initialize = async () => {
            const savedToken = localStorage.getItem("auth_token");
            const savedUser = localStorage.getItem("yt_db_user");

            if (savedToken && savedUser) {
                try {
                    const parsedUser = JSON.parse(savedUser);
                    setUser(parsedUser);
                    setDbCredits(parseInt(parsedUser.credits || "0"));
                } catch (e) {
                    localStorage.removeItem("auth_token");
                }
            }
            setGuestCredits(getGuestCreditsValue());
            setIsLoaded(true);
        };

        const loadGoogleSDK = () => {
            const google = (window as any).google;
            if (google?.accounts?.oauth2) {
                const client = google.accounts.oauth2.initTokenClient({
                    client_id: "253186021190-f65kfg7m79cm9v555ar66avjmv75m5ki.apps.googleusercontent.com",
                    scope: "openid profile email",
                    callback: (tokenResponse: any) => {
                        if (tokenResponse?.access_token) {
                            syncUserToDatabase(tokenResponse.access_token);
                        }
                    },
                });
                setTokenClient(client);
            } else {
                setTimeout(loadGoogleSDK, 300);
            }
        };

        initialize();
        loadGoogleSDK();
    }, [getGuestCreditsValue, syncUserToDatabase]);

    // --- 5. 操作方法 ---
    const login = () => {
        if (tokenClient) tokenClient.requestAccessToken();
        else console.warn("Google Sign-in is initializing...");
    };

    const logout = () => {
        setUser(null);
        setDbCredits(0);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("yt_db_user");
        setGuestCredits(getGuestCreditsValue());
    };

    // --- 6. 核心：扣除积分逻辑 ---
    const deductCredit = async (): Promise<boolean> => {
        // 总分不足
        if (guestCredits + dbCredits <= 0) return false;

        // A. 优先扣除本地游客积分
        if (guestCredits > 0) {
            const newVal = guestCredits - 1;
            setGuestCredits(newVal);
            localStorage.setItem("local_credits", newVal.toString());
            return true;
        }

        // B. 本地积分为 0，扣除数据库积分
        if (user) {
            try {
                const token = localStorage.getItem("auth_token");
                const res = await fetch('/api/user/consume', { // 对应你的扣费接口
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user.email })
                });

                if (res.ok) {
                    const updatedUser = await res.json();
                    setDbCredits(parseInt(updatedUser.credits || "0"));
                    localStorage.setItem("yt_db_user", JSON.stringify(updatedUser));
                    return true;
                }
            } catch (e) {
                console.error("Deduct credit failed", e);
                return false;
            }
        }
        return false;
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn: !!user,
            credits: guestCredits + dbCredits, // 这里的计算结果是实时总分
            isLoaded,
            login,
            logout,
            deductCredit,
            refreshCredits
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};