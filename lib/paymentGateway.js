import PayU from "payu-websdk";

const PAYU_KEY = process.env.PAYU_KEY;
export const PAYU_SALT = process.env.PAYU_SALT;

export const payuClient = new PayU(
  {
    key: PAYU_KEY,
    salt: PAYU_SALT,
  },
  process.env.NODE_ENV === "development" ? "TEST" : "LIVE"
);
