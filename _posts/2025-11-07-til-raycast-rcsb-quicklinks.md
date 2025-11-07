---
layout: post
title: "TIL: Use Raycast Quicklinks to open RCSB PDB 3D Viewer"
date: 2025-11-07 12:00:00
description: "1. Create a Raycast Quicklink(https://www.raycast.com/core-features/quicklinks) with the following content:  Name: RCSB Structure Link: https://www2.r..."
tags: til raycast
categories: til
til_source: https://github.com/chris-clem/til/blob/main/raycast/rcsb-quicklinks.md
---

1. Create a [Raycast Quicklink](https://www.raycast.com/core-features/quicklinks) with the following content:
```
Name: RCSB Structure
Link: https://www2.rcsb.org/3d-view/{clipboard}
```

![rcsb-quicklink](https://raw.githubusercontent.com/chris-clem/til/main/raycast/rcsb-quicklink-pngs/rcsb-quicklink.png)

2. With it, copy a PDB ID, e.g. from the terminal, and use the Quicklink to open the RCSB PDB 3D Viewer.

![copy-pdb-id](https://raw.githubusercontent.com/chris-clem/til/main/raycast/rcsb-quicklink-pngs/copy-pdb-id.png)

3. Open Raycast, search for the Quicklink "RCSB Structure", and hit enter.

![open-quicklink](https://raw.githubusercontent.com/chris-clem/til/main/raycast/rcsb-quicklink-pngs/open-quicklink.png)

4. https://www2.rcsb.org/3d-view/2GEU opens in your browser of choice.

5. Repeat with "https://www.rcsb.org/ligand/{clipboard}" for RCSB Ligand Viewer Quicklink where a CCD code is copied to the clipboard.
