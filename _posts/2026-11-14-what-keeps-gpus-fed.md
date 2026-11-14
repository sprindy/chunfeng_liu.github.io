---
layout: article
title: "AI Jargon 101 — Episode 8: GPUs get the attention. But what keeps them fed? 🧠"
date: 2026-11-14 18:05:00 +0800
series: ai-jargon-101
topic: AI Jargon 101
reading_layout: true
reading_label: AI Jargon 101 · Episode 8
reading_title: "GPUs get the attention. But what keeps them fed? 🧠"
description: "How SRAM, HBM, DDR, and storage work together to keep AI accelerators supplied with data."
---

<div class="perspective-contents" role="navigation" aria-label="On this page">
  <strong>On this page</strong>
  <ul>
    <li><a href="#image-1-meet-the-different-types">Image 1: Meet the different types.</a></li>
    <li><a href="#why-does-hbm-matter-so-much-for-ai">Why does HBM matter so much for AI?</a></li>
    <li><a href="#image-2-put-them-together-inside-an-ai-factory">Image 2: Put them together inside an AI factory.</a></li>
  </ul>
</div>

In my previous post, I explored the processors behind AI. This time, let’s look at the memory and storage supporting them.

## 📷 Image 1: Meet the different types.
{: #image-1-meet-the-different-types }

{% include perspective-figure.html src="/assets/blog/ai-jargon-101/ai-memory-and-storage.jpg" alt="Comparison of SRAM, HBM, DDR, NAND flash, and SSD storage." caption="The roles of SRAM, HBM, DDR, NAND flash, and SSDs" %}

- **SRAM** — Small, extremely fast memory inside processors, used for caches and local working buffers.
- **HBM** — High Bandwidth Memory: stacked DRAM packaged beside an accelerator, delivering large amounts of data to its compute engines.
- **DDR** — The main working memory used by CPUs in many servers and PCs.
- **NAND flash** — The technology that retains data without power.
- **SSD** — A complete storage device built with NAND, a controller and firmware.

A useful distinction: **NAND is a component; an SSD is the device.**

## 🔍 Why does HBM matter so much for AI?
{: #why-does-hbm-matter-so-much-for-ai }

A powerful GPU needs enough memory to hold its working data—and enough bandwidth to access it quickly.

HBM provides a wide data interface close to the processor. It is widely used in AI accelerators and high-performance computing, although it isn’t exclusive to AI or GPUs.

**Larger models generally require more memory at the same numerical precision.** Training needs additional space for gradients, optimizer states and intermediate results. During inference, longer contexts and more simultaneous requests also increase memory demand.

HBM has a manufacturing trade-off, too. Micron has reported that **HBM3E requires approximately three times the wafer supply of DDR5 to produce the same number of bits at the same manufacturing node.** This compares production requirements—not SRAM or retail prices.

**Combined with surging AI demand, that greater manufacturing requirement contributes to broader DRAM shortages.** As manufacturers allocate more capacity to HBM, less remains available for conventional memory used in servers, PCs and smartphones. HBM demand is one contributor alongside growing demand for other memory products and limits on factory expansion.

## 📷 Image 2: Put them together inside an AI factory.
{: #image-2-put-them-together-inside-an-ai-factory }

{% include perspective-figure.html src="/assets/blog/ai-jargon-101/memory-inside-an-ai-factory.jpg" alt="How data moves through storage, CPU memory, GPU HBM, and on-chip SRAM during model training." caption="How data moves through an AI training system" %}

Imagine training a model:

1. Optional **HDD storage** holds bulk datasets and backups, with active data staged to faster storage when needed.
2. **Networked flash and local SSDs** serve datasets and model files.
3. **CPUs and DDR memory** prepare data and coordinate work.
4. Data moves into **GPU HBM**, where model weights and working data reside.
5. **On-chip SRAM** keeps frequently accessed data close to computation.
6. Training checkpoints are saved back to persistent storage.

Supported GPU Direct Storage paths can transfer data directly from storage into GPU memory, avoiding a CPU-memory bounce buffer.

Coming from embedded software and sensors, I’ve seen how memory constraints shape a system. AI infrastructure brings that same challenge to a much larger scale.

**Capacity determines how much fits. Bandwidth determines how quickly data moves. Both matter for AI.**

#AIJargon101 #AIInfrastructure #HBM #Semiconductors #DataCenters

[Original LinkedIn post](https://www.linkedin.com/posts/caleb-liu-6a361011a_aijargon101-aiinfrastructure-hbm-activity-7505630351818526720-FJjq)
