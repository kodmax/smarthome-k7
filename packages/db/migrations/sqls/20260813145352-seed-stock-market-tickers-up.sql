INSERT INTO preferences (scope, preference_key, value)
VALUES (
  'stock-market',
  'tickers',
  '[
    "AAPL","AMD","AMZN","ARM","ASML","AVGO","BAC","CCL","DAL","DELL","FIG","GOOGL",
    "HOOD","HPE","HPQ","IBM","INTC","LULU","LUV","MA","MDB","META","MPWR","MRVL",
    "MSFT","MU","NFLX","NOK","NOW","NVDA","ORCL","PINS","PLTR","QCOM","RCL","RDDT",
    "SMCI","SNDK","STX","TSLA","TSM","TXN","UAL","UBER","V","WDC","IONQ","QBTS",
    "RGTI","GFS","QNT","SPCX"
  ]'::jsonb
)
ON CONFLICT (scope, preference_key) DO UPDATE SET value = excluded.value;
