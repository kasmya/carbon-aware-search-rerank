# Adaptive Carbon‑Aware Search Re‑ranking with Contextual Bandits (Literature Review: r1–r18)

## 0. Scope, intent, and deliverable quality goals

This document is a **highly detailed literature review** meant to support writing a research paper for the proposed system:

> **Adaptive Carbon‑Aware Search Re‑ranking with Contextual Bandits**
>
> A client-side, privacy-preserving browser extension that re-ranks search results to increase users’ probability of clicking **green-hosted** websites, while preserving overall search relevance via explicit guardrails.

### Why this review exists
Your system sits at the intersection of three research areas:
1. **Sustainable digital systems** (carbon/energy-aware computing and web delivery)
2. **Sustainable information retrieval / ranking** (sustainable recommendation/reranking)
3. **Online personalization with privacy** (bandits, click-driven feedback loops, and client-side learning)

The r1–r18 papers cover (1) and (2) strongly, and (3) partially. The review therefore does two jobs:
- Extract and synthesize the most transferable design patterns from r1–r18.
- Provide a “gap map” that clearly justifies your novelty: *contextual bandit learning from SERP click feedback with privacy-preserving client-side adaptation and relevance preservation.*

### Deliverable constraint
This version is streamlined, deduplicated, and ready for direct use in a research paper.

---

## 1. Your idea (formal anchor)

### 1.1 Problem statement
Modern ranking systems prioritize relevance and engagement. However, websites have heterogeneous carbon footprints due to differing energy sources, workloads, and hosting designs. When search engines rank pages purely by relevance/CTR, users are indirectly exposed to higher-carbon destinations.

**Key research gap:** there is no widely adopted client-side system that:
- adaptively learns *how much* to promote greener destinations,
- does so per *domain/query context*,
- preserves relevance (no significant CTR degradation),
- is privacy-preserving (no raw queries/clicks leaving the device),
- provides transparency to maintain user trust.

### 1.2 Proposed system components (as needed for related work mapping)
- **Frontend extension** (Content script) intercepts SERPs.
- **Carbon scoring** per result via Green Web API or local estimator.
- **Re-ranking controller** using **contextual bandit**:
  - actions: boost levels (e.g., {0, +2, +5}) or continuous boosts discretized
  - context: query sensitivity features, domain history, user/session factors
  - reward: click-based green clicks / sustainable exposure with relevance constraints
- **Transparency UI**: badge + “why moved?”
- **Privacy model**: learning and storage are client-only (Chrome storage.local) and learning data never leaves the browser.

### 1.3 Core evaluation metrics needed for your paper
- **Green CTR (G‑CTR)** = clicks on green-hosted results / total clicks.
- **Overall CTR / relevance preservation (Overall CTR)** = total clicks / number of results shown (or impressions).
- **Carbon exposure** = expected carbon footprint (or carbon score) of clicked destinations.
- **Non-inferiority / relevance constraint**: e.g., Overall CTR loss ≤ δ (5%).
- **User satisfaction**: Likert and qualitative trust questions.

---

## 2. How the r1–r18 literature is interpreted

Most papers operate in one of these roles:
1. **Measurement & accounting** (how to estimate carbon)
2. **Evaluation frameworks** (how to measure trade-offs)
3. **Optimization & adaptation** (how to reduce carbon under constraints)
4. **Operational deployment principles** (how to implement in real systems)
5. **Reranking / recommendation** (how to alter output lists toward sustainability)

Your system is a hybrid of 1–5 with a specific controller choice (**contextual bandit**) and a specific interface (**SERP reranking in a browser extension**).

---

## 3. Master comparison table (r1–r18)

### Similarity score definition (0–5)
- **5**: direct match to sustainable reranking + adaptive/online feedback + user-centric reward.
- **4**: reranking/recommendation + sustainability utility, but no contextual bandit.
- **3**: sustainable evaluation/metrics enabling your measurement design.
- **2**: carbon-aware adaptation/optimization for web/ML systems but not ranking of search results.
- **1**: governance/awareness or indirect sustainable web practice.
- **0**: no clear linkage.

| r-index | Paper title/theme | Carbon signal used | Decision mechanism | Online adaptation | Privacy focus | Trade-off constraint concept | Publisher | Similarity (0–5) | What it teaches you (writing-ready) |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| r1 | Carbon Footprint‑Aware Recommenders for Greener Items | Item CO₂e / greenness scale | Utility-based reranking | Mostly static parameter tuning | None | Accuracy vs greenness utility | International Journal of Scientific Research in Computer Science, Engineering and Information Technology (IJSRCSEIT) | 4 | Reranking utility design: your “boost” is a special case of tunable utility blending. |
| r2 | Carbon Aware E‑Commerce measurement + eco-mode mitigation | SCI + grid intensity + RUM | Intervention switching (eco-mode) | Yes (region/time adaptive) | None | Emissions reduction without conversion/UX harm | International Journal of Scientific Research in Computer Science, Engineering and Information Technology (IJSRCSEIT) | 2 | Shows how to perform real-world measurement and implement guardrails akin to relevance. |
| r3 | Carbon-aware evaluation metrics for recommenders (SDG-aligned) | Carbon/energy + social/econ metrics | Evaluation framework | No | None | Multi-objective trade-offs | Springer | 3 | Provides a metric taxonomy you can adapt into SERP metrics (G‑CTR, carbon exposure). |
| r4 | Carbon-aware neural architecture search (CAS-NAS) | Inference energy + temporal carbon intensity | Multi-objective search + runtime adaptation | Yes | None | Accuracy vs energy/carbon | Engineering Science and Technology, an International Journal | 2 | Pattern: multi-objective optimization with runtime selection under carbon forecasts. |
| r5/r11 | Clover: carbon-aware ML inference with mixed models + GPU partitioning | Inference energy + latency SLA | Online config selection | Yes | None | Latency SLA + accuracy loss bounds | MIT Open Access Articles / ACM (The International Conference for High Performance Computing, Networking, Storage and Analysis) | 2 | Template for constraints + tail-latency-aware switching; analogous to relevance guardrails. |
| r6 | Carbon-aware continuous learning (CCL) | Operational carbon from retraining | RL reconfiguration policy | Yes | None | Accuracy vs carbon under drift | ACM (ISBN 979-8-4007-2212-7) | 2 | Pattern: feedback-driven adaptive policies under carbon constraints. |
| r7 | AI‑CARE reporting framework | FLOPs/memory/static power → CO₂ | Reporting/score curves | No | None | Carbon–performance trade-off reporting | arXiv | 1–2 | Helps you justify measurement methodology and reporting structure. |
| r8 | Agile pathway toward carbon-aware clouds | Organizational/operational principles | Governance + workflow | Indirect | None | Actionable visibility + configurability | ACM (HotCarbon ’23) | 1 | Helps deployment narrative: how to operationalize extension-level eco policies. |
| r9 | Green SEO literature review | Energy/carbon effects of web design | Review (not policy) | No | None | SEO relevance vs sustainability | Technische Sicherheit (ISSN 1434-9728/2191-0073) | 1 | Indirect support: sustainable UX can preserve discovery quality. |
| r10 | CASPER carbon-aware scheduling/routing | Carbon intensity + latency SLO | Routing/provisioning optimization | Yes | None | Latency SLO vs carbon | MIT Open Access Articles / ACM (The International Conference for High Performance Computing, Networking, Storage and Analysis) | 2 | Conceptual bridge: “routing attention” to greener endpoints with performance constraints. |
| r12 | GreenShield low-carbon cybersecurity | Energy + carbon forecast scheduling | Multi-mechanism optimization (may include FL) | Indirect | Possibly FL-related privacy, but not user-click privacy | Accuracy vs energy/carbon | Nature Scientific Reports | 1 | Shows combining learning + carbon-aware scheduling in security systems. |
| r13 | Carbon-aware resource allocation with renewable availability (CAC) | Renewable availability + carbon intensity | Carbon-aware scheduling in distributed compute | Yes | None | Latency vs emissions trade-offs; job flexibility classes | European Journal of Computer Science and Information Technology (European Centre for Research Training and Development - UK) | 2 | Gives a scheduling/assignment analogy: when flexibility exists, align work with low-carbon windows. |
| r14 | Top-K ranking deep contextual bandits for information selection | Relevance / reward from user feedback | Contextual multi-armed bandit for top-K selection with deep reward approximation | Yes (online learning) | None | Regret minimization; optimal top-K under reward complexity | arXiv:2201.13287v1 | 4 | Defines top-K selection as bandit ranking, directly mapping to your “boost levels” as arms. |
| r15 | LLMs-augmented contextual bandit | Reward from bandit feedback; LLM context embeddings | Contextual bandit with LLM latent encoding | Yes (improves cumulative reward) | None | Regret/cumulative reward optimization | arXiv:2311.02268v1 | 4 | Supports richer contextual features (LLM embeddings) while staying within bandit learning. |
| r16 | Trust-Aware Federated User Representation Learning for Privacy-Preserving and Carbon-Optimized Personalized Recommendation | Carbon-aware federated optimization + carbon budgets | Trust-aware federated aggregation + carbon-budget-constrained optimization | Yes (adaptive trust weighting) | Privacy via encrypted updates / federated learning | Communication/energy–accuracy trade-offs under carbon budgets | Springer (DOI: 10.1007/s44230-026-00145-6) | 2 | Provides privacy + carbon-aware personalization template that inspires client-side privacy narratives. |
| r17 | Exploring the Benefits of Carbon-Aware Routing (CATE) | Link carbon intensity + dynamic router power | Carbon-aware traffic engineering heuristic | Indirect | None | Limits/optimizes carbon via link-cost definitions | Zenodo (DOI: 10.5281/zenodo.10035068) | 1 | Supports the “routing attention to greener endpoints” analogy. |
| r18 | Carbon-Aware AI Control Plane for DevOps Automation | Predictive carbon intelligence + temporal decision logic | Carbon-aware control-plane for autoscaling/deployment | Yes | None (org-level governance) | Policy-defined sustainability guardrails | IEEE ACCESS (DOI: 10.1109/ACCESS.2026.3656467) | 1 | Strengthens deployment/governance narrative: sustainability as a first-class control input with guardrails. |

---

## 4. Detailed analysis by paper (r1–r18)

### r1 — Towards Carbon Footprint‑Aware Recommender Systems for Greener Item Recommendation

**Contribution summary:** Introduces sustainability-aware recommendation with item-level carbon footprint, evaluates conventional recommenders, and proposes reranking to trade off relevance vs greenness.

**Why central:** Closest functional analogy – your SERP reranking is like recommender reranking.

**Transferable pattern:** Utility blending with tunable λ. Your adaptation: bandit learns λ per context.

**Gap:** λ fixed offline, no bandit, no privacy.

**Writing template:** “Carbon-aware reranking has been explored in recommendation settings (r1) with static trade-offs. Our work extends this by learning the trade-off online with contextual bandits, preserving relevance via guardrails and privacy via client-side learning.”

---

### r2 — Carbon Aware E‑Commerce: measurement and abatement of web emissions

**Contribution:** Uses SCI + RUM to estimate emissions, applies eco-modes based on grid intensity, evaluates with field experiments.

**Transferable pattern:** Operational “eco-mode” with guardrails (no UX harm) → your relevance guardrail.

**Gap:** Not SERP ranking, no bandit.

**Writing template:** “r2 shows carbon-aware front-end interventions can reduce emissions without harming UX. Our work applies similar guardrails to SERP reranking, but learns optimal interventions via contextual bandits.”

---

### r3 — Carbon-aware evaluation metrics for recommender systems

**Contribution:** SDG-aligned sustainability metrics for recommender evaluation.

**Transferable pattern:** Metric taxonomy – AvgCarF → your carbon exposure, GIRec → your G‑CTR.

**Gap:** No adaptive decision-making.

**Writing template:** “r3 motivates explicit sustainability metrics. We adopt parallel evaluation: G‑CTR for green outcomes, Overall CTR for relevance, and expected carbon exposure per click.”

---

### r4 — Carbon-aware neural architecture search (CAS-NAS)

**Contribution:** Multi-objective NAS optimizing accuracy, energy, and carbon, including temporal grid effects.

**Transferable pattern:** Multi-objective optimization + runtime carbon-aware selection.

**Gap:** No click feedback, no SERP reranking.

**Writing template:** “While r4 optimizes architecture selection, our bandit similarly balances green clicks and relevance, picking boost actions conditioned on context and carbon intensity.”

---

### r5/r11 — Clover: carbon-aware ML inference

**Contribution:** Dynamic selection of model quality and GPU partitioning under latency SLA to reduce carbon.

**Transferable pattern:** Constraint-driven adaptive switching – latency SLA maps to your relevance guardrail (Overall CTR loss ≤ δ).

**Writing template:** “Clover demonstrates adaptive decisions under explicit constraints. Our bandit must satisfy a relevance non-inferiority constraint, analogous to Clover’s tail-latency SLA.”

---

### r6 — Carbon-Aware Continuous Learning (CCL)

**Contribution:** RL-based reconfiguration of retraining parameters under drift, optimizing accuracy vs carbon.

**Transferable pattern:** Feedback-driven adaptive policy with measurable reward.

**Gap:** Not browser ranking.

**Writing template:** “r6 provides a template for online policy learning under carbon constraints. We adopt a simpler contextual bandit for SERP reranking, focusing on per‑query boost decisions.”

---

### r7 — AI‑CARE: standardized carbon-aware evaluation metric for AI models

**Contribution:** Measurement framework using FLOPs, memory access, and grid intensity.

**Transferable pattern:** Reporting discipline – compute cost estimation, carbon conversion, transparency.

**Writing template:** “We follow r7’s methodology to estimate the carbon overhead of our extension’s scoring and learning, ensuring that the sustainability benefit outweighs the cost.”

---

### r8 — Agile Pathway Towards Carbon-aware Clouds

**Contribution:** Governance principles: federated responsibility, actionable visibility, configurable optimizations.

**Transferable pattern:** Deployment narrative – tooling and operational integration.

**Writing template:** “r8 emphasizes that sustainability requires operational tooling. Our extension implements visibility via a transparency UI and configurable privacy‑preserving learning.”

---

### r9 — Green SEO (SLR on sustainable web practices and SEO)

**Contribution:** Review of sustainable web practices and SEO.

**Transferable pattern:** Sustainability can be compatible with discovery.

**Writing template:** “r9 supports the argument that sustainable design does not inherently harm user-facing performance, which underpins our goal of preserving relevance while promoting greener hosts.”

---

### r10 — CASPER: carbon-aware scheduling & provisioning

**Contribution:** Carbon-aware routing and provisioning under latency SLOs.

**Transferable analogy:** “Routing attention” to greener endpoints – your SERP reranking is attention routing.

**Writing template:** “CASPER routes requests to greener regions; our extension routes user attention to greener search results using ranking as the control knob.”

---

### r12 — GreenShield: low-carbon cybersecurity

**Contribution:** Integrates energy-efficient detection, lightweight crypto, distributed learning, and carbon‑aware scheduling.

**Transferable pattern:** Combining carbon-aware scheduling with ML learning.

**Gap:** Not SERP reranking, privacy focus differs.

**Writing template:** “GreenShield shows that carbon-aware scheduling can be combined with adaptive learning. We apply this insight to SERP reranking, scheduling ‘boosts’ based on carbon intensity and user context.”

---

### r13 — Carbon-Aware Resource Allocation (CAC)

**Contribution:** Schedules flexible workloads into low-carbon windows using renewable forecasts and Kubernetes plugins.

**Transferable patterns:**
1. Carbon-aware signals + forecasting.
2. Action selection under constraints (latency → relevance).
3. Class-based flexibility (CAC class → boost level discretization).

**Writing template:** “r13’s carbon-aware scheduling classes inspire our discretization of boost levels. Just as flexible workloads are delayed to greener windows, our bandit selects boost levels conditioned on query context and carbon intensity.”

---

### r14 — Top-K Ranking Deep Contextual Bandits for Information Selection Systems

**Contribution:** Top‑K ranking under contextual multi‑armed bandit (CMAB) with deep reward approximation, selecting an ordered subset of K items.

**Transferable patterns:**
1. Top‑K as action outcome – your SERP reranking outputs a ranked list.
2. Context-conditioned reward learning – click feedback provides reward.
3. Neural reward approximation for non‑linear mappings.

**Writing template:** “Unlike standard bandits that select a single arm, r14’s top‑K CMAB directly matches our SERP reranking, where multiple results are reordered. We map each boost policy to a bandit arm and learn from click‑driven rewards.”

---

### r15 — LLMs-augmented Contextual Bandit

**Contribution:** Uses LLM encoders to map context to dense embeddings, improving bandit performance.

**Transferable patterns:**
1. Richer context representations – query text, snippet semantics, domain features.
2. Bandit remains the controller – LLMs only enhance context.
3. Evaluation via cumulative reward/regret.

**Writing template:** “r15 enriches contextual bandits with LLM embeddings. We adopt this to handle high‑dimensional SERP features (query, snippets, domains) while keeping the bandit as the online learning engine, preserving privacy through client‑side execution.”

---

### r16 — Trust-Aware Federated User Representation Learning (TA-FURL)

**Contribution:** Federated recommendation with trust inference, carbon budgets, and encrypted aggregation.

**Transferable patterns:**
1. Privacy-preserving learning under carbon budgets.
2. Trust-weighted aggregation → client‑side confidence weighting.
3. Representation learning for stable reward estimation.

**Writing template:** “r16 integrates privacy and carbon constraints in a federated setting. Our client‑side bandit similarly enforces a relevance guardrail (carbon budget analogue) and uses local learning to protect user data without raw click sharing.”

---

### r17 — Exploring the Benefits of Carbon-Aware Routing (CATE)

**Contribution:** Carbon-aware link‑cost metrics for routing, combining carbon intensity and device power state.

**Transferable analogy:** Define “cost” as carbon footprint; routing → ranking.

**Writing template:** “r17 treats carbon as a first‑class routing cost. We treat SERP reranking as routing user attention, where the ‘destination cost’ is the expected carbon of the clicked page.”

---

### r18 — Carbon-Aware AI Control Plane for DevOps Automation

**Contribution:** Reference architecture with carbon‑aware control plane, predictive intelligence, and policy‑defined guardrails.

**Transferable patterns:**
1. Control plane + guardrails framing – your bandit is a control loop with relevance constraints.
2. Temporal/policy‑based sustainability logic.

**Writing template:** “r18’s control plane with guardrails inspires our system design: the contextual bandit acts as a control loop that optimizes for green clicks while satisfying a relevance non‑inferiority constraint, validated via client‑side metrics.”

---

## 5. Summary of gaps and your novelty

| Area | Existing work (r1–r18) | Your novelty |
|------|------------------------|--------------|
| Sustainable reranking | Static λ trade-offs (r1) | Online learning of λ via contextual bandit |
| Carbon-aware adaptation | Scheduling, routing, inference (r4, r5, r10, r13) | SERP‑level attention routing with click feedback |
| Privacy | Federated learning (r16) but not click‑level | Client‑only bandit learning, no raw data leaves browser |
| Relevance guardrails | Latency/accuracy constraints (r5, r6, r13) | Explicit non‑inferiority test on Overall CTR |
| User transparency | Limited | UI badge + explanation of reranking decisions |

Your system is the **first** to combine: **contextual bandit + SERP reranking + client‑side privacy + relevance guardrails** for carbon‑aware search.
