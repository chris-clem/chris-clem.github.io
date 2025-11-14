---
layout: post
title: 'TIL: Multi-node GPU training with SkyPilot and PyTorch Lightning'
date: 2025-11-13 12:00:00
description: A quick tip about skypilot
tags: til skypilot
categories: til
til_source: https://github.com/chris-clem/til/blob/main/skypilot/multi-node-gpu-training.md
---

References:
- https://docs.skypilot.co/en/latest/examples/training/distributed-pytorch.html#using-normal-torchrun
- https://lightning.ai/docs/pytorch/stable/common/trainer.html#

## 1. Configure the PyTorch Lightning Trainer for multi-node training
E.g. on 8 nodes with 8 GPUs each (64 GPUs total):

```python
trainer = Trainer(accelerator="gpu", devices=8, num_nodes=8, strategy="ddp")
```

## 2. Launch SkyPilot cluster with multiple GPU nodes
```bash
sky launch -c train train.yaml
```

SkyPilot config file (`train.yaml`):

```yaml
resources:
    accelerators: H100:8
    disks: 1TB

num_nodes: 8

setup: |
    # Download data
    # Install dependencies

run: |
    MASTER_ADDR=$(echo "$SKYPILOT_NODE_IPS" | head -n1)
    echo "Starting distributed training, head node: $MASTER_ADDR"

    # Explicit check for torchrun
    if ! command -v torchrun >/dev/null 2>&1; then
        echo "ERROR: torchrun command not found" >&2
        exit 1
    fi

    torchrun \
    --nnodes=$SKYPILOT_NUM_NODES \
    --nproc_per_node=$SKYPILOT_NUM_GPUS_PER_NODE \
    --master_addr=$MASTER_ADDR \
    --master_port=8008 \
    --node_rank=${SKYPILOT_NODE_RANK} \
    train.py
```
