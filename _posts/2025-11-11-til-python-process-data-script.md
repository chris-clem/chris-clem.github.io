---
layout: post
title: 'TIL: Template data processing script with pathlib, fire, joblib, loguru, and tqdm'
date: 2025-11-11 12:00:00
description: A quick tip about python
tags: til python
categories: til
til_source: https://github.com/chris-clem/til/blob/main/python/process-data-script.md
---

Template script for processing data with packages I am using most often.

I have added it as a Raycast snippet `@script`


```python
from pathlib import Path

import fire
from joblib import Parallel, delayed
from loguru import logger
from tqdm import tqdm

# Setup logger to work with tqdm
logger.remove()
logger.add(lambda msg: tqdm.write(msg, end=""), colorize=True)


def main(
    n_jobs: int = 1,
):
    """Process data."""
    # Setup
    data_dir = Path.home() / "data"
    sample_paths = sorted(data_dir.iterdir())

    logger.info(f"Found {len(sample_paths)} samples to process")

    # Parallel processing with joblib
    results = Parallel(n_jobs=n_jobs)(
        delayed(process)(sample_path)
        for sample_path in tqdm(sample_paths, desc="Processing samples")
    )

    results = [result for result in results if result is not None]

    logger.success(f"Processed {len(results)} samples")


def process(
    sample_path: Path,
):
    """Process a sample."""
    logger.debug(f"Processing {sample_path}")
    raise NotImplementedError


if __name__ == "__main__":
    fire.Fire(main)

```
