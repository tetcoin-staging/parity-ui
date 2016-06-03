import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import SettingsIcon from 'material-ui/svg-icons/action/settings';

import isEqual from 'lodash.isequal';

import Web3Component from '../Web3Component';
import Account from '../Account';
import Storage from '../Storage';

import styles from './AccountChooser.css';

export default class AccountChooser extends Web3Component {

  state = {
    defaultAccountIdx: 0,
    accounts: []
  };

  storage = Storage.crossOrigin();

  onTick (next) {
    this.context.web3.eth.getAccounts((err, accounts) => {
      if (err) {
        next(10);
        return;
      }

      if (isEqual(accounts, this.state.accounts)) {
        next(5);
        return;
      }

      this.storage.getLastAccount((lastAccount) => {
        const idx = accounts.indexOf(lastAccount);
        const defaultAccountIdx = idx !== -1 ? idx : this.state.defaultAccountIdx;

        this.setState({
          accounts,
          defaultAccountIdx
        });

        this.props.onAllAccounts(accounts);
        this.props.onChange(accounts[defaultAccountIdx]);
      });
    });
  }

  handleChange (e, index, value) {
    this.setState({
      defaultAccountIdx: value
    });
    const account = this.state.accounts[value];
    this.storage.saveLastAccount(account);
    this.props.onChange(account);
  }

  render () {
    const settings = this.props.onOpenDetails ? (
      <a
        className={styles.settings}
        href='javascript:void(0)'
        onClick={this.props.onOpenDetails}
        >
        <SettingsIcon />
      </a>
    ) : '';

    return (
      <div>
        <DropDownMenu
          autoWidth={false}
          className={styles.accounts}
          value={this.state.defaultAccountIdx}
          onChange={::this.handleChange}
          maxHeight={700}
          styles={obj}
          underlineStyle={{display: 'none'}}
          iconStyle={{ fill: '#888' }}
          >
          {this.state.accounts.map((acc, idx) => (
            <MenuItem
              key={acc}
              value={idx}
              primaryText={<Account address={acc} name={this.props.accountsNames[acc]}/>} />
          ))}
        </DropDownMenu>
        { settings }
      </div>
    );
  }

  static propTypes = {
    accountsNames: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onAllAccounts: React.PropTypes.func.isRequired,
    onOpenDetails: React.PropTypes.func
  };

}

const obj = {width: '350px'};
