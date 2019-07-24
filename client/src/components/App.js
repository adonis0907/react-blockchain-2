import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/blockchainLogo.png';

class App extends Component {
  state = { walletInfo: {} };

  //  To connect to API (express server)
  //  Run without wrote in render methods
  // fetch: implemented as a promise
  componentDidMount() {
    fetch(`${document.location.origin}/api/wallet-info`).then(response =>
      response.json().then(json => this.setState({ walletInfo: json }))
    );
  }

  render() {
    const { address, balance } = this.state.walletInfo;

    return (
      <div className='App'>
        <img className='logo' src={logo} />
        <br />
        <div>Welcome to my-crypto-blockchain</div>
        <br />
        <div>
          <Link to='/blocks'>Blocks</Link>
        </div>
        <div>
          <Link to='/conduct-transaction'>Conduct a Transaction</Link>
        </div>
        <div>
          <Link to='/transaction-pool'>Transaction-pool</Link>
        </div>

        <div className='WalletInfo'>
          <h4>Wallet address :</h4>
          <h5>{address}</h5>

          <h4>Wallet balance :</h4>
          <h5>{balance}</h5>
        </div>
        <br />
        <p>Hey, please feel free to try out.</p>
        <p>
          This is a demo website for build a blockchain with send money
          transaction.
        </p>
        <p>
          You can send dummy money and mining block to be able to see the added
          block in this blockchain.{' '}
        </p>
        <p>
          Also, you can role as another peer to conduct a transaction or mining
          to receive dummy rewards.{' '}
        </p>
        <a
          href='https://my-crypto-blockchain-peer.herokuapp.com/'
          rel='noopener noreferrer'
          target='_blank'
        >
          P2P website
        </a>
        <p>
          ( Please open localhost://xxxx if opening this page as development
          mode in the local environment )
        </p>
        <p>This blockchain will reset when restarting the application. </p>
        <br />
      </div>
    );
  }
}

export default App;
