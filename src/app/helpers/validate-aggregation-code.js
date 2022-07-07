const aggregationCodeSize = 22;
const markCodeSize = 30;

export const validateMarkCode = (code) => code.length >= markCodeSize;
export const validateAggregationCode = (code) => code.length === aggregationCodeSize;