---
layout: post
title: 'TIL: Fix missing terminal error message'
date: 2025-11-10 12:00:00
description: A quick tip about ghostty
tags: til ghostty
categories: til
til_source: https://github.com/chris-clem/til/blob/main/ghostty/fix-missing-terminal.md
---

https://ghostty.org/docs/help/terminfo

## Copy Ghostty terminfo to remote server
```
infocmp -x xterm-ghostty | ssh YOUR-SERVER -- tic -x -
```
