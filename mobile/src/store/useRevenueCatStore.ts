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

export const useRevenueCatStore = create<RevenueCatState>((set) => ({
    isPremium: false,
    offerings: [],
    isInitialized: false,
    setPremiumStatus: (status) => set({ isPremium: status }),
    setOfferings: (offerings) => set({ offerings }),
    setInitialized: (status) => set({ isInitialized: status }),
}));

// Setup listener
Purchases.addCustomerInfoUpdateListener((customerInfo) => {
    const isPremium = typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined";
    useRevenueCatStore.getState().setPremiumStatus(isPremium);
});
