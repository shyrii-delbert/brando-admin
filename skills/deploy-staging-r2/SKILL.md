---
name: deploy-staging-r2
description: Use when deploying the brando-admin frontend to the staging Cloudflare R2 bucket from a local checkout using environment variables from a .env file.
---

# Deploy Staging R2

## Overview

Build the staging bundle, load R2 credentials from a local `.env`, and sync `dist/` to the staging bucket root without deleting existing objects.

## When to Use

- Deploying `brando-admin` to the staging R2 bucket
- Verifying the local staging build before or alongside CI
- Re-running a staging upload with updated `.env` credentials

## Required Variables

Load these from the repository root `.env` file:

- `R2_BUCKET`
- `R2_ENDPOINT`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `AWS_DEFAULT_REGION` optional, defaults to `auto`

`.env` is gitignored in this repository. Do not commit secrets.

## Workflow

From the repository root:

```bash
set -a
source .env
set +a

: "${R2_BUCKET:?missing R2_BUCKET}"
: "${R2_ENDPOINT:?missing R2_ENDPOINT}"
: "${R2_ACCESS_KEY_ID:?missing R2_ACCESS_KEY_ID}"
: "${R2_SECRET_ACCESS_KEY:?missing R2_SECRET_ACCESS_KEY}"

export AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="${AWS_DEFAULT_REGION:-auto}"
export AWS_EC2_METADATA_DISABLED=true

pnpm install --frozen-lockfile
pnpm build:staging
aws s3 sync dist "s3://${R2_BUCKET}" --endpoint-url "${R2_ENDPOINT}" --no-progress
```

## Notes

- This workflow uploads new files and overwrites same-name files.
- It does not delete files already present in the bucket.
