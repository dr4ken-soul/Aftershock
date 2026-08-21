import { readLockfile } from '../lockfile/parse.js'
import { scanResolvedPackages, type GraphRuntime } from '../runtime.js'

/** Scans an npm lockfile and returns graph-backed exposure findings. */
export async function scanLockfile(runtime: GraphRuntime, filePath: string, packageName = 'left-pad') {
  return scanResolvedPackages(runtime, await readLockfile(filePath), packageName)
}
