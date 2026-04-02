#!/usr/bin/env bash
# SPDX-License-Identifier: Apache-2.0
# Scan GitHub repository secrets using GitHub API

set -euo pipefail

# Configuration
GITHUB_TOKEN="${GITHUB_TOKEN:-}"
OWNER="imfromfuture3000-Android"
REPO="OmniNexus-Oracle"
API_URL="https://api.github.com"

if [[ -z "$GITHUB_TOKEN" ]]; then
  echo "ERROR: GITHUB_TOKEN environment variable not set."
  exit 1
fi

echo "🔍 Scanning GitHub repository secrets for $OWNER/$REPO..."
echo ""

# Fetch secrets metadata (names and last updated timestamps, not values)
echo "📋 Repository Secrets:"
SECRETS=$(curl -s \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "$API_URL/repos/$OWNER/$REPO/actions/secrets")

if echo "$SECRETS" | grep -q '"message"'; then
  ERROR=$(echo "$SECRETS" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
  echo "❌ Error: $ERROR"
  exit 1
fi

echo "$SECRETS" | jq -r '.secrets[] | "  • \(.name) (updated: \(.updated_at))"' 2>/dev/null || {
  echo "  (No secrets found or API error)"
  exit 1
}

echo ""
echo "✓ Secrets scan complete"
echo ""
echo "💡 To create/update a secret:"
echo "  gh secret set SECRET_NAME --body 'secret_value' -R $OWNER/$REPO"
echo ""
echo "⚠️  Secret values are not displayed (write-only)."
