# security-harness-consumer

A small downstream service that consumes `coderabbit-demo/security-harness` over HTTP. It
exists to demonstrate **cross-repo breaking-change detection**: when a PR in
`security-harness` changes the public pricing contract (a response field name, a route path,
or a response type), CodeRabbit — using the explicit link in that repo's `.coderabbit.yaml` —
flags the exact call sites here that would break, before the upstream PR merges.

## The dependency

`src/checkout.ts` calls `POST /api/pricing/quote` on `security-harness` and reads specific
response fields (`subtotalCents`, `totalCents`). Those field names are the contract. Renaming
or retyping them upstream breaks this repo.

## Linking

This is wired explicitly (not via auto-discovery) in both directions:

- `security-harness/.coderabbit.yaml` lists this repo in `linked_repositories`.
- This repo's `.coderabbit.yaml` lists `security-harness` in `linked_repositories`, and pulls
  shared coding standards from `coderabbit-standards`.
