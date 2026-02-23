import { Platform } from 'react-native';
import Purchases, { PurchasesPackage } from 'react-native-purchases';

// IMPORTANT: Replace these with your actual RevenueCat API keys from the Dashboard
const API_KEYS = {
    apple: "YOUR_APPLE_API_KEY",
    google: "YOUR_GOOGLE_API_KEY",
};

export const ENTITLEMENT_ID = 'ProCounter'; // The exact string identifier configured in RevenueCat

export class RevenueCatService {
    static async init() {
        if (Platform.OS === 'ios') {
            Purchases.configure({ apiKey: API_KEYS.apple });
        } else if (Platform.OS === 'android') {
            Purchases.configure({ apiKey: API_KEYS.google });
        }

        // Setup config to listen to customer updates
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG); // Helpful during development
    }

    static async getOfferings() {
        try {
            const offerings = await Purchases.getOfferings();
            if (offerings.current !== null) {
                return offerings.current.availablePackages;
            }
        } catch (e) {
            console.warn('Error fetching offerings', e);
        }
        return [];
    }

    static async purchasePackage(pack: PurchasesPackage) {
        try {
            const { customerInfo } = await Purchases.purchasePackage(pack);
            return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined";
        } catch (e: any) {
            if (!e.userCancelled) {
                console.warn('Purchase failed', e);
            }
            return false;
        }
    }

    static async restorePurchases() {
        try {
            const customerInfo = await Purchases.restorePurchases();
            return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined";
        } catch (e) {
            console.warn('Restore failed', e);
            return false;
        }
    }

    static async checkPremiumStatus() {
        try {
            const customerInfo = await Purchases.getCustomerInfo();
            return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined";
        } catch (e) {
            console.warn('Check premium status failed', e);
            return false;
        }
    }
}
