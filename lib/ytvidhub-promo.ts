// lib/ytvidhub-promo.ts
// Shared config/helpers for cross-promoting ytvidhub.com across ytshortsdl.net.
// Used by: YtVidHubPromoModal (entry popup), YtVidHubDownloadSuccessModal
// (post-download popup), and Banner.tsx (header banner).

export type PromoPlacement = "entry_modal" | "download_success_modal" | "header_banner";

const BASE_URL = "https://ytvidhub.com/";
const UTM_SOURCE = "ytshortsdl";
const UTM_CAMPAIGN = "cross_promo";

/**
 * Builds a ytvidhub.com URL tagged with UTM params so conversions from each
 * placement can be told apart in ytvidhub's GA4 property.
 * utm_medium = the placement (entry_modal / download_success_modal / header_banner)
 */
export function getYtVidHubUrl(placement: PromoPlacement, extraPath = ""): string {
    const url = new URL(extraPath || BASE_URL, BASE_URL);
    url.searchParams.set("utm_source", UTM_SOURCE);
    url.searchParams.set("utm_medium", placement);
    url.searchParams.set("utm_campaign", UTM_CAMPAIGN);
    return url.toString();
}

const STORAGE_KEY = "ytvidhub_promo_v1";

export type StoredPromoState = {
    /** User already clicked through on at least one placement — stop pitching. */
    clicked?: boolean;
    /** Timestamp until which the entry modal should stay hidden after a dismiss. */
    entryDismissedUntil?: number;
    /** Timestamp until which the download-success modal should stay hidden after a dismiss. */
    successDismissedUntil?: number;
};

export function readPromoState(): StoredPromoState {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
        return {};
    }
}

export function writePromoState(patch: Partial<StoredPromoState>) {
    try {
        const next = { ...readPromoState(), ...patch };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
        // localStorage unavailable (private mode, SSR, etc.) — fail silently.
    }
}

const SUCCESS_COOLDOWN_DAYS = 3;

/**
 * Call this right before showing the post-download promo card.
 * Keeps it from re-nagging users who already converted or recently dismissed it,
 * while still allowing it to reappear a few days later for users who never engaged.
 */
export function shouldShowDownloadSuccessPromo(): boolean {
    const stored = readPromoState();
    if (stored.clicked) return false;
    if (stored.successDismissedUntil && stored.successDismissedUntil > Date.now()) return false;
    return true;
}

export function dismissDownloadSuccessPromo() {
    writePromoState({ successDismissedUntil: Date.now() + SUCCESS_COOLDOWN_DAYS * 24 * 60 * 60 * 1000 });
}
