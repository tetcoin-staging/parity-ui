import React from 'react';

import LinearProgress from 'material-ui/LinearProgress';

import {Web3Component} from '../Web3Component/Web3Component';
import {appLink} from '../appLink';

import styles from './styles.css';

const DEFAULT_NETWORK = 'homestead';

export default class StatusLine extends Web3Component {

  state = {
    isReady: false,
    isSyncing: false,
    latestBlock: 1234,
    startingBlock: 1234,
    highestBlock: 1234,
    connectedPeers: 25,
    network: 'homestead'
  }

  onTick (next) {
    const {web3} = this.context;
    const handleError = (f) => (err, data) => {
      if (err) {
        console.error(err);
        this.setState({
          isError: true
        });
        // Make sure to call next even if we have an error.
        next();
        return;
      }
      this.setState({
        isError: false
      });
      f(data);
    };

    // Syncing
    web3.eth.getSyncing(handleError(syncing => {
      next();

      if (!syncing) {
        this.setState({
          isSyncing: false
        });
        return;
      }

      this.setState({
        isSyncing: true,
        startingBlock: parseInt(syncing.startingBlock, 10),
        highestBlock: parseInt(syncing.highestBlock, 10)
      });
    }));

    // Latest Block
    web3.eth.getBlockNumber(handleError(blockNumber => this.setState({
      latestBlock: parseInt(blockNumber, 10)
    })));

    // peers
    web3.net.getPeerCount(handleError(peers => this.setState({
      connectedPeers: peers
    })));

    // network
    web3.version.getNetwork(handleError(network => this.setState({
      network: networkName(network)
    })));
  }

  render () {
    if (this.state.isReady) {
      return (
        <div className={styles.status}>...</div>
      );
    }

    if (this.state.isSyncing) {
      return this.renderSyncing();
    }

    return (
      <div className={styles.status}>
        <ul className={styles.info}>
          <li>{this.state.connectedPeers} peers</li>
          <li>#{this.state.latestBlock}</li>
          <li>{this.renderNetwork()}</li>
          <li><a href={appLink('status')}>more</a></li>
        </ul>
      </div>
    );
  }

  renderNetwork () {
    const {network} = this.state;
    if (network !== DEFAULT_NETWORK) {
      return (
        <span className={styles.alert}>
          {network}
        </span>
      );
    }
    return (
      <span>{network}</span>
    );
  }

  renderSyncing () {
    const {startingBlock, latestBlock, highestBlock} = this.state;
    return (
      <div className={styles.status} title='Syncing...'>
        <LinearProgress
          style={s.progress}
          min={startingBlock}
          max={highestBlock}
          value={latestBlock}
          mode={'determinate'}
          />
        #{latestBlock}/{highestBlock}...
      </div>
    );
  }
}

const s = {
  progress: {
    width: '100px',
    margin: '10px 5px'
  }
};

function networkName (netId) {
  const networks = {
    0x0: 'olympic',
    0x1: 'homestead',
    0x2: 'morden'
  };
  return networks[netId] || 'unknown';
}
