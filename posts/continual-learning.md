---
title: Why continual learning is hard
date: 2026-05-30
summary: A model that learns a new task tends to forget the old one. Here is what causes that and why the common fixes each cost something.
---

In many real systems, data arrives over time and the task changes with it. A task here means one learning problem, defined by its training data and its prediction target. A model has to keep learning new tasks as they come. This is the setting of continual learning.

The central problem is catastrophic forgetting. It happens when training on a new task lowers performance on tasks the model already learned. The cause is simple. The same parameters are reused for every task, so the gradient updates for the new task overwrite weights that mattered for the old ones. The optimizer minimizes the loss in front of it. It has no term that protects the past.

## The obvious fix, and what it costs

The first idea most people have is to keep all the old data and retrain on everything. This works. It also removes the point. If you store every example you have seen and retrain from scratch each time, you do not have a model that learns continually. You have a model that restarts. The cost grows with every task.

Continual learning asks for something stricter. Learn from a stream of tasks. Keep what matters. Do it without holding the full past in memory, and often without knowing the task identity at test time.

## Three ways people reduce forgetting

Most methods fall into one of three groups.

Replay-based methods reuse data from earlier tasks. They store a small set of past examples in a buffer, or generate synthetic ones, and mix them into current training. The open question is what to keep. The buffer grows with the number of tasks unless you cap it, and storing raw data is not allowed in some privacy-constrained settings.

Architectural methods give each task its own parameters. They add a module per task and freeze the old ones, so a new task cannot overwrite earlier weights. This reduces forgetting directly, but the parameter count grows with the number of tasks, and some variants need the task identity at test time.

Regularization-based methods constrain how much the important weights can change. Elastic Weight Consolidation is the standard example. After a task, it estimates an importance score for each weight and penalizes large changes to the important ones during later training. The importance estimate is approximate, and the strength of the penalty is set by hand rather than learned.

None of these is free. Each one trades memory, model size, or accuracy on new tasks for less forgetting.

## The part I work on

My thesis takes a different angle. Instead of designing the update rule by hand, you can learn it. A learned optimizer is a small network trained to produce the parameter updates for another network. It replaces a fixed rule like SGD or Adam with a function trained across many tasks.

Recent work combines this with continual learning: a meta-optimizer trained offline that predicts selective updates, large updates for the weights that matter on the current task, small updates elsewhere. It reduces forgetting without a replay buffer or added modules. The limit is scale. When the optimizer works on individual weights, its design is tied to one model shape, so it does not transfer cleanly to larger architectures.

My work changes the unit. The optimizer operates on blocks of parameters rather than single weights, which makes it architecture-agnostic, and it scales the update per block by how important that block is. The full results go in the thesis. More on the method in a later post.