#!/usr/bin/env bash
# SPDX-FileCopyrightText: Copyright (c) 2025-2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0

set -euo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel)
HOOKS_DIR="$REPO_ROOT/.git/hooks"

mkdir -p "$HOOKS_DIR"
cat > "$HOOKS_DIR/pre-push" <<'EOF'
#!/usr/bin/env bash
# Guard: scan staged files for secret patterns before push
bash "$(git rev-parse --show-toplevel)/scripts/scan-secrets.sh" || exit 1
EOF

chmod +x "$HOOKS_DIR/pre-push"
echo "Installed pre-push hook at $HOOKS_DIR/pre-push"
