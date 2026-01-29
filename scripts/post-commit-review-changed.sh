#!/bin/sh
# Post-commit hook: automatically run review for changed challenges after commit.
# Install: cp scripts/post-commit-review-changed.sh .git/hooks/post-commit && chmod +x .git/hooks/post-commit
# Or run manually after commit: npm run review:changed

cd "$(git rev-parse --show-toplevel)" || exit 0

# Get the commit that was just made (HEAD)
PREV_COMMIT=$(git rev-parse HEAD~1 2>/dev/null || echo "")
CURRENT_COMMIT=$(git rev-parse HEAD)

if [ -z "$PREV_COMMIT" ]; then
  # First commit, compare against empty tree
  REF="--root"
else
  REF="$PREV_COMMIT"
fi

# Run review for changed challenges
node scripts/run-review-changed.js --ref "$REF" || true

# Update progress and README
node scripts/update-progress.js || true

exit 0
