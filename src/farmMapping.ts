import { Deposit, EmergencyWithdraw, Harvest, Withdraw } from "../generated/GLTRFarm/GLTRFarm";
import { BIGINT_ONE, BIGINT_ZERO } from "./helper/constants";
import { getOrCreatePool, getOrCreatePoolPosition, getOrCreateUser, updatePool, updatePoolPosition } from "./helper/entities";
import { createDepositEvent, createEmergencyWithdrawEvent, createHarvestEvent, createWithdrawEvent } from "./helper/events";
import { getOrCreatePoolStats, updatePoolStats } from "./helper/stats";

export function handleDeposit(event: Deposit): void {
  let pool = getOrCreatePool(event.params.pid);
  let user = getOrCreateUser(event.params.user);
  let poolPosition = getOrCreatePoolPosition(pool, user);
  pool = updatePool(pool, event.params.amount);
  poolPosition = updatePoolPosition(poolPosition, event.params.amount);

  // event
  let eventEntity = createDepositEvent(event);
  eventEntity.from = user.id;
  eventEntity.to = pool.id;
  eventEntity.amount = event.params.amount;
  eventEntity.save();

  // stats
  let poolStats = getOrCreatePoolStats(pool);
  poolStats = updatePoolStats(poolStats, poolPosition)
  poolStats.lpStaked = poolStats.lpStaked!.plus(event.params.amount);
  poolStats.save();  

  pool.save();
  user.save();
  poolPosition.save();

}

export function handleWithdraw(event: Withdraw): void {
  let pool = getOrCreatePool(event.params.pid);
  let user = getOrCreateUser(event.params.user);
  let poolPosition = getOrCreatePoolPosition(pool, user);
  let amount = event.params.amount.neg();
  pool = updatePool(pool, amount);
  poolPosition = updatePoolPosition(poolPosition, amount);

  // event
  let eventEntity = createWithdrawEvent(event);
  eventEntity.from = pool.id;
  eventEntity.to = user.id;
  eventEntity.amount = event.params.amount;

  // stats
  let poolStats = getOrCreatePoolStats(pool);
  poolStats = updatePoolStats(poolStats, poolPosition);
  poolStats.lpStaked = poolStats.lpStaked!.minus(event.params.amount);
  poolStats.save();  
  
  eventEntity.save();
  pool.save();
  user.save();
  poolPosition.save();
}

export function handleHarvest(event: Harvest): void {
  let user = getOrCreateUser(event.params.user);
  let eventEntity = createHarvestEvent(event);
  eventEntity.to = user.id;
  eventEntity.save();

  let amount = event.params.amount;
  user.gltrHarvested = user.gltrHarvested.plus(amount);
  user.save();
}

export function handleEmergencyWithdraw(event: EmergencyWithdraw): void {
  let pool = getOrCreatePool(event.params.pid);
  let user = getOrCreateUser(event.params.user);
  let poolPosition = getOrCreatePoolPosition(pool, user);
  let eventEntity = createEmergencyWithdrawEvent(event);
  eventEntity.from = pool.id;
  eventEntity.to = user.id;
  eventEntity.amount = event.params.amount;
  eventEntity.save();

  let amount = event.params.amount.neg();
  pool = updatePool(pool, amount);
  poolPosition = updatePoolPosition(poolPosition, amount);
  pool.save();
  user.save();
  poolPosition.save();
}
