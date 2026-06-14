# Novelty 1: Client-side, click-rewarded learning for carbon-aware ranking
a search ranking system that learns directly from user interactions (like clicks) on the user’s own device, while also optimizing for sustainability. 

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

## The Strongest Evidence for Novelty: A Direct Comparison Matrix

| Feature | r1 | r2 | r4 | r5 | r6 | r10 | r12 | **YOUR SYSTEM** |
|---------|----|----|----|----|----|-----|-----|-----------------|
| SERP/search reranking | ✓ (recs) | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | **✓** |
| Carbon-aware objective | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **✓** |
| Online/adaptive learning | ✗ | ✗ | ✓* | ✓* | ✓ | ✓* | ✓* | **✓** (bandits) |
| Click/user reward signal | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | **✓** |
| Privacy-preserving (client-side) | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ~(FL) | **✓** (enforced) |
| Relevance guardrail/constraint | ✓ | ~(conv) | ✓ | ✓ | ✓ | ✓ | ✓ | **✓** (CTR non-inf) |
| **All 6 features together** | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | **✓** |

> **Note:** r4, r5, r6, r10, r12 have online adaptation but for different objectives (model selection, scheduling, retraining frequency). None combine SERP reranking, click reward, and privacy-preserving learning.

---
# Research Questions

## Primary Research Question

> **RQ1:** *Can a client-side, privacy-preserving contextual bandit learn to re-rank search engine results pages (SERPs) to increase clicks on green-hosted websites while maintaining overall relevance (click-through rate) non-inferior to the original ranking?*

## Secondary Research Questions

### RQ2: Learning & Adaptation
> **RQ2:** *How does a neural contextual bandit (vs. a linear bandit) affect the trade-off between carbon exposure reduction and relevance preservation when learning from sparse, noisy click feedback?*

### RQ3: Privacy & Feasibility
> **RQ3:** *Is it feasible to train a carbon-aware re-ranking policy entirely client-side (browser extension) with <10 KB of stored state per user, while achieving meaningful carbon savings within 50-100 interactions?*

### RQ4: Constraint Satisfaction
> **RQ4:** *Can an overall CTR non-inferiority guardrail prevent relevance degradation while allowing the bandit to explore green-promoting actions, and how sensitive is this to the choice of non-inferiority margin?*

### RQ5: Carbon Intensity Adaptation
> **RQ5:** *Does incorporating LSTM-forecasted grid carbon intensity into the context improve the bandit’s ability to reduce expected carbon per click compared to using only static site-level greenness scores?*

### RQ6: Generalizability
> **RQ6:** *How well does the learned policy transfer across different query categories (e.g., news, shopping, informational) and user segments (high vs. low sustainability concern)?*

## Optional (Higher-Risk) Research Questions

> **RQ7 (GNN):** *Can a graph neural network over domain relationships enable zero-shot green promotion for unseen domains based on similar known domains?*

> **RQ8 (Meta-Learning):** *Does meta-learning (MAML) reduce the cold-start interaction cost for new users by ≥50% compared to a standard Thompson sampling bandit?*

## Evaluation Metrics per RQ

| RQ | Metric | Success Criterion |
|----|--------|-------------------|
| RQ1 | G-CTR increase, Overall CTR non-inferiority | G-CTR +15%, CTR Δ ≥ -5% (non-inferiority margin) |
| RQ2 | Regret, carbon exposure per query | Neural bandit regret ≤ linear bandit after N steps |
| RQ3 | Storage (KB), convergence steps | <50 KB model, converges within 100 interactions |
| RQ4 | CTR degradation rate, safety violations | <5% of queries violate guardrail |
| RQ5 | Carbon intensity prediction error, carbon per click reduction | MAPE <20%, additional 10% reduction vs. static |
| RQ6 | Category-wise CTR lift, fairness disparity | No category worse than -10% CTR |
