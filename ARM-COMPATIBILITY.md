# ARM Apple Silicon Compatibility Issues

## GitHub Actions and ARM Limitations

When running GitHub Actions locally with `act` on Apple Silicon (M1/M2/M3), several components have compatibility issues:

### 1. **CodeQL Action**
- **Issue**: CodeQL binaries are only available for x86_64 architecture
- **Actions affected**: 
  - `github/codeql-action/init@v3`
  - `github/codeql-action/analyze@v3`
  - `github/codeql-action/upload-sarif@v3`
- **Solution**: Must use `--container-architecture linux/amd64` flag with act
- **Performance**: Runs through Rosetta 2 emulation, significantly slower

### 2. **Default Ubuntu Images**
- **Issue**: `catthehacker/ubuntu:act-latest` is a large image that's slow on ARM
- **Solution**: Use lighter alternatives like `node:18` or `node:20`

### 3. **Native Binary Dependencies**
Some packages with native bindings may fail:
- `node-sass` (older versions)
- `bcrypt` (may need rebuilding)
- `sharp` (image processing)
- `puppeteer` (headless Chrome)

## Recommended Solutions

### 1. Use Docker with x86_64 Emulation
```bash
# Always add this flag for act on Apple Silicon
act push --container-architecture linux/amd64
```

### 2. Create `.actrc` Configuration
```bash
# .actrc
-P ubuntu-latest=node:18
-P ubuntu-22.04=node:18
-P ubuntu-20.04=node:16
--container-architecture linux/amd64
--use-new-action-cache
--reuse
```

### 3. Alternative: Skip CodeQL Locally
For faster local testing, create a workflow without CodeQL:
```yaml
# .github/workflows/test-local-no-codeql.yml
name: "Test Without CodeQL"
on: push

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
    - run: bun install
    - run: bun run build
    - run: bun test
```

### 4. Use GitHub Codespaces or Cloud CI
For full compatibility without emulation overhead:
- GitHub Codespaces (x86_64 environment)
- Push to a branch and let GitHub Actions run natively
- Use a cloud-based CI service

## Performance Impact

Running x86_64 containers on ARM through emulation:
- 2-5x slower execution
- Higher memory usage
- Increased battery consumption

## Verification Commands

Check your architecture:
```bash
# Check Mac architecture
uname -m  # Should show arm64

# Check Docker default platform
docker version --format '{{.Server.Arch}}'

# Test act with architecture flag
act push --container-architecture linux/amd64 --dryrun
```

## Common Error Messages

1. **"exec format error"**: Binary incompatible with ARM
2. **"no matching manifest"**: Docker image doesn't support ARM
3. **"Unsupported architecture"**: CodeQL specific error

## Best Practices

1. **Local Development**: Use native ARM tools when possible
2. **CI Testing**: Let GitHub Actions handle CodeQL and complex workflows
3. **act Usage**: Always use `--container-architecture linux/amd64`
4. **Docker Images**: Prefer multi-arch images or ARM-specific builds

## Specific to This Project

For the Sealfie landing page project:
- **Build/Test**: Works fine on ARM (Node.js, Grunt)
- **CodeQL**: Requires x86_64 emulation
- **Dependencies**: 
  - `node-sass` v9.0.0 - Should work on ARM (v8+ has ARM support)
  - If you encounter issues, try: `bun rebuild node-sass`
- **Performance**: Building locally is fast, CodeQL is slow

Run locally without CodeQL:
```bash
# Fast local testing
bun test
bun run build

# Full workflow with emulation (slow)
act push --container-architecture linux/amd64
```