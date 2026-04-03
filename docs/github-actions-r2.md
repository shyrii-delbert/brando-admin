# GitHub Actions R2 Deployment

在 GitHub Actions 页面手动触发 `.github/workflows/deploy-r2.yml` 时，需要选择部署环境：

- `Online`
- `Staging`

1. 安装依赖
2. `Online` 执行 `pnpm build`，`Staging` 执行 `pnpm build:staging`
3. 将 `dist/` 同步到所选环境对应的 Cloudflare R2 存储桶根目录

需要在仓库的 GitHub Secrets 中配置：

- `R2_BUCKET`: Online 目标 R2 存储桶名称
- `R2_STAGING_BUCKET`: Staging 目标 R2 存储桶名称
- `R2_ENDPOINT`: R2 S3 兼容端点，例如 `https://<account-id>.r2.cloudflarestorage.com`
- `R2_ACCESS_KEY_ID`: R2 Access Key ID
- `R2_SECRET_ACCESS_KEY`: R2 Secret Access Key
- `AWS_DEFAULT_REGION`: 可选，默认使用 `auto`

当前同步策略不会删除桶里已有文件，只会上传新增文件并覆盖同名文件。
