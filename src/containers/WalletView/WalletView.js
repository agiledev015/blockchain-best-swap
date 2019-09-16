import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { WalletViewWrapper } from './WalletView.style';
import Tabs from '../../components/uielements/tabs';
import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';
import CoinList from '../../components/uielements/coins/coinList';

import { getPair } from '../../helpers/stringHelper';

const { TabPane } = Tabs;

class WalletView extends Component {
  static propTypes = {
    user: PropTypes.object,
    page: PropTypes.string,
    view: PropTypes.string,
    info: PropTypes.string,
    status: PropTypes.string,
    assetData: PropTypes.array.isRequired,
    stakeData: PropTypes.array.isRequired,
    loadingAssets: PropTypes.bool.isRequired,
    loadingStakes: PropTypes.bool.isRequired,
    setAssetData: PropTypes.func.isRequired,
    setStakeData: PropTypes.func.isRequired,
  };

  static defaultProps = {
    page: '',
    view: '',
    info: '',
    status: '',
  };

  getAssetNameByIndex = index => {
    const { assetData } = this.props;

    return assetData[index].asset || '';
  };

  getAssetIndexByName = asset => {
    const { assetData } = this.props;

    return assetData.find(data => data.asset === asset);
  };

  handleChangeTab = tag => {};

  handleConnect = () => {
    this.props.history.push('/connect');
  };

  handleSelectAsset = key => {
    const { page, view, info } = this.props;

    if (!info) return;

    const pair = getPair(info);
    const { source } = pair;
    const newAssetName = this.getAssetNameByIndex(key);

    const URL = `/${page}/${view}/${source}-${newAssetName}`;

    this.props.history.push(URL);
  };

  handleSelectStake = key => {};

  renderAssetTitle = () => {
    const { status, loadingAssets, assetData } = this.props;

    if (loadingAssets) {
      return 'Loading...';
    }

    if (status === 'connected' && assetData.length === 0) {
      return `Looks like you don't have anything in your wallet`;
    }

    if (status === 'connected') {
      return 'Tokens in your wallet:';
    }
    return 'Connect your wallet';
  };

  renderStakeTitle = () => {
    const { stakeData, loadingStakes } = this.props;

    if (loadingStakes) {
      return 'Loading...';
    }

    if (stakeData.length > 0) {
      return 'Your current stakes are:';
    }
    return 'You are currently not staked in any pool';
  };

  getSelectedAsset = pair => {
    const { page } = this.props;

    if (page === 'pool' || page === 'trade') {
      const { target } = pair;
      const targetIndex = this.getAssetIndexByName(target);

      return [targetIndex];
    }
    return [];
  };

  render() {
    const {
      info,
      user: { wallet },
      assetData,
      stakeData,
      loadingAssets,
      loadingStakes,
    } = this.props;
    const pair = getPair(info);
    const { source } = pair;
    const selectedAsset = this.getSelectedAsset(pair);
    const sourceIndex = this.getAssetIndexByName(source);

    return (
      <WalletViewWrapper>
        <Tabs defaultActiveKey="assets" onChange={this.handleChangeTab}>
          <TabPane tab="assets" key="assets">
            <Label className="asset-title-label" weight="bold">
              {this.renderAssetTitle()}
            </Label>
            {!wallet && (
              <Button onClick={this.handleConnect} color="success">
                connect
              </Button>
            )}
            {!loadingAssets && (
              <CoinList
                data={assetData}
                value={sourceIndex}
                selected={selectedAsset}
                onSelect={this.handleSelectAsset}
              />
            )}
          </TabPane>
          <TabPane tab="stakes" key="stakes">
            <Label className="asset-title-label">
              {this.renderStakeTitle()}
            </Label>
            {!loadingStakes && (
              <CoinList
                data={stakeData}
                value={sourceIndex}
                onSelect={this.handleSelectStake}
              />
            )}
          </TabPane>
        </Tabs>
      </WalletViewWrapper>
    );
  }
}

export default compose(
  connect(state => ({
    user: state.Wallet.user,
    assetData: state.Wallet.assetData,
    stakeData: state.Wallet.stakeData,
    loadingAssets: state.Wallet.loadingAssets,
    loadingStakes: state.Wallet.loadingStakes,
  })),
  withRouter,
)(WalletView);
