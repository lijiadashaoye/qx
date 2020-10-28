const enums =
{
        extensionTabType:
        {
                address: 1,
                list: 2,
                hierarchy: 3,
        },
        rankTabType:
        {
                all: 1,
                plant: 2,
                extension: 3,
                rtt  : 4
        },
        walletTabType:
        {
                recharge: 1,
                withdrawal: 2,
                transport: 3,
                exchange: 4
        },
        walletRechargeType:
        {
                usdt: 1,
                abc: 2,
                detailed: 3,
                rtt:4
        },
        transportEnum:
        {
                transport: 1,
                detailed: 2,
                dynamic : 3
        },
        exchangeEnum:
        {
                exchange: 1,
                usdt2ftd: "USDT2FTD",
                glt2ftd: "GLT2FTD",
                ftd2glt: "FTD2GLT",
                ftd2usdt: "FTD2USDT",
                detailed: 2
        },
        c2cType:
        {
                buy: 1,
                small: 2,
                bill: 3
        },
        c2cCheckedType:
        {
                bank: 1,
                zhifubao: 2,
                weixin: 3
        },
        c2cBuyPageStu:
        {
                creatIng: 1,
                payIng: 2,
                paySucces: 3
        },
        c2cBuyStu:
        {
                waitIng: 1,
                over: 2
        },
        shopp:
        {
                plant:1,
                treasure:2
        }
}

export default enums;