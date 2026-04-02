#!/usr/bin/env bash
# SPDX-FileCopyrightText: Copyright (c) 2025-2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0

set -euo pipefail

# Search patterns for common API key formats and private data leaks.
PATTERNS=(
  # OpenAI / OpenCode / Codex
  'sk-[A-Za-z0-9_-]{48,64}'
  # Anthropic
  'ANTHROPIC_API_KEY\s*=\s*"[^"]+"|ANTHROPIC_API_KEY\s*=\s*[^[:space:]]+'
  # Ollama token format prefix (example from user)
  'sk-proj-[A-Za-z0-9_-]{32,128}'
  # Generic token pointers
  'OPENAI_API_KEY\s*=\s*"[^"]+"|OPENAI_API_KEY\s*=\s*[^[:space:]]+'
  'OPENROUTER_API_KEY\s*=\s*"[^"]+"|OPENROUTER_API_KEY\s*=\s*[^[:space:]]+'
  'GITHUB_TOKEN\s*=\s*"[^"]+"|GITHUB_TOKEN\s*=\s*[^[:space:]]+'
  'PRIVATE_KEY\s*=|-----BEGIN (RSA|EC|OPENSSH|DSA) PRIVATE KEY-----'
)

# Files to scan: staged files for pre-push, or all tracked files by default.
if [[ $# -gt 0 && $1 == '--all' ]]; then
  SCAN_FILES=$(git ls-files)
else
  STAGED=$(git diff --cached --name-only --diff-filter=ACM)
  if [[ -z "$STAGED" ]]; then
    echo "No staged files to scan (pass --all to scan entire workspace)."
    exit 0
  fi
  SCAN_FILES=$STAGED
fi

found=0
for pattern in "${PATTERNS[@]}"; do
  matches=$(grep -En --line-number --color=never -I -E "$pattern" -- $SCAN_FILES 2>/dev/null || true)
  if [[ -n "$matches" ]]; then
    echo "[ERROR] Potential secret leak matched pattern: $pattern"
    echo "$matches"
    found=1
  fi
done

if [[ $found -ne 0 ]]; then
  echo "\nSecret scan failed. Remove or redacted key-like values before push."
  exit 1
fi

echo "Secret scan passed. No key-like tokens found in staged files."
exit 0
openshell sandbox list
openshell logs <sandbox-name> --tail