#!/bin/sh
exec 2>&1
echo "eslint..."
diffs=$(git diff --name-only @{push} | grep -E '\.(js|jsx|ts|tsx)$')
to_lint=""
for file in $diffs; do
  if [ -f $file ]; then
    to_lint="$to_lint $file"
  fi
done
if [ -z "$to_lint" ]; then
  echo "No files to lint"
  exit 0
fi
echo $to_lint
npx eslint $diffs
echo "done!"
