import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Pool, PoolPosition, PoolStat } from "../../generated/schema";
import { BIGINT_ONE, BIGINT_ZERO } from "./constants";

export enum StatsAttribute {
  current,
  total
}

export function getOrCreatePoolStats(pool: Pool): PoolStat {
  let stats = PoolStat.load(pool.id);
  if(!stats) {
    stats = new PoolStat(pool.id);
    stats.numberOfCurrentPositions = BIGINT_ZERO;
    stats.numberOfTotalPositions = BIGINT_ZERO;
    stats.listOfCurrentPositions = new Array<string>();
    stats.listOfTotalPositions = new Array<string>();
    stats.pool = pool.id
  }
  return stats;
}

export function updatePoolStats(stats: PoolStat, position: PoolPosition): PoolStat {
  let hasTotalPosition = false;
  let totalPositions = stats.listOfTotalPositions;
  for(let i=0; i<totalPositions.length; i++) {
    let pos = totalPositions[i];
    if(pos === position.id) {
      hasTotalPosition = true;
    }
  }

  let hasCurrentPosition = false;
  let currentPositions = stats.listOfCurrentPositions;
  for(let i=0; i<currentPositions.length; i++) {
    let pos = currentPositions[i];
    if(pos === position.id) {
      hasCurrentPosition = true;
    }
  }

  // has no total position, create one
  if(!hasTotalPosition) {
    totalPositions.push(position.id);
    stats.listOfTotalPositions = totalPositions;
    stats.numberOfTotalPositions = BigInt.fromI32(totalPositions.length);
  }

  // has no current Position && position > 0, add to current
  if(!hasCurrentPosition && position.balance.gt(BIGINT_ZERO)) {
    currentPositions.push(position.id);
    stats.listOfCurrentPositions = currentPositions;
    stats.numberOfCurrentPositions = BigInt.fromI32(currentPositions.length);
  }

  // position value is 0, remove from current
  if(hasCurrentPosition && position.balance.equals(BIGINT_ZERO)) {
    let newCurrentPositions = new Array<string>();
    for(let i=0;i<=currentPositions.length; i++) {
      let pos = currentPositions[i];
      if(pos != position.id) {
        newCurrentPositions.push(pos);
      }
    }

    stats.listOfCurrentPositions = newCurrentPositions;
    stats.numberOfCurrentPositions = BigInt.fromI32(newCurrentPositions.length);
  }

  return stats;
}