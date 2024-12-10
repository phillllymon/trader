import testalpacadocs from '@api/testalpacadocs';

testalpacadocs.auth('PKKWB389KLIK5VYAMRWY');
testalpacadocs.auth('Ychesl4FXap2hxd1FYlOHrTLhJMmm7RvoXHcImD6');
testalpacadocs.server('https://data.alpaca.markets');
testalpacadocs.stockBarSingle({
  timeframe: '5Min',
  start: '2024-12-04T06%3A30%3A00-08%3A00',
  end: '2024-12-04T13%3A00%3A00-08%3A00',
  limit: '1000',
  adjustment: 'raw',
  feed: 'sip',
  sort: 'asc',
  symbol: 'AMZN'
})
  .then(({ data }) => console.log(data))
  .catch(err => console.error(err));