---
layout: post
title: 'TIL: Manage GCP Buckets'
date: 2025-11-10 12:00:00
description: A quick tip about gcp
tags: til gcp
categories: til
til_source: https://github.com/chris-clem/til/blob/main/gcp/manage-gcp-buckets.md
---

[https://docs.cloud.google.com/sdk/docs/install-sdk](https://docs.cloud.google.com/sdk/docs/install-sdk)

## Create bucket
```
gcloud storage buckets create gs://$BUCKET_NAME
```

## Transfer files to bucket
```
gcloud storage rsync -r ./local_dir gs://$BUCKET_NAME
```

## List buckets
```
gcloud storage ls
```
