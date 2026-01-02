# LeafDoc Roadmap: Future Improvements

This document outlines potential enhancements for the plant identification and care recommendation system.

## 🌿 Improving Plant Identification

| Feature | Description | Technical Concept |
| :--- | :--- | :--- |
| **Ensemble Verification** | Reduces "hallucinations" and improves confidence. | Call a second model (e.g., GPT-4o-mini) in parallel only when primary confidence is <80%. Cross-reference results. |
| **Contextual Prioritization** | Plants vary wildly by geography. | Pass the user's approximate location or indoor/outdoor status to the AI prompt to exclude species that don't exist in that region. |
| **Multi-Angle Synthesis** | One photo often hides the problem. | Modify the API to weight "Plant Close-up" higher than "Environment Scene" by categorizing images before the final diagnosis. |
| **Interactive Clarification** | Handles "Needs More Info" gracefully. | If confidence is low, the API returns a `clarificationQuestion` (e.g., "Are the stems mushy or dry?") for the user to answer. |

## 💧 Improving Plant Care Steps

| Feature | Description | Technical Concept |
| :--- | :--- | :--- |
| **Dynamic Care Timeline** | Moves beyond static 3-step lists. | AI generates a **7-day Recovery Plan** with specific actions for day 1, day 3, and day 7. |
| **Environmental Real-Time Sync** | Care changes with the weather. | Integrate a weather API. Adjust care steps (e.g., "Water more frequently this week") based on local heatwaves or humidity. |
| **Difficulty & Toxicity Alerts** | Safety and expectation setting. | Add metadata fields for "Pet Safety" and "Care Level" (Easy/Med/Expert). Flag toxic plants based on ID. |
| **"Guided Action" Links** | Directs users to physical actions. | Map AI steps to internal "How-To" guides or YouTube search queries (e.g., "How to prune [PlantName]"). |

## 🛠️ Strategic API Enhancements

1.  **Disease Progression Tracking**: Use previous scan data (`issue`, `healthScore`) from Prisma in the prompt to track if the plant is recovering.
2.  **Product Recommendations**: Tailor a "Supply List" (specific soils, fertilizers, or moisture meters) based on the diagnosed issue.
3.  **Structured Care Schema**: Transition from stringified steps to a structured JSON object with maintenance frequencies to enable future push notifications.
