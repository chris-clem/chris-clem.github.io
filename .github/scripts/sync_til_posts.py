#!/usr/bin/env python3
"""
Sync TIL posts from chris-clem/til repository to blog posts.

This script fetches TIL markdown files from the TIL repository and converts them
to Jekyll blog posts with proper front matter and image URL conversion.
"""

import os
import re
import requests
from datetime import datetime
from pathlib import Path

# Configuration
TIL_REPO = "chris-clem/til"
TIL_BRANCH = "main"
POSTS_DIR = "_posts"
GITHUB_API_BASE = "https://api.github.com"
GITHUB_RAW_BASE = f"https://raw.githubusercontent.com/{TIL_REPO}/{TIL_BRANCH}"


def get_til_files():
    """Fetch all markdown files from the TIL repository."""
    url = f"{GITHUB_API_BASE}/repos/{TIL_REPO}/git/trees/{TIL_BRANCH}?recursive=1"
    response = requests.get(url)
    response.raise_for_status()

    tree = response.json()["tree"]

    # Filter for markdown files in category directories (exclude README.md at root)
    md_files = []
    for item in tree:
        path = item["path"]
        if (path.endswith(".md") and
            "/" in path and
            not path.startswith("README") and
            item["type"] == "blob"):
            md_files.append(path)

    return md_files


def fetch_file_content(file_path):
    """Fetch the content of a file from the TIL repository."""
    url = f"{GITHUB_RAW_BASE}/{file_path}"
    response = requests.get(url)
    response.raise_for_status()
    return response.text


def extract_title_from_content(content):
    """Extract title from markdown content (first # heading or filename)."""
    lines = content.split("\n")
    for line in lines:
        if line.startswith("# "):
            return line[2:].strip()
    return None


def convert_image_paths(content, til_file_path):
    """Convert relative image paths to GitHub raw URLs."""
    # Get the directory of the TIL file
    til_dir = str(Path(til_file_path).parent)

    # Pattern to match markdown images: ![alt](path)
    def replace_image(match):
        alt_text = match.group(1)
        img_path = match.group(2)

        # Skip if already an absolute URL
        if img_path.startswith(("http://", "https://", "/")):
            return match.group(0)

        # Convert relative path to GitHub raw URL
        # Remove leading ./
        img_path = img_path.lstrip("./")

        # Construct full path relative to TIL repo root
        if til_dir:
            full_path = f"{til_dir}/{img_path}"
        else:
            full_path = img_path

        github_url = f"{GITHUB_RAW_BASE}/{full_path}"
        return f"![{alt_text}]({github_url})"

    # Replace markdown image syntax
    content = re.sub(r'!\[(.*?)\]\((.*?)\)', replace_image, content)

    return content


def create_blog_post(til_file_path, content):
    """Convert TIL content to Jekyll blog post format."""
    # Extract metadata
    category = Path(til_file_path).parent.name
    filename = Path(til_file_path).stem

    # Extract title
    title = extract_title_from_content(content)
    if not title:
        # Fallback: use filename, convert dashes to spaces and title case
        title = filename.replace("-", " ").title()

    # Remove the first # heading from content if present
    lines = content.split("\n")
    if lines and lines[0].startswith("# "):
        content = "\n".join(lines[1:]).lstrip()

    # Convert image paths
    content = convert_image_paths(content, til_file_path)

    # Generate description (first 150 chars of content, or title)
    content_preview = content.strip().split("\n\n")[0]
    content_preview = re.sub(r'[#*`\[\]]', '', content_preview)  # Remove markdown syntax
    # Replace newlines with spaces to ensure single-line description
    content_preview = content_preview.replace("\n", " ")
    description = content_preview[:150].strip()
    if len(content_preview) > 150:
        description += "..."
    if not description:
        description = title

    # Escape quotes in description for YAML
    description = description.replace('"', '\\"')

    # Use current date for new posts (will be updated with git date extraction in workflow)
    today = datetime.now().strftime("%Y-%m-%d")

    # Create Jekyll front matter
    front_matter = f"""---
layout: post
title: "TIL: {title}"
date: {today} 12:00:00
description: "{description}"
tags: til {category}
categories: til
til_source: https://github.com/{TIL_REPO}/blob/{TIL_BRANCH}/{til_file_path}
---

"""

    blog_post = front_matter + content

    # Generate filename: YYYY-MM-DD-til-category-filename.md
    post_filename = f"{today}-til-{category}-{filename}.md"
    post_path = Path(POSTS_DIR) / post_filename

    return post_path, blog_post


def sync_til_posts():
    """Main function to sync TIL posts."""
    print(f"Fetching TIL files from {TIL_REPO}...")
    til_files = get_til_files()
    print(f"Found {len(til_files)} TIL files")

    # Create posts directory if it doesn't exist
    Path(POSTS_DIR).mkdir(exist_ok=True)

    synced_count = 0
    updated_count = 0

    for til_file in til_files:
        print(f"Processing: {til_file}")

        # Fetch content
        content = fetch_file_content(til_file)

        # Create blog post
        post_path, blog_post = create_blog_post(til_file, content)

        # Check if post already exists
        exists = post_path.exists()

        # Write the post
        post_path.write_text(blog_post, encoding="utf-8")

        if exists:
            updated_count += 1
            print(f"  Updated: {post_path}")
        else:
            synced_count += 1
            print(f"  Created: {post_path}")

    print(f"\n✅ Sync complete!")
    print(f"   New posts: {synced_count}")
    print(f"   Updated posts: {updated_count}")
    print(f"   Total TILs: {len(til_files)}")


if __name__ == "__main__":
    sync_til_posts()
