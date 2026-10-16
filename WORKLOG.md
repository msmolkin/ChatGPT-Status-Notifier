# Worklog

## 2026-10-16 — Studio CI migration

Goal: move existing CI compute to the local Studio with an explicit hosted rollback.

Changed only runs-on selection to a run-specific self-hosted macOS ARM64 profile. Public fork pull requests retain the original hosted label. Preserve existing main-push/path-ignore trigger and web-ext listed AMO signing/publication. Commit requires [skip ci] because appended WORKLOG is outside .github path exclusion; no AMO action is run during preparation.

Validation: parsed before/after equality permits only runs-on changes; default/configured/hosted/fork JSON resolutions checked with a sample run ID. No builds, test execution, installs, commits, dispatches, deployments, AMO signing or API writes were performed during preparation. Actual runtime validation remains after central review/application.

Hosted rollback values (retain JSON quotation marks): STUDIO_CI_UBUNTU_LATEST = "ubuntu-latest".

Runtime prerequisites: setup-node/web-ext need writable toolcache/global npm prefix; no Docker/browser/system package step is present.
