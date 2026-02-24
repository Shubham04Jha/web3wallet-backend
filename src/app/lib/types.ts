import { NextRequest } from "next/server";

export type getBalanceReturnType = {
    value: string | null;
    unit: balanceUnits;
}
export type balanceUnits = 'lamports'|'wei';
export type chainTypes = 'main' | 'test';
export const chainTypeValues: chainTypes[] = ['main', 'test'];

export type Handler = (req: NextRequest)=>Promise<Response>;
export type Middleware = (next: Handler)=>Handler;