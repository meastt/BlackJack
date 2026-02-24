import { create } from 'zustand';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { ENTITLEMENT_ID } from '../services/RevenueCatService';

interface RevenueCatState {
    isPremium: boolean;
    offerings: PurchasesPackage[];
    isInitialized: boolean;
    setPremiumStatus: (status: boolean) => void;
    setOfferings: (offerings: PurchasesPackage[]) => void;
    setInitialized: (status: boolean) => void;
}

// ⚠️ DEV ONLY — set to false before shipping to production
export const DEV_UNLOCK_ALL = false;

export const useRevenueCatStore = create<RevenueCatState>((set) => ({
    isPremium: DEV_UNLOCK_ALL,

    offerings: [],
    isInitialized: false,
    setPremiumStatus: (status) => set({ isPremium: status }),
    setOfferings: (offerings) => set({ offerings }),
    setInitialized: (status) => set({ isInitialized: status }),
}));

// Setup listener — skipped when DEV_UNLOCK_ALL is on
if (!DEV_UNLOCK_ALL) {
    Purchases.addCustomerInfoUpdateListener((customerInfo) => {
        const isPremium = typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined";
        useRevenueCatStore.getState().setPremiumStatus(isPremium);
    });
}
