import { Rank } from '@card-counter-ai/shared';

export type Action = 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT';

export interface Scenario {
    playerHand: string[]; // e.g. ['A', '6'] or ['10', '6']
    dealerCard: string; // e.g. '6'
    correctAction: Action;
    type: 'HARD' | 'SOFT' | 'PAIR';
    explanation: string;
}

// Simplified Basic Strategy Helper
// Returns the correct action for a given scenario
export const getBasicStrategyAction = (playerHand: string[], dealerCard: string): Action => {
    // Helper to get value
    const getValue = (card: string): number => {
        if (['J', 'Q', 'K'].includes(card)) return 10;
        if (card === 'A') return 11;
        return parseInt(card, 10);
    };

    const card1 = getValue(playerHand[0]);
    const card2 = getValue(playerHand[1]);
    const dealer = getValue(dealerCard);

    // PAIRS
    if (playerHand[0] === playerHand[1]) {
        const val = card1;
        if (val === 11 || val === 8) return 'SPLIT'; // Always split Aces and 8s
        if (val === 10) return 'STAND'; // Never split 10s
        if (val === 9) {
            if (dealer === 7 || dealer === 10 || dealer === 11) return 'STAND';
            return 'SPLIT';
        }
        if (val === 7) {
            if (dealer >= 8) return 'HIT';
            return 'SPLIT';
        }
        if (val === 6) {
            if (dealer >= 7) return 'HIT';
            return 'SPLIT';
        }
        if (val === 5) {
            if (dealer >= 10) return 'HIT';
            return 'DOUBLE'; // Treat as 10
        }
        if (val === 4) {
            if (dealer === 5 || dealer === 6) return 'SPLIT'; // Some charts differ, but this is standard
            return 'HIT';
        }
        if (val === 3 || val === 2) {
            if (dealer >= 8) return 'HIT';
            return 'SPLIT';
        }
    }

    // SOFT TOTALS (Contains Ace counted as 11)
    if (playerHand.includes('A')) {
        const otherCard = playerHand[0] === 'A' ? card2 : card1;
        // A,A is handled in Pairs

        if (otherCard >= 8) return 'STAND'; // Soft 19, 20
        if (otherCard === 7) { // Soft 18
            if (dealer >= 9) return 'HIT';
            if (dealer === 2 || dealer === 7 || dealer === 8) return 'STAND';
            return 'DOUBLE';
        }
        if (otherCard === 6) { // Soft 17
            if (dealer >= 3 && dealer <= 6) return 'DOUBLE';
            return 'HIT';
        }
        if (otherCard === 5 || otherCard === 4) { // Soft 15/16
            if (dealer >= 4 && dealer <= 6) return 'DOUBLE';
            return 'HIT';
        }
        if (otherCard === 3 || otherCard === 2) { // Soft 13/14
            if (dealer === 5 || dealer === 6) return 'DOUBLE';
            return 'HIT';
        }
    }

    // HARD TOTALS
    const total = card1 + card2;

    if (total >= 17) return 'STAND';
    if (total >= 13) {
        if (dealer >= 7) return 'HIT';
        return 'STAND';
    }
    if (total === 12) {
        if (dealer >= 4 && dealer <= 6) return 'STAND';
        return 'HIT';
    }
    if (total === 11) return 'DOUBLE';
    if (total === 10) {
        if (dealer >= 10) return 'HIT';
        return 'DOUBLE';
    }
    if (total === 9) {
        if (dealer >= 3 && dealer <= 6) return 'DOUBLE';
        return 'HIT';
    }

    return 'HIT'; // 8 or less
};

// Generate a random basic strategy scenario
export const generateScenario = (): Scenario => {
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    const r1 = ranks[Math.floor(Math.random() * ranks.length)];
    const r2 = ranks[Math.floor(Math.random() * ranks.length)];
    const d = ranks[Math.floor(Math.random() * ranks.length)];

    const playerHand = [r1, r2];
    const dealerCard = d;

    const action = getBasicStrategyAction(playerHand, dealerCard);

    let type: 'HARD' | 'SOFT' | 'PAIR' = 'HARD';
    if (r1 === r2) type = 'PAIR';
    else if (playerHand.includes('A')) type = 'SOFT';
    const playerTotal = (() => {
        // quick calc logic here or reuse helper if available in scope (it's not exported)
        // redefining simple calc for explanation generation
        const val = (c: string) => ['J', 'Q', 'K'].includes(c) ? 10 : (c === 'A' ? 11 : parseInt(c));
        let t = val(r1) + val(r2);
        if (t > 21 && (r1 === 'A' || r2 === 'A')) t -= 10;
        return t;
    })();

    let explanation = `Player has ${r1},${r2} vs Dealer ${d}`;

    if (type === 'PAIR') {
        explanation = `Always split ${r1}s` + (['A', '8'].includes(r1) ? '!' : ' against this dealer card.');
        if (action === 'STAND' && r1 === '10') explanation = "Never split 10s! You have a 20.";
        if (action === 'HIT' && r1 === '4') explanation = "4s are too weak to split here.";
    } else if (type === 'SOFT') {
        explanation = `Soft ${playerTotal}. ` + (action === 'DOUBLE' ? "Double against weak dealer." : "Standard soft hand play.");
    } else {
        // Hard
        if (playerTotal >= 17) explanation = `Stand on Hard ${playerTotal}.`;
        else if (playerTotal <= 8) explanation = "Always hit. You can't bust.";
        else if (playerTotal >= 12 && action === 'STAND') explanation = `Stand on ${playerTotal} vs Dealer bust card (${d}).`;
        else if (playerTotal >= 12 && action === 'HIT') explanation = `Hit ${playerTotal} vs Dealer strong card (${d}).`;
        else if (playerTotal === 11) explanation = "Always Double 11!";
        else if (playerTotal === 10) explanation = (action === 'DOUBLE' ? "Double 10 against this card." : "Hit 10 vs Dealer Ace/10.");
        else if (playerTotal === 9) explanation = (action === 'DOUBLE' ? "Double 9 vs weak dealer." : "Hit 9 vs strong dealer.");
    }

    return {
        playerHand,
        dealerCard,
        correctAction: action,
        type,
        explanation
    };
};
