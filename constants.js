const CHECKOUT_BRANDS_MAP = [
    {
      url: "gokwik",
      live_url: "pdp.gokwik.co",
    },
    {
      url: "xpresslane",
    },
    {
      url: "zecpe",
    },
    {
      url: "fastrr",
    },
    {
      url: "razorpay",
    },
    {
      url: "1checkout",
    },
    {
      url: "nimbbl.biz",
    },
    {
      live_url: "getsimpl.com/api/v2/app/custom-checkout",
      url: "getsimpl",
    },
    {
      url: "shopflo",
    },
    {
      url: "snapmint",
    // https://snapmint-delta-posthog.ap-south-1.aws.opsverse.cloud/decide/?v=2&ip=1&_=1676622103637&ver=1.21.1
    },
    {
      name: "stickycart",
      url: "uplinkly"
      // merchant url: https://montpam.com/
      // found on source but not on network
    },
    {
      name: "slidecart",
      url: "apphq.co",
      // merchat_url: https://encaja.mx/,
      // https://cart-go.apphq.co/api/encajamx.myshopify.com
    },
    {
      url: "klaviyo",
      // url: "https://fast.a.klaviyo.com/custom-fonts/api/v1/company-fonts/onsite?company_id=QRDX9c",
      // live merchant
    },
    // {
    //   url: "Bulk Discount Code Generator",
    // },
    {
      url: "clickpost",
    },
    {
      url: "goaffpro",
    },
    {
      url: "quinnapi",
    },
    {
      url: "loyaltylion",
      // https://sdk.loyaltylion.net/sdk/config/174b1a056e1417f2ba3943bf9e60e4db?build=18526&t=2023021404
      // live merchant: https://mgemi.com/
    },
    {
      url: "yotpo",
      // live merchant: https://www.sigsauer.com/
      // https://loyalty.yotpo.com/api/public/v1/redemption_options?guid=4I_uq2gNstIAjLHcB702Og&discount_types=fixed_amount,percentage,custom,recharge_discount_fixed_amount,cart_fixed_amount,gift_certificate_fixed,donation,store_credit_fixed,shopify_recharge_fixed_amount,shopify_recharge_percentage,recharge_discount_percentage,shipping,generic_fixed_amount,percent
    },
    {
      url: "smile.io",
      // https://platform.smile.io/v1/smile_ui/init?channel_key=pk_Tjrm9XgmxJ1sHwbrQ4A1GfuS
      // live merchant: https://www.vitalityextracts.com/
    },
    {
      url: "nector",
      // https://cachefront.nector.io/api/v2/merchant/entities/6d488927-f266-40b4-bc2c-807c5338a544
      // live merchant: https://divinenutrition.in/
    },
    {
      url: "growave",
    },
  ];
  
  const SHEETS_DETAILS = {
    HEADER: [
      "site_url",
      ...CHECKOUT_BRANDS_MAP.map((obj) => obj.url),
      "last_updated_at",
    ],
    INPUT_SPREADSHEET_ID: process.env.INPUT_SPREADSHEET_ID,
    OUTPUT_SPREADSHEET_ID: process.env.OUTPUT_SPREADSHEET_ID,
    INPUT_SHEET_NAME: process.env.INPUT_SHEET_NAME,
    OUTPUT_SHEET_NAME: process.env.OUTPUT_SHEET_NAME,
  };
  
  const STRING_CONSTANTS = {
    YES: "yes",
    NO: "no",
    NOT_FOUND: "not found",
    YES_LIVE: "yes (live)",
    YES_PAUSED: "yes (paused)",
  };
  
  export { CHECKOUT_BRANDS_MAP, SHEETS_DETAILS, STRING_CONSTANTS };
  