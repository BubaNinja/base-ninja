'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function Home() {
  useEffect(() => {
    // Initialize game once the engine script is loaded
    // The game-engine.js sets window.Game, then we call init
    const checkAndInit = () => {
      if (typeof window !== 'undefined' && (window as any).Game) {
        (window as any).Game.init();
      }
    };

    // If Game is already loaded (script loaded before React hydration)
    checkAndInit();

    // Also listen for the script load event
    const interval = setInterval(() => {
      if ((window as any).Game && (window as any).Game.canvas === null) {
        (window as any).Game.init();
        clearInterval(interval);
      } else if ((window as any).Game && (window as any).Game.canvas !== null) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Game Engine Script */}
      <Script src="/game-engine.js" strategy="afterInteractive" />

      {/* Exact same HTML structure as original index.html */}
      <div id="container">
        <canvas id="game"></canvas>

        <div id="hud" className="hidden">
          <div className="hud-left">
            <div className="label">SCORE</div>
            <div className="score" id="score">0</div>
            <div className="combo" id="combo">COMBO x2</div>
          </div>
          <div className="hud-right">
            <div className="lives" id="lives"></div>
            <div className="timer" id="timer"></div>
          </div>
        </div>

        <div id="menu" className="screen">
          <div className="logo">BASE NINJA</div>
          <div className="logo-sub">SLICE THE ONCHAIN</div>
          <div className="buttons">
            <button className="btn btn-primary" onClick={() => { (window as any).Game?.playClickSound(); (window as any).Game?.start('classic'); }}>
              CLASSIC<small>3 lives, combo x3 = +❤️</small>
            </button>
            <button className="btn btn-secondary" onClick={() => { (window as any).Game?.playClickSound(); (window as any).Game?.start('arcade'); }}>
              ARCADE<small>60 seconds, combo bonus</small>
            </button>
            <button className="btn btn-secondary" onClick={() => { (window as any).Game?.playClickSound(); (window as any).Game?.showShop(); }}>
              CUSTOMIZE<small>blades &amp; backgrounds</small>
            </button>
            <button className="btn btn-secondary" onClick={() => { (window as any).Game?.playClickSound(); (window as any).Game?.showLeaderboard(); }}>
              LEADERBOARD<small>top 100 onchain</small>
            </button>
          </div>
          <div className="sound-controls">
            <button className="sound-btn" id="soundBtn" onClick={() => { (window as any).Game?.playClickSound(); (window as any).Game?.toggleSound(); }}>)) SFX</button>
            <button className="sound-btn" id="musicBtn" onClick={() => { (window as any).Game?.playClickSound(); (window as any).Game?.toggleMusic(); }}>♪ Music</button>
          </div>
        </div>

        <div id="shop" className="screen hidden">
          <div className="shop-title">CUSTOMIZE</div>

          <div className="shop-section">
            <div className="shop-label">BLADES</div>
            <div className="shop-items" id="bladeItems"></div>
            <button className="btn btn-secondary buy-all-btn" id="buyAllBladesBtn" onClick={() => (window as any).Game?.buyAllBlades()} style={{display:'none'}}>
              Buy All Blades
              <small id="bladesPrice">0 USDC</small>
            </button>
          </div>

          <div className="shop-section">
            <div className="shop-label">BACKGROUNDS</div>
            <div className="shop-items" id="bgItems"></div>
            <button className="btn btn-secondary buy-all-btn" id="buyAllBgsBtn" onClick={() => (window as any).Game?.buyAllBackgrounds()} style={{display:'none'}}>
              Buy All Backgrounds
              <small id="bgsPrice">0 USDC</small>
            </button>
          </div>

          <button className="wallet-btn" id="walletBtn" onClick={() => (window as any).Game?.connectWallet()}>Connect Wallet</button>
          <div className="wallet-address" id="walletAddress"></div>

          <button className="btn btn-primary" id="buyEverythingBtn" onClick={() => (window as any).Game?.buyEverything()} style={{marginTop:'20px',display:'none'}}>
            BUY EVERYTHING
            <small id="totalPrice">0 USDC</small>
          </button>

          <div className="buttons" style={{marginTop:'15px'}}>
            <button className="btn btn-secondary" onClick={() => { (window as any).Game?.playClickSound(); (window as any).Game?.hideShop(); }}>BACK</button>
          </div>
        </div>

        {/* Wallet Selection Modal */}
        <div id="walletModal">
          <div className="wallet-modal-content" style={{position:'relative'}}>
            <button className="wallet-modal-close" onClick={() => (window as any).Game?.closeWalletModal()} style={{position:'absolute',top:'15px',right:'15px',background:'rgba(255,255,255,0.1)',border:'none',color:'#fff',width:'30px',height:'30px',borderRadius:'50%',cursor:'pointer',fontSize:'18px'}}>✕</button>
            <div className="wallet-modal-title">Connect Wallet</div>
            <div className="wallet-modal-subtitle">Choose your preferred wallet to connect</div>
            <div className="wallet-options">
              <div className="wallet-option" onClick={() => (window as any).Game?.connectMetaMask()}>
                <div className="wallet-option-icon">🦊</div>
                <div className="wallet-option-info">
                  <div className="wallet-option-name">MetaMask</div>
                  <div className="wallet-option-desc">Connect using MetaMask browser extension</div>
                </div>
              </div>
              <div className="wallet-option" onClick={() => (window as any).Game?.connectCoinbase()}>
                <div className="wallet-option-icon" style={{color:'#0052FF',fontSize:'28px',fontWeight:'bold'}}>◆</div>
                <div className="wallet-option-info">
                  <div className="wallet-option-name">Coinbase Wallet</div>
                  <div className="wallet-option-desc">Connect using Coinbase Wallet</div>
                </div>
              </div>
              <div className="wallet-option" onClick={() => (window as any).Game?.connectInjected()}>
                <div className="wallet-option-icon">🔗</div>
                <div className="wallet-option-info">
                  <div className="wallet-option-name">Browser Wallet</div>
                  <div className="wallet-option-desc">Connect any injected wallet</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Modal */}
        <div id="purchaseModal">
          <div className="modal-content">
            <div className="modal-title">Unlock Item</div>
            <div className="modal-item" id="modalItem"></div>
            <div style={{fontSize:'16px',fontWeight:'bold',color:'#fff'}} id="modalName"></div>
            <div className="modal-price" id="modalPrice"></div>
            <div className="modal-status" id="modalStatus"></div>
            <div className="modal-buttons">
              <button className="modal-btn cancel" onClick={() => (window as any).Game?.closePurchaseModal()}>Cancel</button>
              <button className="modal-btn buy" id="buyBtn" onClick={() => (window as any).Game?.confirmPurchase()}>Buy</button>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div id="leaderboard" className="screen hidden">
          <div className="leaderboard-title">LEADERBOARD</div>
          <div className="leaderboard-subtitle">TOP 100 PLAYERS ONCHAIN</div>
          <div className="leaderboard-tabs">
            <button className="leaderboard-tab active" id="tabClassic" onClick={() => (window as any).Game?.switchLeaderboardTab(0)}>CLASSIC</button>
            <button className="leaderboard-tab" id="tabArcade" onClick={() => (window as any).Game?.switchLeaderboardTab(1)}>ARCADE</button>
          </div>
          <div className="my-stats" id="myStats" style={{display:'none'}}>
            <div className="my-stats-label">YOUR BEST</div>
            <div className="my-stats-value" id="myBestScore">0</div>
            <div className="my-stats-rank" id="myRank"></div>
          </div>
          <div className="nickname-section" id="nicknameSection" style={{display:'none'}}>
            <input type="text" className="nickname-input" id="nicknameInput" placeholder="Set nickname" maxLength={20} />
            <button className="nickname-btn" id="nicknameBtn" onClick={() => (window as any).Game?.saveNickname()}>Save</button>
          </div>
          <div className="leaderboard-list" id="leaderboardList">
            <div className="leaderboard-loading">Connect wallet to view leaderboard</div>
          </div>
          <div className="buttons" style={{marginTop:'15px'}}>
            <button className="btn btn-secondary" onClick={() => { (window as any).Game?.playClickSound(); (window as any).Game?.hideLeaderboard(); }}>BACK</button>
          </div>
        </div>

        {/* Submit Score Modal */}
        <div id="submitScoreModal">
          <div className="submit-modal-content">
            <div className="submit-title">NEW SCORE!</div>
            <div className="submit-score" id="submitScoreValue">0</div>
            <div className="submit-best" id="submitBestText"></div>
            <div className="submit-nickname">
              <input type="text" id="submitNickname" placeholder="Nickname (optional)" maxLength={20} />
            </div>
            <div className="submit-status" id="submitStatus"></div>
            <div className="submit-buttons">
              <button className="submit-btn skip" onClick={() => (window as any).Game?.skipSubmitScore()}>Skip</button>
              <button className="submit-btn send" id="submitBtn" onClick={() => (window as any).Game?.submitScoreOnchain()}>Submit Onchain</button>
            </div>
          </div>
        </div>

        {/* Game Over */}
        <div id="gameover" className="screen hidden">
          <div className="go-title" id="goTitle">GAME OVER</div>
          <div className="go-label">FINAL SCORE</div>
          <div className="go-score" id="goScore">0</div>
          <div className="buttons">
            <button className="btn btn-primary" onClick={() => { (window as any).Game?.playClickSound(); (window as any).Game?.restart(); }}>PLAY AGAIN</button>
            <button className="btn btn-secondary" onClick={() => { (window as any).Game?.playClickSound(); (window as any).Game?.toMenu(); }}>MENU</button>
          </div>
        </div>
      </div>
    </>
  );
}
