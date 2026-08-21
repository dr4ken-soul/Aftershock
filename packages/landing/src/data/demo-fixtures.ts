// generated from the deterministic fixture and offline query measurements
import type { ExposureReport, LockfileFinding } from '@aftershock/graph/types'

export const demoReport: ExposureReport = {
  "comprom": {
    "package": "left-pad",
    "version": "1.0.0",
    "flaggedAt": 1704067200000
  },
  "totalExposed": 84,
  "maxDepth": 1,
  "events": [
    {
      "order": 1,
      "name": "axios",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 100,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "axios@1.0.0"
      ]
    },
    {
      "order": 2,
      "name": "axios",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 200,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "axios@1.1.0"
      ]
    },
    {
      "order": 3,
      "name": "chalk",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 300,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "chalk@1.0.0"
      ]
    },
    {
      "order": 4,
      "name": "chalk",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 400,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "chalk@1.1.0"
      ]
    },
    {
      "order": 5,
      "name": "commander",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 500,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "commander@1.0.0"
      ]
    },
    {
      "order": 6,
      "name": "commander",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 600,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "commander@1.1.0"
      ]
    },
    {
      "order": 7,
      "name": "debug",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 700,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "debug@1.0.0"
      ]
    },
    {
      "order": 8,
      "name": "debug",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 800,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "debug@1.1.0"
      ]
    },
    {
      "order": 9,
      "name": "demo-service",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 900,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "demo-service@1.0.0"
      ]
    },
    {
      "order": 10,
      "name": "demo-service",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 1000,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "demo-service@1.1.0"
      ]
    },
    {
      "order": 11,
      "name": "esbuild",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 1100,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "esbuild@1.0.0"
      ]
    },
    {
      "order": 12,
      "name": "esbuild",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 1200,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "esbuild@1.1.0"
      ]
    },
    {
      "order": 13,
      "name": "express",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 1300,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "express@1.0.0"
      ]
    },
    {
      "order": 14,
      "name": "express",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 1400,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "express@1.1.0"
      ]
    },
    {
      "order": 15,
      "name": "fastify",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 1500,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "fastify@1.0.0"
      ]
    },
    {
      "order": 16,
      "name": "fastify",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 1600,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "fastify@1.1.0"
      ]
    },
    {
      "order": 17,
      "name": "glob",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 1700,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "glob@1.0.0"
      ]
    },
    {
      "order": 18,
      "name": "glob",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 1800,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "glob@1.1.0"
      ]
    },
    {
      "order": 19,
      "name": "kleur",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 1900,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "kleur@1.0.0"
      ]
    },
    {
      "order": 20,
      "name": "kleur",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 2000,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "kleur@1.1.0"
      ]
    },
    {
      "order": 21,
      "name": "leftpad",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 2100,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "leftpad@1.0.0"
      ]
    },
    {
      "order": 22,
      "name": "leftpad",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 2200,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "leftpad@1.1.0"
      ]
    },
    {
      "order": 23,
      "name": "leftpadd",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 2300,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "leftpadd@1.0.0"
      ]
    },
    {
      "order": 24,
      "name": "leftpadd",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 2400,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "leftpadd@1.1.0"
      ]
    },
    {
      "order": 25,
      "name": "lodash",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 2500,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "lodash@1.0.0"
      ]
    },
    {
      "order": 26,
      "name": "lodash",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 2600,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "lodash@1.1.0"
      ]
    },
    {
      "order": 27,
      "name": "minimist",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 2700,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "minimist@1.0.0"
      ]
    },
    {
      "order": 28,
      "name": "minimist",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 2800,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "minimist@1.1.0"
      ]
    },
    {
      "order": 29,
      "name": "ora",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 2900,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "ora@1.0.0"
      ]
    },
    {
      "order": 30,
      "name": "ora",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 3000,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "ora@1.1.0"
      ]
    },
    {
      "order": 31,
      "name": "pkg-0001",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 3100,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0001@1.0.0"
      ]
    },
    {
      "order": 32,
      "name": "pkg-0001",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 3200,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0001@1.1.0"
      ]
    },
    {
      "order": 33,
      "name": "pkg-0002",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 3300,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0002@1.0.0"
      ]
    },
    {
      "order": 34,
      "name": "pkg-0002",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 3400,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0002@1.1.0"
      ]
    },
    {
      "order": 35,
      "name": "pkg-0003",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 3500,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0003@1.0.0"
      ]
    },
    {
      "order": 36,
      "name": "pkg-0003",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 3600,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0003@1.1.0"
      ]
    },
    {
      "order": 37,
      "name": "pkg-0004",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 3700,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0004@1.0.0"
      ]
    },
    {
      "order": 38,
      "name": "pkg-0004",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 3800,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0004@1.1.0"
      ]
    },
    {
      "order": 39,
      "name": "pkg-0005",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 3900,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0005@1.0.0"
      ]
    },
    {
      "order": 40,
      "name": "pkg-0005",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 4000,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0005@1.1.0"
      ]
    },
    {
      "order": 41,
      "name": "pkg-0006",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 4100,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0006@1.0.0"
      ]
    },
    {
      "order": 42,
      "name": "pkg-0006",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 4200,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0006@1.1.0"
      ]
    },
    {
      "order": 43,
      "name": "pkg-0007",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 4300,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0007@1.0.0"
      ]
    },
    {
      "order": 44,
      "name": "pkg-0007",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 4400,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0007@1.1.0"
      ]
    },
    {
      "order": 45,
      "name": "pkg-0008",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 4500,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0008@1.0.0"
      ]
    },
    {
      "order": 46,
      "name": "pkg-0008",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 4600,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0008@1.1.0"
      ]
    },
    {
      "order": 47,
      "name": "pkg-0009",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 4700,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0009@1.0.0"
      ]
    },
    {
      "order": 48,
      "name": "pkg-0009",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 4800,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0009@1.1.0"
      ]
    },
    {
      "order": 49,
      "name": "pkg-0010",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 4900,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0010@1.0.0"
      ]
    },
    {
      "order": 50,
      "name": "pkg-0010",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 5000,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0010@1.1.0"
      ]
    },
    {
      "order": 51,
      "name": "pkg-0011",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 5100,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0011@1.0.0"
      ]
    },
    {
      "order": 52,
      "name": "pkg-0011",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 5200,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0011@1.1.0"
      ]
    },
    {
      "order": 53,
      "name": "pkg-0012",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 5300,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0012@1.0.0"
      ]
    },
    {
      "order": 54,
      "name": "pkg-0012",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 5400,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0012@1.1.0"
      ]
    },
    {
      "order": 55,
      "name": "pkg-0013",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 5500,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0013@1.0.0"
      ]
    },
    {
      "order": 56,
      "name": "pkg-0013",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 5600,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0013@1.1.0"
      ]
    },
    {
      "order": 57,
      "name": "pkg-0014",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 5700,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0014@1.0.0"
      ]
    },
    {
      "order": 58,
      "name": "pkg-0014",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 5800,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0014@1.1.0"
      ]
    },
    {
      "order": 59,
      "name": "pkg-0015",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 5900,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0015@1.0.0"
      ]
    },
    {
      "order": 60,
      "name": "pkg-0015",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 6000,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0015@1.1.0"
      ]
    },
    {
      "order": 61,
      "name": "pkg-0016",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 6100,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0016@1.0.0"
      ]
    },
    {
      "order": 62,
      "name": "pkg-0016",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 6200,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0016@1.1.0"
      ]
    },
    {
      "order": 63,
      "name": "pkg-0017",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 6300,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0017@1.0.0"
      ]
    },
    {
      "order": 64,
      "name": "pkg-0017",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 6400,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0017@1.1.0"
      ]
    },
    {
      "order": 65,
      "name": "pkg-0018",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 6500,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0018@1.0.0"
      ]
    },
    {
      "order": 66,
      "name": "pkg-0018",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 6600,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "pkg-0018@1.1.0"
      ]
    },
    {
      "order": 67,
      "name": "react",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 6700,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "react@1.0.0"
      ]
    },
    {
      "order": 68,
      "name": "react",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 6800,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "react@1.1.0"
      ]
    },
    {
      "order": 69,
      "name": "rimraf",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 6900,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "rimraf@1.0.0"
      ]
    },
    {
      "order": 70,
      "name": "rimraf",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 7000,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "rimraf@1.1.0"
      ]
    },
    {
      "order": 71,
      "name": "semver",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 7100,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "semver@1.0.0"
      ]
    },
    {
      "order": 72,
      "name": "semver",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 7200,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "semver@1.1.0"
      ]
    },
    {
      "order": 73,
      "name": "shared-core",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 7300,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "shared-core@1.0.0"
      ]
    },
    {
      "order": 74,
      "name": "shared-core",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 7400,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "shared-core@1.1.0"
      ]
    },
    {
      "order": 75,
      "name": "typescript",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 7500,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "typescript@1.0.0"
      ]
    },
    {
      "order": 76,
      "name": "typescript",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 7600,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "typescript@1.1.0"
      ]
    },
    {
      "order": 77,
      "name": "undici",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 7700,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "undici@1.0.0"
      ]
    },
    {
      "order": 78,
      "name": "undici",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 7800,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "undici@1.1.0"
      ]
    },
    {
      "order": 79,
      "name": "vite",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 7900,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "vite@1.0.0"
      ]
    },
    {
      "order": 80,
      "name": "vite",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 8000,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "vite@1.1.0"
      ]
    },
    {
      "order": 81,
      "name": "webpack",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 8100,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "webpack@1.0.0"
      ]
    },
    {
      "order": 82,
      "name": "webpack",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 8200,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "webpack@1.1.0"
      ]
    },
    {
      "order": 83,
      "name": "zod",
      "version": "1.0.0",
      "depth": 1,
      "elapsedMs": 8300,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "zod@1.0.0"
      ]
    },
    {
      "order": 84,
      "name": "zod",
      "version": "1.1.0",
      "depth": 1,
      "elapsedMs": 8400,
      "viaPath": [
        "left-pad",
        "1.0.0",
        "left-pad@1.0.0",
        "zod@1.1.0"
      ]
    }
  ],
  "maintainerNeighbourhood": [
    "pkg-0003",
    "pkg-0012",
    "pkg-0021",
    "pkg-0030",
    "pkg-0039",
    "pkg-0048",
    "pkg-0057",
    "pkg-0066",
    "pkg-0075",
    "pkg-0084",
    "pkg-0093",
    "pkg-0102",
    "pkg-0111",
    "pkg-0120",
    "pkg-0129",
    "pkg-0138",
    "pkg-0147",
    "pkg-0156",
    "pkg-0165",
    "pkg-0174",
    "pkg-0183",
    "pkg-0192",
    "pkg-0201",
    "pkg-0210",
    "pkg-0219",
    "pkg-0228",
    "pkg-0237",
    "pkg-0246",
    "pkg-0255",
    "pkg-0264",
    "pkg-0273",
    "pkg-0282",
    "pkg-0291",
    "pkg-0300",
    "pkg-0309",
    "pkg-0318",
    "pkg-0327",
    "pkg-0336",
    "pkg-0345",
    "pkg-0354",
    "pkg-0363",
    "pkg-0372",
    "pkg-0381",
    "pkg-0390",
    "pkg-0399",
    "pkg-0408",
    "pkg-0417",
    "pkg-0426",
    "pkg-0435",
    "pkg-0444",
    "pkg-0453",
    "pkg-0462",
    "pkg-0471",
    "pkg-0480",
    "pkg-0489",
    "pkg-0498",
    "pkg-0507",
    "pkg-0516",
    "pkg-0525",
    "pkg-0534",
    "pkg-0543",
    "pkg-0552",
    "pkg-0561",
    "pkg-0570",
    "pkg-0579",
    "pkg-0588",
    "pkg-0597",
    "pkg-0606",
    "pkg-0615",
    "pkg-0624",
    "pkg-0633",
    "pkg-0642",
    "pkg-0651",
    "pkg-0660",
    "pkg-0669",
    "pkg-0678",
    "pkg-0687",
    "pkg-0696",
    "pkg-0705",
    "pkg-0714",
    "pkg-0723",
    "pkg-0732",
    "pkg-0741",
    "pkg-0750",
    "pkg-0759",
    "pkg-0768",
    "pkg-0777",
    "pkg-0786",
    "pkg-0795",
    "pkg-0804",
    "pkg-0813",
    "pkg-0822",
    "pkg-0831",
    "pkg-0840",
    "pkg-0849",
    "pkg-0858",
    "pkg-0867",
    "pkg-0876",
    "pkg-0885",
    "pkg-0894",
    "pkg-0903",
    "pkg-0912",
    "pkg-0921",
    "pkg-0930",
    "pkg-0939",
    "pkg-0948",
    "pkg-0957",
    "pkg-0966",
    "pkg-0975",
    "pkg-0984",
    "pkg-0993",
    "pkg-1002",
    "pkg-1011",
    "pkg-1020",
    "pkg-1029",
    "pkg-1038",
    "pkg-1047",
    "pkg-1056",
    "pkg-1065",
    "pkg-1074",
    "pkg-1083",
    "pkg-1092",
    "pkg-1101",
    "pkg-1110",
    "pkg-1119",
    "pkg-1128",
    "pkg-1137",
    "pkg-1146",
    "pkg-1155",
    "pkg-1164",
    "pkg-1173",
    "pkg-1182",
    "pkg-1191",
    "pkg-1200",
    "pkg-1209",
    "pkg-1218",
    "pkg-1227",
    "pkg-1236",
    "pkg-1245",
    "pkg-1254",
    "pkg-1263",
    "pkg-1272",
    "pkg-1281",
    "pkg-1290",
    "pkg-1299",
    "pkg-1308",
    "pkg-1317",
    "pkg-1326",
    "pkg-1335",
    "pkg-1344",
    "pkg-1353",
    "pkg-1362",
    "pkg-1371",
    "pkg-1380",
    "pkg-1389",
    "pkg-1398",
    "pkg-1407",
    "pkg-1416",
    "pkg-1425",
    "pkg-1434",
    "pkg-1443",
    "pkg-1452",
    "pkg-1461",
    "pkg-1470",
    "undici",
    "webpack"
  ],
  "typosquats": [
    {
      "name": "leftpadd",
      "distance": 2
    },
    {
      "name": "leftpad",
      "distance": 1
    }
  ]
}
export const demoFinding: LockfileFinding = {
  "resolved": "left-pad@1.0.0",
  "path": [
    "root",
    "demo-service@1.0.0",
    "left-pad@1.0.0"
  ],
  "reaches": true,
  "firstBadWindowOverlap": true
}
export const fixtureCounts = {"packageNodes":1500,"versionNodes":3000,"maintainerNodes":32,"serviceNodes":1501,"edges":9087}
export const fixtureMetrics = {"packageNodes":1500,"versionNodes":3000,"maintainerNodes":32,"serviceNodes":1501,"edges":9087,"closureMs":361.47,"scanMs":204.53}
export const fixtureStory = { artifacts: 84, packages: 42, minutes: 6 }
