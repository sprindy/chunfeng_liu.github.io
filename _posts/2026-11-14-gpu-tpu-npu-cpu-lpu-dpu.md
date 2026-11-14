---
layout: post
title: "AI Jargon 101 — Episode 6: GPU, TPU, NPU, CPU, LPU, DPU… why so many “PUs”? 🤔"
date: 2026-11-14 18:03:00 +0800
series: ai-jargon-101
topic: AI Jargon 101
---

We often talk about AI models as the “brain.” But what hardware actually runs them?

Coming from embedded software, I find it useful to think of these processors as a team with different responsibilities.

![Illustrated comparison of the CPU, GPU, TPU, NPU, LPU, and DPU and their roles in AI systems.]({{ '/assets/blog/ai-jargon-101/gpu-tpu-npu-cpu-lpu-dpu.jpg' | relative_url }})

## 🧠 CPU — The orchestrator

Central Processing Unit.

Runs the software, schedules work, and coordinates accelerators. It can run AI models too.

Best for: general-purpose tasks and control logic.

Examples: Intel Xeon, AMD EPYC.

## 💪 GPU — The parallel engine

Graphics Processing Unit.

Originally developed for graphics, its ability to perform many calculations in parallel also makes it useful for AI.

Best for: large-model training and high-throughput inference.

Examples: NVIDIA Blackwell Ultra GPUs in GB300 systems, AMD Instinct MI455X.

## 🧮 TPU — Google’s AI specialist

Tensor Processing Unit.

Google’s custom accelerator for the tensor calculations behind neural networks.

Best for: training and serving models in Google’s AI ecosystem.

Example: Google Cloud TPU.

## 🔋 NPU — The efficient AI engine

Neural Processing Unit.

Accelerates neural networks with a focus on efficiency—particularly useful when battery life and heat matter.

Best for: on-device voice, vision, and AI assistants.

Examples: Apple Neural Engine, Qualcomm Hexagon NPU.

## ⚡ LPU — Groq’s inference specialist

Language Processing Unit.

Here, LPU refers to Groq’s architecture, designed for fast, predictable AI inference.

Best for: low-latency language-model responses.

And yes, Groq is different from xAI’s Grok!

## 🚦 DPU — The infrastructure engine

Data Processing Unit.

Offloads networking, storage, and security tasks, helping the rest of the system focus on its work.

Best for: moving and protecting data in data centers.

Example: NVIDIA BlueField.

## How do they fit together?

The CPU runs orchestration software. AI accelerators handle suitable computations. The DPU supports the surrounding data infrastructure.

A cloud system may use CPUs with GPUs, TPUs, or LPUs, depending on its design.

These names aren’t six neat, interchangeable categories. Some are broad processor types; others are vendor-specific. And one system doesn’t need all six.

“Best for” is a useful starting point—the actual choice also depends on the model, software support, memory, power, and cost.

Which “PU” would you like to explore next?

#AIJargon101 #AIInfrastructure #Semiconductors #EdgeAI

[Original LinkedIn post](https://www.linkedin.com/posts/caleb-liu-6a361011a_aijargon101-aiinfrastructure-semiconductors-activity-7505285708572409856-oWUU)
