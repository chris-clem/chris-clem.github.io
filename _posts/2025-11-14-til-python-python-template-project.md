---
layout: post
title: 'TIL: Python Template Project'
date: 2025-11-14 12:00:00
description: A quick tip about python
tags: til python
categories: til
til_source: https://github.com/chris-clem/til/blob/main/python/python-template-project.md
---

## 1. Initialize project as a uv packaged application
```bash
uv init --package project-name
```

## 2. Create venv by running it
```bash
cd project-name
uv run project-name
```

## 3. Add dependencies to `pyproject.toml` and install them
```bash
uv add fire joblib loguru tqdm
```

## 4. Add pre-commit hooks

Create a `.pre-commit-config.yaml` file in the root of your project with the following content:

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v6.0.0
    hooks:
      - id: check-added-large-files
        args: ['--maxkb=1000']
      - id: check-ast
      - id: check-builtin-literals
      - id: check-json
      - id: check-merge-conflict
      - id: check-toml
      - id: check-yaml
      - id: detect-private-key
      - id: end-of-file-fixer
      - id: mixed-line-ending
        args: ['--fix=lf']
      - id: pretty-format-json
        args: ['--autofix']
      - id: trailing-whitespace
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.14.5
    hooks:
      - id: ruff-check
        args: [--fix]
      - id: ruff-format

```

Install them by running:

```bash
uv add --dev pre-commit
uv run pre-commit install
```

Run them on all files:

```bash
git add .
uv run pre-commit run --all-files
git commit -m "Initial commit"
```

Add pre-commit GitHub Action by creating a file `.github/workflows/pre-commit.yml` with the following content:

```yaml
name: pre-commit

on:
  pull_request:
  push:
    branches: [main]

jobs:
  pre-commit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: pre-commit/action@v3.0.1
```
