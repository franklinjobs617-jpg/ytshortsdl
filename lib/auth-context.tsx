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
    isLoaded: boolean;
    isLoggingIn: boolean;
    login: () => void;
    logout: () => void;
    checkQuota: (type: 'download' | 'extract' | 'summary', count?: number) => Promise<boolean>;
    consumeUsage: (type: 'download' | 'extract' | 'summary', count?: number) => Promise<boolean>;
    refreshUsage: () => Promise<void>;
    completeSurvey: (data: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [usage, setUsage] = useState<UsageData | null>(null);
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

    // --- 2. 获取/刷新每月配额使用情况 ---
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

    // --- 3. 登录同步逻辑 ---
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

    // --- 4. 初始化 ---
    useEffect(() => {
        const initialize = async () => {
            const savedToken = localStorage.getItem("auth_token");
            const savedUser = localStorage.getItem("yt_db_user");

            if (savedToken && savedUser) {
                try {
                    const parsedUser = JSON.parse(savedUser);
                    setUser(parsedUser);
                } catch (e) {
                    localStorage.removeItem("auth_token");
                }
            }
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
    }, [syncUserToDatabase, refreshUsage]);

    // --- 5. 消耗每月配额 (支持批量) ---
    const consumeUsage = async (type: 'download' | 'extract' | 'summary', count = 1): Promise<boolean> => {
        try {
            const res = await fetch('/api/usage/check-and-consume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id,
                    guestId: user ? undefined : getFingerprint(),
                    type,
                    count,
                    action: 'consume'
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

    const login = () => {
        if (tokenClient) tokenClient.requestAccessToken();
    };

    // 6. 检查剩余额度 (支持批量)
    const checkQuota = async (type: 'download' | 'extract' | 'summary', count = 1): Promise<boolean> => {
        try {
            const res = await fetch('/api/usage/check-and-consume', {
                method: 'POST',
                body: JSON.stringify({
                    userId: user?.id,
                    guestId: user ? undefined : getFingerprint(),
                    type,
                    count,
                    action: 'check'
                })
            });
            if (res.ok) {
                const data = await res.json();
                setUsage(data.usage); // 同步一下最新的使用情况
                return data.allowed;
            }
        } catch (e) {
            console.error("Check quota failed", e);
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        setUsage(null);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("yt_db_user");
        refreshUsage();
    };

    const completeSurvey = async (surveyData: any): Promise<boolean> => {
        if (!user) return false;
        try {
            const res = await fetch('/api/usage/survey-submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, surveyData })
            });
            if (res.ok) {
                const data = await res.json();
                setUsage(data.usage);
                return true;
            }
        } catch (e) {
            console.error("Survey submission failed", e);
        }
        return false;
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn: !!user,
            isSubscriber: usage ? (usage.plan === 'PRO' || usage.plan === 'ELITE') : false,
            usage,
            isLoaded,
            isLoggingIn,
            login,
            logout,
            consumeUsage,
            checkQuota,
            refreshUsage,
            completeSurvey
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
