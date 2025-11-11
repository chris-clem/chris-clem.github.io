---
layout: post
title: 'TIL: Template data exploration Jupyter notebook'
date: 2025-11-11 12:00:00
description: A quick tip about python
tags: til python
categories: til
til_source: https://github.com/chris-clem/til/blob/main/python/explore-data-jupyter-notebook.md
---

Template Jupyter notebook for exploring data.

I have added it as a Raycast snippet `@notebook`

In VSCode/ Windsurf/ Cursor, create a new file called `explore_data.txt` and copy the content below or use the Raycast snippet, then rename it to `explore_data.ipynb`.

```json
{
    "cells": [
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "# Explore Data"
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "## Imports"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": null,
            "metadata": {},
            "source": [
                "from pathlib import Path\n",
                "\n",
                "import matplotlib.pyplot as plt\n",
                "import numpy as np\n",
                "import pandas as pd\n",
                "import seaborn as sns\n",
                "\n",
                "sns.set_style('whitegrid')\n"
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "## Paths & Settings"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": null,
            "metadata": {},
            "source": [
                "DATA_DIR = Path.home() / \"data\""
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "## Load Data"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": null,
            "metadata": {},
            "source": [
                "df = pd.read_csv(DATA_DIR / \"data.csv\")\n",
                "\n",
                "df"
            ]
        }
    ],
    "metadata": {
        "language_info": {
            "name": "python"
        }
    }
}
```
