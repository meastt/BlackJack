# Protocol 21: Global Expansion & Rules Roadmap

This document outlines the strategic plan for localizing **Protocol 21** and implementing regional blackjack rule variations to ensure the trainer remains accurate for international users.

---

## 1. Localization Priorities
Localization will be rolled out in phases based on gambling spend per capita and the density of physical casinos.

| Phase | Target Languages | Primary Markets | Rationale |
| :--- | :--- | :--- | :--- |
| **1** | English (Current) | USA, UK, Canada, Australia | Largest existing user base for card counting. |
| **2** | Spanish | Mexico, Spain, Colombia | High growth in "Social Casino" and mobile gaming. |
| **3** | Italian & French | Italy, France | Highest gambling revenue and casino density in Europe. |
| **4** | German | Germany, Austria | Robust market for strategic card games and utility apps. |
| **5** | Japanese | Japan | Emerging market with upcoming integrated casino resorts. |

---

## 2. Global Blackjack Rule Variations
The following table outlines the core technical rule changes to be implemented in the "Drill Settings" for international accuracy.

| Rule Feature | American (US/CAN) | European (EU/UK) | Macau (Asia) | Australian (AU) |
| :--- | :--- | :--- | :--- | :--- |
| **Hole Card** | Dealer Peeks | No Hole Card (ENHC) | No Hole Card | No Hole Card |
| **Surrender** | Late Surrender | Rarely Offered | Early Surrender | None |
| **Soft 17** | Dealer Hits (Most) | Dealer Stands | Dealer Stands | Dealer Stands |
| **Doubling** | Any 2 cards | Restricted (9-11) | Any 2 cards | Any 2 cards |
| **DAS*** | Allowed | Often Not Allowed | Allowed | Allowed |

*\*DAS: Double After Split*

---

## 3. Technical Implementation Tasks

### A. The "ENHC" Logic Block
* **Condition:** If `region == "Europe"`, player loses total bet (including doubles/splits) if dealer has Blackjack.
* **UI Update:** Add a "Dealer No Hole Card" toggle in settings.

### B. Surrender Logic
* **Early Surrender:** Allow player to surrender before the dealer checks for 21.
* **Late Surrender:** Only allow surrender after the dealer confirms no Blackjack.

### C. Deck Penetration & CSM
* **CSM Mode:** Add a training mode that simulates a **Continuous Shuffle Machine**. In this mode, the "True Count" is permanently reset to 0 after every hand, forcing the user to focus strictly on Basic Strategy rather than counting.