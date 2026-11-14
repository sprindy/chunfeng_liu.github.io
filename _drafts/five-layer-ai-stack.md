---
title: The five-layer AI stack
topic: AI infrastructure
series: five-layer-ai-cake
description: A way to trace a product decision from the application all the way down to chips and power.
---
Jensen Huang’s five-layer framework starts with **energy**, then moves through **chips**, **infrastructure**, **models**, and **applications**. I use it to work backward from what a product promises to what its infrastructure must deliver.

1. **Applications** define the task and what the user values, such as a fast reply or a workflow with fewer manual steps.
2. **Models** shape what the application can do and the resources each request consumes.
3. **Infrastructure** determines how those models can be served through networking, cooling, scheduling, and other systems.
4. **Chips** provide compute and memory. The amount of work that can stay on each device affects how serving is designed.
5. **Energy** limits how much capacity can be installed and operated at a site.

## Applying it to a product decision

Consider a document assistant whose users are waiting too long for an initial response. If most of the delay comes from processing long input, sending a shorter, better-selected set of document excerpts could change the experience with the existing infrastructure. If requests spend most of their time in the serving queue, capacity or scheduling may be the better investment.

I would start by looking at the time to first token under realistic traffic, then break the delay into time spent waiting, retrieving data, and processing the prompt. That makes it easier to compare a product change with spending on more capacity.

[Source: Jensen Huang, *AI Is a 5-Layer Cake*](https://blogs.nvidia.com/blog/ai-5-layer-cake/)
