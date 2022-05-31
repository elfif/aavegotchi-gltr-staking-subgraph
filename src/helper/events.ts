import { ethereum } from "@graphprotocol/graph-ts";
import { Deposit } from "../../generated/Farm/LibFarm";
import {  } from "../../generated/schema";

export function createDepositEvent(event: Deposit) {
    event.params.amount
    event.params.pid
    event.params.user
}
