import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Pool, PoolPosition, User } from "../../generated/schema";
import { BIGINT_ZERO } from "./constants";

export function getOrCreatePool(pid: BigInt): Pool {
  let id = pid.toString();
  let pool = Pool.load(id)
  if(!pool) {
    pool = new Pool(id);
    pool.balance = BIGINT_ZERO;
  }

  return pool;
}

export function getOrCreatePoolPosition(pool: Pool, user: User): PoolPosition {
  let id = pool.id + "-" + user.id.toHexString();
  let position = PoolPosition.load(id)
  if(!position) {
    position = new PoolPosition(id);
    position.balance = BIGINT_ZERO;
    position.user = user.id;
    position.pool = pool.id;
    user.gltrHarvested = BIGINT_ZERO;
  }

  return position;
}

export function getOrCreateUser(address: Bytes): User {
  let user = User.load(address);
  if(!user) {
    user = new User(address);
    user.gltrHarvested = BIGINT_ZERO;
  }

  return user;
}

export function updatePoolPosition(position: PoolPosition, amount: BigInt): PoolPosition {
  position.balance = position.balance.plus(amount);
  return position;
}

export function updatePool(pool: Pool, amount: BigInt): Pool {
  pool.balance = pool.balance.plus(amount)
  return pool;
}