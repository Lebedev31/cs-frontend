import z from "zod";

export type PlanUnionLiteral = 'oneWeek' | 'twoWeek' | 'month' | 'year';
export type ServiceUnionLiteral = 'vip' | 'top' | 'color' | 'balls';

const VipLiteralSchema = z.object({
    service: z.literal('vip'),
});

const TopLiteralSchema = z.object({
    service: z.literal('top')
})

const ColorLiteralSchema = z.object({
    service: z.literal('color')
})

const BallsLiteralSchema = z.object({
    service: z.literal('balls')
})

const PlanSchema = z.object({
    plan: z.enum(['oneWeek', 'twoWeek', 'month' , 'year']);
})

export const generalSchema = z.object({
    serverIpPort: z.string().trim().min(1, {message: 'Вы не отправили ip и port'}).max(1000, {message: 'Неправильные данные'}),
    offer: z.literal(true),
    email: z.email(),
    plan: PlanSchema,
});

export type VipSchema = z.infer<typeof generalSchema>;