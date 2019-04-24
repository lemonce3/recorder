const mitm = require('@lemonce3/mitm');
const StrategyFactory = require('./strategy');

const strategy = StrategyFactory({ observer, resourceServer });

mitm.Server.create(strategy, { server, ssl, certificateStore });