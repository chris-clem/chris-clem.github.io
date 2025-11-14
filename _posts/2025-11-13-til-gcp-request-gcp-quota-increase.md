---
layout: post
title: 'TIL: Request GCP quota increase'
date: 2025-11-13 12:00:00
description: A quick tip about gcp
tags: til gcp
categories: til
til_source: https://github.com/chris-clem/til/blob/main/gcp/request-gcp-quota-increase.md
---

Taken from https://docs.skypilot.co/en/latest/cloud-setup/quota.html#gcp

1. In the Google Cloud Console, go to the [Quota page](https://console.cloud.google.com/iam-admin/quotas/).

2. Click *Filter* and select `Service: Compute Engine API`.

3. For H100 GPUs: choose `metric: GPUS_PER_GPU_FAMILY` and select dimension `gpu_family: NVIDIA_H100`.

4. For all other GPUs: choose `Limit Name: instance_name` (e.g., `NVIDIA-V100-GPUS-per-project-region`). You may check the [compute GPU list](https://cloud.google.com/compute/quotas#gpu_quota).

5. Select the checkbox of the region whose quota you want to change.

6. Click *Edit Quotas* and fill out the new limit.

7. Click *Submit Request*.
