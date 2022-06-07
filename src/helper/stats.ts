import { Pool, PoolStat, Stat } from "../../generated/schema";
import { BIGINT_ONE, BIGINT_ZERO } from "./constants";

export function getOrCreatePoolStats(pool: Pool): PoolStat {
  let stats = PoolStat.load(pool.id);
  if(!stats) {
    stats = new PoolStat(pool.id);
    stats.currentPositions = BIGINT_ZERO;
    stats.totalPositions = BIGINT_ZERO;
    stats.overallStats = "1";
    stats.pool = pool.id
  }
  return stats;
}

export function getOrCreateStats(): Stat {
  let stats = Stat.load("1");
  if(!stats) {
    stats = new Stat("1");
    stats.currentStakers = BIGINT_ZERO;
    stats.totalStakers = BIGINT_ZERO;
  }
  return stats;
}