import { ALCHEMY_API_KEY, alchemyEthereumChainTypes } from "@/app/lib/config";
import { APIReturnType, getBalanceReturnType } from "@/app/lib/types";
import { getBalanceReqBodySchema } from "@/app/lib/validation/requestBodySchemas";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): APIReturnType<getBalanceReturnType>{
    try {
        if(!request.headers.get('Content-Type')?.includes('application/json')){
            return NextResponse.json({error: 'Content-Type must be application/json'},{status:415});
        }
        const body = await request.json();
        const result = getBalanceReqBodySchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues },
                { status: 400 }
            );
        }
        const { address, chainType = "main" } = result.data;

        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_getBalance',
                params: [address, 'latest']
            })
        };
        const res = await fetch(
            `${alchemyEthereumChainTypes[chainType]}/${ALCHEMY_API_KEY}`,
            options
        );
        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Alchemy API error [${res.status} ${res.statusText}]:`, errorText);
            return NextResponse.json(
                { error: `Upstream API error: ${res.status} ${res.statusText}` },
                { status: res.status }
            );
        }
        const data = await res.json();
        console.log(data);
        return NextResponse.json({ value: data.result ?? null, unit: 'wei' }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}