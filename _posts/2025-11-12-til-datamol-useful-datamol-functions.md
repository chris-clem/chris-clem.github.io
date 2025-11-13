---
layout: post
title: 'TIL: Useful Datamol functions'
date: 2025-11-12 12:00:00
description: A quick tip about datamol
tags: til datamol
categories: til
til_source: https://github.com/chris-clem/til/blob/main/datamol/useful-datamol-functions.md
---

https://docs.datamol.io/stable/index.html

```python
import datamol as dm
```

## Cluster a set of molecules using the butina clustering algorithm and a given threshold
```python
dm.cluster.cluster_mols(mols, cutoff=0.2, feature_fn=None, n_jobs=1)
```

## Compute conformers of a molecule
```python
dm.conformers.generate(mol, ...)
```

## Convert a list of mols to a dataframe using each mol properties as a column
```python
dm.convert.to_df(mols)
```

## Compute a list of opiniated molecular properties
```python
dm.descriptors.compute_many_descriptors(mol)
```

## Compute the molecular fingerprint given a molecule or a SMILES
```python
dm.fp.to_fp(mol, as_array=True, fp_type='ecfp')
```

## Generate all possible fragmentation of a molecule
```python
dm.fragment.frag(mol, remove_parent=False, sanitize=True, fix=True)
```

## Read an SDF file
```python
dm.io.read_sdf(urlpath)
```

## Write molecules to a file
```python
dm.io.to_sdf(mols, urlpath)
```

## Context manager to disable RDKit logs
```python
with dm.log.without_rdkit_log():
    mol = dm.to_mol("CCCCO")  # potential RDKit logs won't show
```

## Disable all rdkit logs
```python
dm.log.disable_rdkit_log()
```

## Standardize and sanitize a molecule
```python
mol = dm.mol.to_mol("O=C(C)Oc1ccccc1C(=O)O")
mol = dm.mol.fix_mol(mol)
mol = dm.mol.sanitize_mol(mol)
mol = dm.mol.standardize_mol(mol)
```

## Generate an image out of a molecule or a list of molecules
```python
dm.viz.to_image(mols, legends)
```
