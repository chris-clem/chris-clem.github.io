---
title: 'Kickstart your next Python project with with Poetry, pre-commit and GitHub Actions'
date: 2020-04-03
permalink: /posts/2020/04/kickstart-python-project/
tags:
  - Python
  - Poetry
  - pre-commit
  - Github-Actions
---
# Kickstart your next Python project with Poetry, pre-commit, and GitHub Actions

When setting up a new Python project, you have probably experienced that it takes quite some time and effort to do so. 
You have to make a lot of decisions, and when you are not completely sure how to do it, it takes time and mental energy away from actually working on the project.

Wouldn't it be great if you could do it right once and then profit from it in all the following projects? 
This is exactly what you are going to do in this tutorial. 
You will set up a reasonable Python template project suitable for most tasks.

These set up steps include:

- **Creating a sensible project structure:** 
In [this](https://kennethreitz.org/essays/2013/01/27/repository-structure-and-python) great article, [Kenneth Reitz](https://github.com/kennethreitz) explains why a good project structure is so important and gives his recommendation for a sample repository.
- **Managing Python package dependencies:** 
Most Python projects require additional packages to fulfill their purpose. 
Managing these dependencies is an essential task for every Python project.  
- **Setting up code styling rules:** 
Having consistent code styling rules improves the code's readability and thus let's other persons join a project easier. 
In the best case, the rules are automatically enforced, so you do not have to think about them once they are set up.
- **Setting up Continuous Integration (CI) to automatically test the code:** 
With [CI](https://martinfowler.com/articles/continuousIntegration.html), you want to make sure that mistakes are discovered early and quickly. 
Using a CI tool that automatically runs the tests after every push to the repo also makes this step a piece of mind.

This list of steps is by no means inclusive, but a sensible starting point for most Python projects. 
In the next few paragraphs, you will go over each of these steps to create a Python template repo that gets your next projects up and running in minutes. 
For each step, you will make use of great open-source projects that help to achieve the goal.

## Creating a Project Structure and Manage Dependencies with Poetry

As a first step, you create a default project structure and set up dependency management. 
[Poetry](https://python-poetry.org/) is a tool for exactly that created by [Sébastien Eustace](https://github.com/sdispater).
With Poetry, you can create deterministic builds, package your project, and publish it to PyPI using only a handful of easy commands. 
Besides its own nice [documentation](https://python-poetry.org/docs/), there is also [this](https://hackersandslackers.com/python-poetry-package-manager/) great introduction to Poetry if you want to learn more about it.

Simply follow these steps to set up a default project structure and add first dependencies:

### 1. Create a new project with a reasonable default project structure using Poetry

Install Poetry by following the install instructions for your OS on their [website](https://python-poetry.org/docs/#installation). 
Then you can run the following command to create a default project structure:

```bash
poetry new python-template-repo
```

This creates the following directory structure:

```bash
python-template-repo
├── pyproject.toml
├── python_template_repo
│   └── __init__.py
├── README.md
└── tests
    └── __init__.py
```

The most important file here at the moment is `pyproject.toml` that contains general information about the project and its dependencies and is used by Poetry to manage the project:

```toml
[tool.poetry]
name = "python-template-repo"
version = "0.1.0"
description = ""
authors = ["Christoph Clement <christoph.clement@students.unibe.ch>"]
readme = "README.md"
packages = [{include = "python_template_repo"}]

[tool.poetry.dependencies]
python = "^3.9"


[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

For now, the only dependencies we have is Python 3.9. 
The `[build-system]` entry makes it compliant with [PEP-517](https://www.python.org/dev/peps/pep-0517/). 
You can find more information about what can be specified in the file in Poetry's documentation [here](https://python-poetry.org/docs/pyproject/).

### 2. Install the first dependency

```bash
cd python-template-repo
poetry add fire
```

Adding a dependency to the project works with the `poetry add` command and the required package's name. 
You can find more information about the command and how to specify package versions [here](https://python-poetry.org/docs/cli/#add). 
In this example, you add [Python Fire](https://github.com/google/python-fire), a Python library for automatically generating command line interfaces (CLIs) by Google.

After adding a new dependency, Poetry adds (if it is the first dependency) or updates a file called `poetry.lock` containing the exact versions of the downloaded packages. 
These are used when someone or something else, e.g., a colleague or a CI server, installs the dependencies using the `poetry install` command. 
This ensures that the project does not break because of different versions of dependencies.

## Automatically Enforcing Code Formatting Rules with pre-commit

When writing new code, one of the most important things to keep in mind is the following:
> "[...] code is read much more often than it is written."  - [PEP 8](https://www.python.org/dev/peps/pep-0008/)

Apart from structuring your code well, a consistent style highly contributes to readable and understandable code.
Apart from PEP 8 itself, which is a great read, I can recommend going over [this](https://docs.python-guide.org/writing/style/) great article by [The Hitchhiker’s Guide to Python](https://docs.python-guide.org/) about "Pythonic" guidelines and idioms.

It helps a lot to have an understanding of these rules and guidelines. 
But actually, when you are working on a project, you do not want to waste mental energy by thinking about how to best format the code. 
Exactly for this reason, there are some helpful tools out there that do this job for you.

A great way to incorporate these tools into a project is to use [Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) to check files automatically before committing them.
Here, you will use [pre-commit](https://pre-commit.com/), a framework for managing and maintaining pre-commit hooks.

With the following steps, you can quickly set up several pre-commit checks to enforce a consistent code style throughout the whole project.

### 1. Install and add pre-commit to the dev dependencies

```bash
poetry add pre-commit --group dev
```

### 2. Configure the hooks that we want to use

Create a file called `.pre-commit-config.yaml` in the root dir of the project. 
There, the hooks are configured. 
The following is the default configuration that I use for projects. 
It makes use of hooks that come directly with pre-commit, like checking the format YAML files or whether large files are added to Git. 
Additionally, [black](https://github.com/psf/black) is used to format the code automatically.

```yaml
# See https://pre-commit.com for more information
# See https://pre-commit.com/hooks.html for more hooks
repos:
-   repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v3.2.0
    hooks:
    -   id: check-added-large-files
    -   id: check-ast
    -   id: check-check-merge-conflict
    -   id: check-yaml
    -   id: detect-private-key
    -   id: end-of-file-fixer
    -   id: trailing-whitespace

-   repo: https://github.com/asottile/reorder_python_imports
    rev: v3.9.0
    hooks:
    -   id: reorder-python-imports

  - repo: https://github.com/psf/black
    rev: 22.10.0
    hooks:
      - id: black
        language_version: python3.9

```

### 3. Install the hooks for the project

```bash
git init
poetry run pre-commit install
```

Now, you can manually run these hooks whenever you want your code to be checked and formatted by running `poetry run pre-commit run --all-files`. 
Also, every time you want to commit, these checks are run, and if there is a failure, you cannot commit unless you fix it. 
This is sometimes a little annoying when you quickly want to commit something, but it ensures high coding quality in the long run.

## Setting up Continuous Integration (CI) to automatically test code with GitHub Actions

The final step is to create a CI pipeline with [GitHub Actions](https://github.com/features/actions), which is free for public projects and students. 
With this pipeline, you will check whether all pre-commit hooks pass without an error and run tests with [pytest](https://docs.pytest.org/en/latest/).

The setup is straight forward. 
Simply add the following `ci-testing.yml` file to the `.github/workflows/` directory of your project.

```yaml
name: CI Testing

on: [push, pull_request]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - name: Set up Python 3.9
      uses: actions/setup-python@v4
      with:
        python-version: 3.9
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install poetry
        poetry install
        poetry run pre-commit install
    - name: Run pre-commit hooks
      run: |
        poetry run pre-commit run --all-files
    - name: Test with pytest
      run: |
        poetry run pytest

```

This file defines the action `CI Testing` that gets triggered on new pushes and pull requests. 
It sets up an Ubuntu server with Python 3.9, installs the dependencies, runs the pre-commit hooks and the tests with pytest. 
For a more detailed look at how to set up actions for a Python project, check out the [GitHub help pages](https://help.github.com/en/actions/language-and-framework-guides/using-python-with-github-actions) for that topic.

## Start Coding

Now that you have set up a sensible project structure, dependency management, automatic formatting checks, and CI, it is time to start with the actual work.

To demonstrate the pipeline, create a small demo script with following these steps:

### 1. Add necessary dependencies

You have already installed pre-commit in the previous steps as a dev dependency. 
For the sake of this demonstration, additionally add [tqdm](https://tqdm.github.io/) to create progress bars, and [loguru](https://github.com/Delgan/loguru) for easy logging.

```bash
poetry add tqdm loguru
```

### 2. Create a template script

In the next step, create a simple template script in the `python_template_repo/` directory:

```python
from time import sleep

import fire
from loguru import logger
from tqdm import tqdm


def main(
    len_loop: int = 100,
    sleep_seconds: float = 0.1,
):
    logger.info("Starting loop")

    for _ in tqdm(range(len_loop)):
        sleep(sleep_seconds)

    logger.info("Finished loop")


if __name__ == "__main__":
    fire.Fire(main)

```

### 3. Run the pre-commit hooks

After creating the script, check whether it passes the pre-commit hooks. Try to commit your work by running the following command:

```bash
git add .
git commit -m "Initial commit"
```

You should get the following output from pre-commit:

```bash
Check for added large files..............................................Passed
Check python ast.........................................................Passed
Check docstring is first.................................................Passed
Check JSON...........................................(no files to check)Skipped
Pretty format JSON...................................(no files to check)Skipped
Check Yaml...............................................................Passed
Fix End of Files.........................................................Passed
Trim Trailing Whitespace.................................................Passed
flake8...................................................................Failed
- hook id: flake8
- exit code: 1

python_template_repo/template_script.py:13:90: E501 line too long (113 > 89 characters)
python_template_repo/template_script.py:14:90: E501 line too long (124 > 89 characters)
python_template_repo/template_script.py:19:8: E111 indentation is not a multiple of four

Reorder python imports...................................................Passed
black....................................................................Failed
- hook id: black
- files were modified by this hook

reformatted /home/christoph/PycharmProjects/python-template-repo/python_template_repo/__init__.py
reformatted /home/christoph/PycharmProjects/python-template-repo/tests/test_python_template_repo.py
reformatted /home/christoph/PycharmProjects/python-template-repo/python_template_repo/template_script.py
All done! ✨ 🍰 ✨
3 files reformatted, 1 file left unchanged.
```

There are some flake8 errors, and black reformatted the file.

When staging the changed files and committing again, all hooks pass, and you are good to go as black automatically fixed the flake8 errors:

```bash
git add .
git commit -m "Initial commit"
```

### 4. Run the script

Use the following command to run the script inside the project's environment using Poetry:

```bash
poetry run python python_template_repo/template_script.py
```

To shorten the command, you can add the script to the `pyproject.toml` file:

```toml
...

[tool.poetry.scripts]
template_script = "python_template_repo.template_script:main"

[build-system]
...
```

Then, you can run the script like so:

```bash
poetry run template_script
```

### 5. Check whether the CI tests pass

To check whether the CI tests pass, add a simple test that checks whether the template script runs without errors. Create a file called `test_template_script.py` in the `tests` directory:

%[https://gist.github.com/chris-clem/ba025fb599ed604f7931cc0eb7b268e6]

You can run the test locally with:

```bash
poetry run pytest
```

To see how the CI testing works, you first need to create a new GitHub repository. You can then push your work so far by running:

```bash
git remote add origin git@github.com:[Your GitHub Username]/python-template-repo.git
git add .
git commit -m "Add test for template_script"
git push -u origin master
```

You can then head over to your newly created GitHub repo and check whether the CI tests passed under "Actions".

## Conclusion

With these steps, you are well prepared for your next Python projects. You are ready to use Poetry for managing dependencies, pre-commit to automatically check your code style, and GitHub Actions to automatically test your code.

Let me know how your Python project-setup steps look like!

## Bonus: Cookiecutter Template

I provide this repo as a [Cookiecutter](https://cookiecutter.readthedocs.io/en/1.7.0/) template for the case you want to use exactly this Python project setup. Simply follow these steps to set up your project in minutes:

### 1. Install Cookiecutter

```bash
pip install cookiecutter
```

### 2. Clone my Cookiecutter template repo

```bash
git clone https://github.com/chris-clem/python-template-repo.git
```

### 3. Run Cookiecutter to create a new project from the template

```bash
cookiecutter python template-repo
```

You will be asked how you want to name the repo, the package, and the script. Simply fill in these variables, and you get a customized version of the template repo.

The template also comes with a README containing setup instructions.