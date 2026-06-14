# Essential Numbers, Plots, and Statistics (Streamlined)

---

## 1. Core Numbers to Calculate

### 1.1 Primary Metrics (RQ1)

| Metric | Formula | Target |
|--------|---------|--------|
| **Overall CTR** | clicks / impressions | Δ ≥ -5% (non-inferior) |
| **G-CTR** | green clicks / total clicks | +15% relative increase |
| **Carbon Exposure per Query** | Σ (clicked_site_carbon_g) | ↓ ≥20% |

### 1.2 Bandit Learning Metrics (RQ2)

| Metric | What it tells you |
|--------|-------------------|
| **Cumulative Regret** | How much worse than optimal policy |
| **Convergence Step** | Queries until performance stabilizes |

### 1.3 Feasibility Metrics (RQ3)

| Metric | Requirement |
|--------|-------------|
| Storage per user | <10 KB |
| Inference latency | <50 ms |

### 1.4 Safety Metrics (RQ4)

| Metric | Threshold |
|--------|-----------|
| CTR violation rate | <5% of queries |

---

## 2. Simplified Statistical Tests

| RQ | Test | Success Criterion |
|----|------|-------------------|
| RQ1 | One-sided t-test (non-inferiority margin = -5%) | p < 0.05 |
| RQ1 (G-CTR) | Paired t-test | p < 0.05 |
| RQ2 | Bootstrap 95% CI for regret difference | CI does not include 0 |
| RQ4 | Binomial proportion test | p < 0.05 that violation rate <5% |

**Minimum data:** 1,500 queries, 50 users

---

## 3. Essential Plots (4 total)

| Plot | X-axis | Y-axis | Purpose |
|------|--------|--------|---------|
| **Regret Curve** | # queries | Cumulative regret | Compare Neural vs Linear bandit |
| **G-CTR over Time** | Query batch (50) | G-CTR (%) rolling avg | Show learning progression |
| **Pareto Frontier** | ΔOverall CTR (%) | ΔG-CTR (%) | Trade-off visualization |
| **Ablation Bar Chart** | Model variant | G-CTR lift (%) | Impact of each component |

---

## 4. Key Tables (3 total)

### Table 1: Main Results

| Metric | Baseline | Neural Bandit | Change |
|--------|----------|---------------|--------|
| Overall CTR (%) | 32.1 | 31.8 | -0.3% (ns) |
| G-CTR (%) | 12.4 | 22.3 | +9.9 pp* |
| Carbon (g/query) | 4.2 | 2.5 | -40%* |

* p < 0.05

### Table 2: Ablation

| Configuration | G-CTR (%) | CTR (%) |
|--------------|-----------|---------|
| Full model | 22.3 | 31.8 |
| – Neural (Linear) | 20.1 | 32.0 |
| – Carbon forecast | 19.2 | 31.5 |
| – Guardrail | 24.5 | 28.9 |

### Table 3: Query Category Breakdown

| Category | ΔCTR | ΔG-CTR (pp) |
|----------|------|-------------|
| News | -0.5% | +10 |
| Shopping | -0.8% | +11 |
| Informational | +0.2% | +10 |

---

## 5. Minimal Code Outputs Checklist
results/
├── metrics.csv (per-query: reward, regret, carbon)
├── plots/
│ ├── regret_curve.png
│ ├── gctr_over_time.png
│ ├── pareto.png
│ └── ablation.png
├── tables/
│ ├── main_results.tex
│ └── ablation.tex
└── stats_test_results.json
