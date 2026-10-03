import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const filePath = resolve(process.argv[2])
let appDirectory = dirname(filePath)
while (!existsSync(join(appDirectory, 'biome.json'))) {
  const parent = dirname(appDirectory)
  if (parent === appDirectory) throw new Error(`No Biome configuration found for ${filePath}`)
  appDirectory = parent
}
const output = execFileSync(
  process.execPath,
  [join(appDirectory, 'node_modules/@biomejs/biome/bin/biome'), 'format', '--stdin-file-path', filePath],
  { cwd: appDirectory, input: readFileSync(0), stdio: ['pipe', 'pipe', 'inherit'] }
)
process.stdout.write(output)
