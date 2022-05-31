import { Deposit, EmergencyWithdraw, Harvest, Withdraw } from "../generated/Farm/LibFarm";
import {Deposit as DepositEntity, Transaction as TransactionEntity} from "../generated/schema";
import { getOrCreatePool, getOrCreatePoolPosition, getOrCreateUser, updatePool, updatePoolPosition } from "./helper/entities";
import { createDepositEvent, createEmergencyWithdrawEvent, createHarvestEvent, createWithdrawEvent } from "./helper/events";

export function handleDeposit(event: Deposit): void {
  let pool = getOrCreatePool(event.params.pid);
  let user = getOrCreateUser(event.params.user);
  let poolPosition = getOrCreatePoolPosition(pool, user);
  let eventEntity = createDepositEvent(event);
  eventEntity.from = user.id;
  eventEntity.to = pool.id;
  eventEntity.amount = event.params.amount;
  eventEntity.save();
  pool = updatePool(pool, event.params.amount);
  poolPosition = updatePoolPosition(poolPosition, event.params.amount);
  pool.save();
  user.save();
  poolPosition.save();

}

export function handleWithdraw(event: Withdraw): void {

  let pool = getOrCreatePool(event.params.pid);
  let user = getOrCreateUser(event.params.user);
  let poolPosition = getOrCreatePoolPosition(pool, user);
  let eventEntity = createWithdrawEvent(event);
  eventEntity.from = pool.id;
  eventEntity.to = user.id;
  eventEntity.amount = event.params.amount;

  let amount = event.params.amount.neg();
  pool = updatePool(pool, amount);
  poolPosition = updatePoolPosition(poolPosition, amount);
  
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