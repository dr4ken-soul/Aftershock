#!/usr/bin/env sh
set -eu

corepack pnpm install
corepack pnpm generate
corepack pnpm --filter graph build
corepack pnpm aftershock build --offline
corepack pnpm aftershock simulate left-pad --offline
corepack pnpm aftershock scan packages/graph/fixtures/demo-lockfile.json --offline
corepack pnpm smoke
corepack pnpm generate
corepack pnpm spec:self-check
corepack pnpm --filter landing build
