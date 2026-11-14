---
layout: article
title: "The Five-Layer AI Cake — Layer 4: Models, the “Brains” 🧠"
date: 2026-11-14 18:07:00 +0800
series: five-layer-ai-cake
topic: The Five-Layer AI Cake
reading_layout: true
reading_label: The Five-Layer AI Cake · Layer 4
reading_title: Models, the “Brains” 🧠
description: "How falling inference costs, model benchmarks, and adoption data shape the choice of a language model."
---

<div class="perspective-contents" role="navigation" aria-label="On this page">
  <strong>On this page</strong>
  <ul>
    <li><a href="#inference-cost">Inference is getting cheaper</a></li>
    <li><a href="#choosing-a-model">The best model depends on the task</a></li>
    <li><a href="#frontier-models">How frontier models compare</a></li>
    <li><a href="#model-adoption">What usage data tells us</a></li>
  </ul>
</div>

Today, I’m excited to announce a new series: **The Five-Layer AI Cake 🍰**

I’m starting with **Layer 4 — Models: The “Brains” 🧠**

Chips provide computing power. Models turn that power into useful capabilities—understanding language, writing code, interpreting images and modeling the physical world.

For this post, I’m focusing on **language models**. Four things stand out:

## Inference is getting cheaper
{: #inference-cost }

Stanford’s 2025 AI Index reports that the price of achieving GPT-3.5-level performance on MMLU fell from **$20 to $0.07 per million tokens** between November 2022 and October 2024—**more than 280× cheaper**.

That compares a fixed performance threshold across models, rather than tracking one model’s price.

Cheaper AI can encourage more applications and heavier usage. This connects to **Jevons paradox**: efficiency gains can stimulate enough additional demand to increase total resource consumption.

**Lower unit costs can coexist with growing infrastructure demand.**

{% include perspective-figure.html src="/assets/blog/five-layer-ai-cake/models-1.jpg" alt="Reported inference prices and costs from 2022 to 2026, alongside usage growth and analyst forecasts." caption="Inference costs, demand growth, and the outlook" %}

## The best model depends on the task
{: #choosing-a-model }

Intelligence, speed and cost per task are different measures. A model that leads a reasoning benchmark may not be the fastest or most economical choice for routine work.

For a business, the useful question is: **Which model delivers the required quality, at an acceptable cost and response time?**

{% include perspective-figure.html src="/assets/blog/five-layer-ai-cake/models-3.jpg" alt="Artificial Analysis bar charts comparing model intelligence scores, output speed, and cost per task." caption="Artificial Analysis benchmarks for intelligence, speed, and cost per task" %}

## How frontier models compare
{: #frontier-models }

The benchmark snapshot below shows **US labs leading among the models displayed**, while **Chinese models are increasingly competitive**.

{% include perspective-figure.html src="/assets/blog/five-layer-ai-cake/models-2.jpg" alt="Artificial Analysis line chart showing benchmark scores over time for 14 model developers." caption="Frontier language model benchmark scores through September 2026" %}

## What usage data tells us
{: #model-adoption }

OpenRouter’s task chart shows where users spend money across writing, coding, agents and data tasks. It reveals usage patterns—not proof that the most-used model is technically best.

{% include perspective-figure.html src="/assets/blog/five-layer-ai-cake/models-4.jpg" alt="OpenRouter spending share across general, coding, agent, and data tasks." caption="OpenRouter spending by task, September 2026" %}

**My takeaway:** US labs remain strong at the frontier, while Chinese open-weight models are narrowing capability gaps and gaining adoption.

But **token share and revenue share are different**. Menlo’s 2025 enterprise LLM API market estimate puts Anthropic at **40%** and OpenAI at **27%—67% combined**. That is a specific enterprise-market estimate, not global AI revenue share.

For companies adopting AI, **choosing and evaluating the right model for each task** matters more than following one leaderboard.

Which matters most when choosing an AI model for your work: **quality, speed, cost, ecosystem and integrations, safety and reliability, data privacy, or deployment control?**

#AIJargon101 #AIModels #AIInfrastructure #GenerativeAI

[Original LinkedIn post](https://www.linkedin.com/posts/caleb-liu-6a361011a_aijargon101-aimodels-aiinfrastructure-ugcPost-7507442108442697728-I0v8/)
