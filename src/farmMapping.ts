import { Deposit, EmergencyWithdraw, Harvest, Withdraw } from "../generated/Farm/LibFarm";
import {Deposit as DepositEntity, Transaction as TransactionEntity} from "../generated/schema";
import { getOrCreatePool, getOrCreatePoolPosition, getOrCreateUser, updatePool, updatePoolPosition } from "./helper/entities";

export function handleDeposit(event: Deposit): void {
  let pool = getOrCreatePool(event.params.pid);
  let user = getOrCreateUser(event.params.user);
  let poolPosition = getOrCreatePoolPosition(pool, user);
  pool = updatePool(pool, event.params.amount);
  poolPosition = updatePoolPosition(poolPosition, event.params.amount);
  pool.save();
  user.save();
  poolPosition.save();

}

export function handleWithdraw(event: Withdraw): void {
  let amount = event.params.amount.neg();
  let pool = getOrCreatePool(event.params.pid);
  let user = getOrCreateUser(event.params.user);
  let poolPosition = getOrCreatePoolPosition(pool, user);
  pool = updatePool(pool, amount);
  poolPosition = updatePoolPosition(poolPosition, amount);
  pool.save();
  user.save();
  poolPosition.save();
}

export function handleHarvest(event: Harvest): void {
  let amount = event.params.amount;
  let user = getOrCreateUser(event.params.user);
  user.gltrHarvested = user.gltrHarvested.plus(amount);
  user.save();
}

export function handleEmergencyWithdraw(event: EmergencyWithdraw): void {
  let amount = event.params.amount.neg();
  let pool = getOrCreatePool(event.params.pid);
  let user = getOrCreateUser(event.params.user);
  let poolPosition = getOrCreatePoolPosition(pool, user);
  pool = updatePool(pool, amount);
  poolPosition = updatePoolPosition(poolPosition, amount);
  pool.save();
  user.save();
  poolPosition.save();
}