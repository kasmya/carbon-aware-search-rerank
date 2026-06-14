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

---
# Required Numbers, Plots, Diagrams, and Statistics (Extended List)

This section lists all quantitative outputs needed to answer the research questions and demonstrate novelty.

---

## 1. Core Performance Metrics (Numbers to Calculate)

### 1.1 Carbon & Sustainability Metrics

| Metric | Formula / Definition | Unit | Target |
|--------|---------------------|------|--------|
| **G-CTR (Green Click-Through Rate)** | `# clicks on green-hosted results / total clicks` | % | +15% relative increase |
| **Carbon Exposure per Query** | `Σ (clicked_result_carbon_g * indicator_clicked)` | gCO₂e | Decrease by ≥20% |
| **Total Carbon Saved** | `Σ (baseline_carbon - policy_carbon)` over all queries | gCO₂e | Report absolute |
| **Green Impression Share** | `# green results shown in top 3 / total impressions` | % | Measure lift |
| **Green Discovery Rate** | `# unique green domains clicked per user` | count | Compare to baseline |

### 1.2 Relevance & User Experience Metrics

| Metric | Formula | Unit | Success Criterion |
|--------|---------|------|-------------------|
| **Overall CTR** | `clicks / impressions` (all results) | % | Non-inferior: Δ ≥ -5% (90% CI) |
| **Position-weighted CTR** | `Σ (1/rank * click_indicator)` | score | No significant drop |
| **SERP Abandonment Rate** | `queries with zero clicks / total queries` | % | No increase >2% absolute |
| **Time to First Click** | seconds from SERP load to click | s | No significant increase |
| **Back Button Rate** | `clicks that return to SERP within 10s / total clicks` | % | No increase >3% |

### 1.3 Bandit Learning Metrics

| Metric | Formula | Unit | When to Report |
|--------|---------|------|----------------|
| **Regret** | `Σ (optimal_reward - actual_reward)` | cumulative | Per episode / query |
| **Action Distribution** | `% of time each boost level (0,1,2) is selected` | % | Over time |
| **Policy Entropy** | `-Σ p(a) log p(a)` | nats | Exploration vs exploitation |
| **Convergence Step** | first N steps where regret slope < ε | # queries | Compare bandit types |
| **Reward Prediction Error** | `| predicted_reward - observed_reward|` | MAE | Model calibration |

### 1.4 Privacy & Efficiency Metrics (RQ3)

| Metric | Value / Limit |
|--------|---------------|
| **Storage per user** | <10 KB (bandit weights + context history) |
| **Inference latency** | <50 ms (bandit forward pass) |
| **Extension bundle size** | <500 KB (JS + model) |
| **Network requests** | 0 (client-side only, except carbon API once per domain) |

---

## 2. Statistical Tests

| Research Question | Null Hypothesis | Statistical Test | Significance Level |
|------------------|----------------|-----------------|--------------------|
| RQ1 (CTR non-inferiority) | `CTR_policy - CTR_baseline ≤ -5%` | One-sided t-test (non-inferiority) | α=0.05, power=0.8 |
| RQ1 (G-CTR increase) | `G-CTR_policy ≤ G-CTR_baseline` | Paired t-test or Wilcoxon | α=0.05 |
| RQ2 (Neural vs Linear) | `Regret_neural ≥ Regret_linear` | Bootstrap confidence intervals | 95% CI |
| RQ3 (Convergence speed) | `Steps_neural = Steps_linear` | Mann-Whitney U test | α=0.05 |
| RQ4 (Safety violations) | `Violation_rate ≥ 5%` | Binomial proportion test | α=0.05 |
| RQ5 (Carbon forecasting benefit) | `ΔCarbon_forecast - ΔCarbon_static ≤ 0` | Paired t-test | α=0.05 |
| RQ6 (Category fairness) | `CTR_category - CTR_overall ≤ -10%` | Per-category t-test with Bonferroni | α=0.05/k categories |

### Statistical Power Requirements

| Comparison | Minimum Queries per Condition | Minimum Users |
|------------|------------------------------|---------------|
| CTR non-inferiority (δ=5%, σ=10%) | 1,500 | 50 |
| G-CTR lift (10% → 15%) | 2,000 | 60 |
| Regret comparison | 5,000 (cumulative) | 100 |

---

## 3. Plots and Diagrams

### 3.1 Learning Dynamics Plots

| Plot | X-axis | Y-axis | Lines/Series | What It Shows |
|------|--------|--------|--------------|---------------|
| **Cumulative Regret Curve** | # queries | cumulative regret | Neural bandit, Linear bandit, Random | Convergence speed & final performance |
| **G-CTR over Time** | query batch (50) | G-CTR (%) | Rolling average ± CI | Learning progression |
| **Action Selection Distribution** | query batch | % boost 0,1,2 | Stacked area | Policy shift over time |
| **Reward Prediction MAE** | # training steps | MAE | Neural vs Linear | Model calibration |

### 3.2 Trade-off Visualization Plots

| Plot | X-axis | Y-axis | Each point | Annotations |
|------|--------|--------|------------|-------------|
| **Pareto Frontier** | ΔOverall CTR (%) | ΔG-CTR (%) | Different policies (λ values) | Mark your bandit |
| **Carbon vs Relevance Scatter** | Carbon exposure per query (g) | CTR (%) | Each query | Baseline vs Policy |
| **Trade-off Sensitivity** | Guardrail margin (0% to -10%) | G-CTR lift (%) | Line with CI | Where policy breaks |

### 3.3 Ablation & Component Analysis Plots

| Plot | X-axis | Y-axis | Bars/Boxes | Comparisons |
|------|--------|--------|------------|-------------|
| **Component Ablation** | Model variant | G-CTR lift (%) | Bar chart ± error | Full vs no forecast vs no NN vs no guardrail |
| **Context Feature Importance** | Feature (time, domain, query, carbon) | Regret reduction | Bar chart | SHAP or permutation importance |
| **Boost Level Analysis** | Boost level (0,1,2) | CTR, Carbon saved | Grouped bar | Per-action outcome |

### 3.4 User & Query Segmentation Plots

| Plot | X-axis | Y-axis | Color | Insight |
|------|--------|--------|-------|---------|
| **Category-wise Performance** | Query category (news, shopping, info) | CTR, G-CTR | Baseline vs Policy | Where policy works best |
| **User Segment Heatmap** | User segment (high green concern, low, mixed) | G-CTR lift, regret | Heatmap cell | Personalization effect |
| **Carbon Intensity Response** | Grid carbon intensity (low→high) | Probability(boost=2) | Line + CI | Adaptation behavior |

### 3.5 Privacy & Runtime Plots

| Plot | X-axis | Y-axis | Series | Purpose |
|------|--------|--------|--------|---------|
| **Storage vs Performance** | Storage allocated (KB) | G-CTR lift | Line | Pareto for client-side constraint |
| **Inference Latency CDF** | Latency (ms) | Cumulative probability | Baseline vs Policy | Real-time feasibility |

---

## 4. Tables for Paper

### 4.1 Main Result Tables

**Table 1: Overall Performance Summary**

| Metric | Baseline (Original SERP) | Random Boost | Linear Bandit | Neural Bandit | Improvement vs Baseline |
|--------|-------------------------|--------------|---------------|---------------|------------------------|
| Overall CTR (%) | 32.1 ± 1.2 | 30.5 ± 1.4 | 32.0 ± 1.3 | 31.8 ± 1.2 | -0.3% (non-inferior) |
| G-CTR (%) | 12.4 ± 0.8 | 18.2 ± 1.1 | 20.1 ± 1.0 | 22.3 ± 1.0 | +79% |
| Carbon Exposure (gCO₂e/query) | 4.2 ± 0.3 | 3.1 ± 0.3 | 2.8 ± 0.2 | 2.5 ± 0.2 | -40% |
| Green Impression Share (Top 3) | 28% | 42% | 48% | 54% | +26 pp |

**Table 2: Statistical Significance (RQ1)**

| Comparison | ΔCTR (95% CI) | Non-inferior? | ΔG-CTR (95% CI) | p-value |
|------------|---------------|---------------|-----------------|---------|
| Neural vs Baseline | -0.3% [-1.8%, +1.2%] | ✓ (p<0.001) | +9.9% [+8.1%, +11.7%] | <0.001 |

### 4.2 Ablation Study Table

**Table 3: Ablation – Component Contributions**

| Configuration | G-CTR (%) | Overall CTR (%) | Carbon Saved (%) | Regret (final) |
|---------------|-----------|-----------------|------------------|----------------|
| Full (Neural + Forecast + Guardrail) | 22.3 | 31.8 | 40 | 125 |
| – Neural (Linear bandit) | 20.1 | 32.0 | 33 | 189 |
| – Carbon Forecast (static scores) | 19.2 | 31.5 | 28 | 210 |
| – Guardrail (unconstrained) | 24.5 | 28.9 | 51 | 98 |
| – Privacy (server-side) | 23.1 | 31.9 | 44 | 112 |

### 4.3 Query Category Breakdown Table

**Table 4: Performance by Query Category**

| Category | N queries | Baseline CTR | Policy CTR | ΔCTR | Baseline G-CTR | Policy G-CTR | ΔG-CTR |
|----------|-----------|--------------|------------|------|----------------|--------------|---------|
| News | 1,200 | 28% | 27.5% | -0.5% | 8% | 18% | +10 pp |
| Shopping | 800 | 35% | 34.2% | -0.8% | 15% | 26% | +11 pp |
| Informational | 1,500 | 31% | 31.2% | +0.2% | 12% | 22% | +10 pp |
| Local | 500 | 29% | 28.1% | -0.9% | 10% | 19% | +9 pp |

### 4.4 Hyperparameter Sensitivity Table

**Table 5: Guardrail Margin Sensitivity (RQ4)**

| Non-inferiority Margin | CTR Violation Rate | G-CTR Lift | Carbon Saved |
|------------------------|--------------------|------------|--------------|
| -1% | 12% | +15 pp | 45% |
| -3% | 6% | +12 pp | 42% |
| -5% | 2% | +10 pp | 40% |
| -10% | 0% | +6 pp | 32% |

---

## 5. Simulation Setup Numbers

If you run simulations before user studies:

| Parameter | Value | Justification |
|-----------|-------|---------------|
| Number of simulated users | 1,000 | Statistical power |
| Queries per user | 200 | Convergence observed by ~100 |
| Number of actions | 3 | Boost levels: 0 (none), 1 (moderate), 2 (aggressive) |
| Context dimension | 8–12 | Query embedding (4), domain features (3), carbon intensity (1), time (1), user history (3) |
| Reward structure | Click = 1, No click = 0 | Binary reward |
| Carbon ground truth | Synthetic + real from Green Web API | Mix for robustness |
| Baseline SERP | Top 10 from Google/Bing API | Realistic |

---

## 6. User Study Statistics (if human subjects)

| Measure | Value |
|---------|-------|
| Number of participants | 100 (power analysis) |
| Queries per participant | 50 (5 sessions of 10 queries) |
| Total observations | 5,000 |
| Within-subjects design | Each user sees Baseline and Policy (interleaved) |
| Order balancing | Latin square |
| Pre-study questionnaire | Green concern score (1-7 Likert) |
| Post-study questionnaire | SUS, perceived greenness, trust |

---

## 7. Novelty Evidence Numbers (to highlight in paper)

| Novelty Claim | Quantitative Evidence to Report |
|---------------|--------------------------------|
| First client-side carbon-aware SERP bandit | Zero network data transfer; <10 KB storage |
| Click-based reward learning | Convergence within 100 queries; regret vs random |
| Relevance guardrail | CTR drop <5% with 95% confidence |
| Neural bandit improvement | 15% lower carbon exposure than linear bandit |
| Carbon forecasting integration | 8% additional carbon reduction vs static scores |

---

**Use this as your experimental measurement checklist.** Implement the metrics, generate the plots, run the statistical tests, and populate the tables from your simulation and/or user study data.
