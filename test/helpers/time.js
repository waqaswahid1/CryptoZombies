await web3.currentProvider.sendAsync({
    jsonrpc: "2.0",
    method: "evm_increaseTime",
    params: [86400],  // there are 86400 seconds in a day
    id: new Date().getTime()
  }, async () => { });
  
  web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_mine',
      params: [],
      id: new Date().getTime()
  });