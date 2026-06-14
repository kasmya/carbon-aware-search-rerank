# Novelty 1: Client-side, click-rewarded learning for carbon-aware ranking
a search ranking system that learns directly from user interactions (like clicks) on the user’s own device, while also optimizing for sustainability. Let’s break it down:

# Novelty 2: Contextual bandits for SERP-level green boosting

## What are Contextual Bandits
Contextual bandits are a type of reinforcement learning algorithm that balances exploration and exploitation while making decisions based on contextual information (like user features or environment state). They are widely used in personalization tasks such as online advertising, recommendation systems, and adaptive clinical trials.

"SERP-level green boosting" refers to a technique in search engine result pages (SERPs) where ranking or re-ranking of results is influenced by environmental sustainability signals—essentially giving preference (a "boost") to results that are considered more green or carbon-friendly.

- SERP-level → The adjustment happens at the level of the search results page, not just for individual items in isolation.
- Green boosting → Search results that are associated with lower carbon impact (e.g., energy-efficient websites, eco-friendly products, or services hosted in greener data centers) are given a ranking advantage.

# Novelty 3: Relevance guardrails + carbon optimization in a single loop

- Relevance guardrails → Ensuring that the search results remain highly relevant to the user’s query. Guardrails prevent sustainability signals from overwhelming or distorting the core relevance ranking.
- Carbon optimization → Adjusting ranking or re-ranking to favor results that are more environmentally sustainable (e.g., hosted in greener data centers, lower carbon footprint).
- Single loop → Instead of treating relevance and carbon optimization as separate stages (first relevance, then sustainability re-ranking), the algorithm integrates both into one unified decision-making loop.
