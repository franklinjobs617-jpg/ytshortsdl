"use client"
import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

// 用户基础信息接口
interface User {
    id: number;
    email: string;
    name: string;
    givenName?: string;
    picture: string;
    googleUserId: string;
    credits: string;
}

// 订阅使用情况接口
interface UsageData {
    plan: 'FREE' | 'PRO' | 'ELITE';
    downloadCount: number;
    extractionCount: number;
    summaryCount: number;
    expireTime: string | null;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isSubscriber: boolean; // 是否是付费订阅用户
    usage: UsageData | null; // 详细的每月用量
    credits: number; // 当前每日本地/账户点数 (用于 ZIP)
    isLoaded: boolean;
    isLoggingIn: boolean;
    login: () => void;
    logout: () => void;
    consumeUsage: (type: 'download' | 'extract' | 'summary') => Promise<boolean>;
    refreshUsage: () => Promise<void>;
    deductCredit: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [usage, setUsage] = useState<UsageData | null>(null);
    const [dbCredits, setDbCredits] = useState(0);
    const [guestCredits, setGuestCredits] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [tokenClient, setTokenClient] = useState<any>(null);

    // --- 1. 设备指纹 (用于追踪游客每月用量) ---
    const getFingerprint = useCallback(() => {
        if (typeof window === "undefined") return "";
        let fp = localStorage.getItem('device_fp');
        if (!fp) {
            fp = 'fp_' + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('device_fp', fp);
        }
        return fp;
    }, []);

    // --- 2. 获取每日本地积分 (1分/天，不累计) ---
    const getGuestDailyCredits = useCallback(() => {
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

    // --- 3. 获取/刷新每月配额使用情况 ---
    const refreshUsage = useCallback(async () => {
        try {
            const savedUser = localStorage.getItem("yt_db_user");
            const parsedUser = savedUser ? JSON.parse(savedUser) : null;

            const res = await fetch('/api/usage/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: parsedUser?.id,
                    guestId: parsedUser ? undefined : getFingerprint()
                })
            });
            if (res.ok) {
                const data = await res.json();
                setUsage(data);
            }
        } catch (e) {
            console.error("Fetch usage failed", e);
        }
    }, [getFingerprint]);

    // --- 4. 登录同步逻辑 ---
    const syncUserToDatabase = useCallback(async (accessToken: string) => {
        setIsLoggingIn(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessToken })
            });

            if (res.ok) {
                const data = await res.json();
                const dbUser = data.user;
                setUser(dbUser);
                setDbCredits(parseInt(dbUser.credits || "0"));
                localStorage.setItem("auth_token", accessToken);
                localStorage.setItem("yt_db_user", JSON.stringify(dbUser));
                // 登录后立即刷新用量表
                await refreshUsage();
            }
        } catch (e) {
            console.error("Database sync failed", e);
        } finally {
            setIsLoggingIn(false);
        }
    }, [refreshUsage]);

    // --- 5. 初始化 ---
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
            setGuestCredits(getGuestDailyCredits());
            await refreshUsage();
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
    }, [getGuestDailyCredits, syncUserToDatabase, refreshUsage]);

    // --- 6. 消耗每月配额 (下载/解析/总结前调用) ---
    const consumeUsage = async (type: 'download' | 'extract' | 'summary'): Promise<boolean> => {
        try {
            const res = await fetch('/api/usage/check-and-consume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id,
                    guestId: user ? undefined : getFingerprint(),
                    type
                })
            });

            if (res.ok) {
                const data = await res.json();
                setUsage(data.usage); // 更新本地用量状态
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    };

    // --- 7. 消耗每日本地/账户积分 (ZIP打包时调用) ---
    const deductCredit = async (): Promise<boolean> => {
        if (guestCredits + dbCredits <= 0) return false;

        if (guestCredits > 0) {
            const newVal = guestCredits - 1;
            setGuestCredits(newVal);
            localStorage.setItem("local_credits", newVal.toString());
            return true;
        }

        if (user) {
            try {
                const res = await fetch('/api/user/consume', {
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
                return false;
            }
        }
        return false;
    };

    const login = () => {
        if (tokenClient) tokenClient.requestAccessToken();
    };

    const logout = () => {
        setUser(null);
        setUsage(null);
        setDbCredits(0);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("yt_db_user");
        setGuestCredits(getGuestDailyCredits());
        refreshUsage();
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn: !!user,
            isSubscriber: usage ? (usage.plan === 'PRO' || usage.plan === 'ELITE') : false,
            usage,
            credits: guestCredits + dbCredits,
            isLoaded,
            isLoggingIn,
            login,
            logout,
            consumeUsage,
            refreshUsage,
            deductCredit
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