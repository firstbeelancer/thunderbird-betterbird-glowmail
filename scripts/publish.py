#!/usr/bin/env python3
"""Publish local GlowMail files to GitHub via the gh-api helper (one commit).

Usage: publish.py "Commit message" <repo-relative-path>...
Reads files from ~/workspace/glowmail-theme, creates blobs/tree/commit
on main. No secrets are read or written by this script.
"""
import base64
import importlib.util
import pathlib
import sys

ROOT = pathlib.Path("/home/hatch/workspace/glowmail-theme")
GH_API = pathlib.Path("/home/hatch/workspace/custom-connectors/custom.legacy-github/bin/gh-api")
REPO = "firstbeelancer/thunderbird-betterbird-glowmail"

from importlib.machinery import SourceFileLoader

sys.path.insert(0, str(GH_API.parent))
spec = importlib.util.spec_from_loader("gh_api", SourceFileLoader("gh_api", str(GH_API)))
gh = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gh)


def main() -> None:
    msg, paths = sys.argv[1], sys.argv[2:]
    ref = gh.call("GET", f"/repos/{REPO}/git/ref/heads/main")
    parent = ref["object"]["sha"]
    commit = gh.call("GET", f"/repos/{REPO}/git/commits/{parent}")
    base_tree = commit["tree"]["sha"]
    tree = []
    for rel in paths:
        data = (ROOT / rel).read_bytes()
        blob = gh.call("POST", f"/repos/{REPO}/git/blobs",
                       data={"content": base64.b64encode(data).decode(), "encoding": "base64"})
        tree.append({"path": rel, "mode": "100644", "type": "blob", "sha": blob["sha"]})
        print("blob", rel, len(data), "bytes")
    new_tree = gh.call("POST", f"/repos/{REPO}/git/trees",
                       data={"base_tree": base_tree, "tree": tree})
    new_commit = gh.call("POST", f"/repos/{REPO}/git/commits",
                         data={"message": msg, "tree": new_tree["sha"], "parents": [parent]})
    gh.call("PATCH", f"/repos/{REPO}/git/refs/heads/main",
            data={"sha": new_commit["sha"]})
    print("commit", new_commit["sha"])


if __name__ == "__main__":
    main()
