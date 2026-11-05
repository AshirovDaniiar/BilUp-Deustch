export const RANK: Record<string, number>
export const ALLOW_UP: Set<string>
export interface BoundaryViolation {
  rule: string
  from: string
  to: string
  detail: string
}
export function analyze(srcRoot: string): { files: number; edges: number; violations: BoundaryViolation[]; cycles: string[][] }
