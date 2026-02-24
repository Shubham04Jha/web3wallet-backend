import { z } from 'zod'
import { chainTypeValues } from '@/app/lib/types'

export const getBalanceReqBodySchema = z.object({
    chainType: z.enum(chainTypeValues, { message: "ChainType not supported" }).optional(),
    address: z.string()
});