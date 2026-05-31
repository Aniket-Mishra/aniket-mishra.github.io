---
title: Why Continual Learning Is Harder Than It Looks
date: 2026-05-30
summary: Neural networks forget. Here is why that happens, and why the obvious fixes do not work.
---

A model that learns one task and then learns a second task tends to forget the first. This is called catastrophic forgetting. It sounds like a bug. It is closer to a law.

## The setup

Train a network on task A. It does well. Now train the same network on task B without showing it task A again. Performance on B climbs. Performance on A falls off a cliff.

The weights that encoded task A get overwritten by gradients that only care about task B. The optimizer has no reason to protect the past. It minimizes the loss in front of it, and nothing else.

## Why the obvious fix fails

The first idea everyone has is simple. Just keep all the old data and retrain on everything.

This works. It also defeats the point. If you have to store every example you have ever seen and retrain from scratch each time, you do not have a model that learns continually. You have a model that restarts continually. The cost grows without bound.

Real continual learning asks for something harder. Learn from a stream. Keep what matters. Do it without holding the whole past in memory.

## The three families of approaches

Most methods fall into one of three camps.

1. **Regularization.** Add a penalty that discourages changing weights the old task relied on. Elastic Weight Consolidation is the classic example. It estimates which weights were important and anchors them.
2. **Replay.** Keep a small, smart sample of old data, or generate fake old data, and mix it into new training. The trick is choosing what to keep.
3. **Architecture.** Give each task its own slice of the network. Freeze the old slices. This avoids forgetting but the model grows with every task.

None of these is free. Regularization slows learning of new tasks. Replay needs storage and good sampling. Architecture methods balloon in size.

> The hard part is not stopping forgetting. The hard part is stopping forgetting while still learning fast and staying small.

## Where I find this interesting

I spent years building anomaly detection for wind and solar assets. The world those models lived in kept changing. New hardware. New failure modes. New seasons. A model frozen at training time slowly goes stale.

Continual learning is the honest version of that problem. Not "train once and deploy forever," but "keep learning from what arrives." I think the next wave of useful systems will be the ones that handle this well, rather than the ones that score highest on a fixed test set.

More on the methods in a later post.
