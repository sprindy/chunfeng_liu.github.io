---
title: What cost per token leaves out
topic: AI infrastructure
series: ai-in-perspective
description: How to compare inference options against the economics of a real workflow.
---
Cost per million tokens is a useful unit for comparing inference prices. A product decision also depends on the amount of work users get out of those tokens.

## A simple comparison

Suppose model A costs $0.01 per attempt and model B costs $0.015. In an illustrative test of 100 independent tasks with one attempt per task, A completes 50 successfully and B completes 90. A costs $1.00 in total, or $0.020 per successful task. B costs $1.50, or roughly $0.017 per successful task. This excludes latency, human review, and the cost of resolving failed tasks.

## What I’d measure next

I’d run both models on the same representative tasks and define success before testing. I’d record input and output tokens, retries, tool calls, review time, and latency. Then I’d compare cost per completed task alongside failure rates and tail latency. For a workflow with a meaningful human review step, the cost of that review belongs in the comparison.
