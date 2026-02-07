'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

export default function Home() {
  const sdkRef = useRef<any>(null);

  useEffect(() => {
    let isBaseApp = false;

    // 1. Try to load Farcaster MiniApp SDK and detect Base App
    const initSDK = async () => {
      try {
        // Dynamic import - browser only package
        const mod = await import('@farcaster/miniapp-sdk');
        const sdk = mod.sdk;
        sdkRef.current = sdk;
        
        // Get context BEFORE calling ready
        const ctx = await sdk.context;
        console.log('[BN] SDK context:', JSON.stringify(ctx)?.substring(0, 500));
        
        if (ctx?.user?.fid) {
          isBaseApp = true;
          const user = ctx.user;
          // Pass to Game engine (might not be loaded yet — retry)
          const passUser = () => {
            const g = (window as any).Game;
            if (g && g.setFarcasterUser) {
              g.setIsBaseApp(true);
              g.setFarcasterUser({
                fid: String(user.fid),
                username: String(user.username || user.displayName || 'fid:' + user.fid),
                pfpUrl: String(user.pfpUrl || ''),
              });
              console.log('[BN] Passed to Game:', user.username, 'FID:', user.fid);
              return true;
            }
            return false;
          };
          if (!passUser()) {
            const retry = setInterval(() => {
              if (passUser()) clearInterval(retry);
            }, 200);
            setTimeout(() => clearInterval(retry), 5000);
          }
        } else {
          console.log('[BN] No user in context — web mode');
          setWebMode();
        }

        // Signal to host app that we're ready (hides splash screen)
        await sdk.actions.ready();
        console.log('[BN] SDK ready() called');

        // Bridge composeCast for Game's shareScore()
        (window as any).__composeCast = async (text: string, embedUrl: string) => {
          try {
            await sdk.actions.composeCast({ text, embeds: [embedUrl] as [string] });
          } catch (e) {
            console.log('[BN] composeCast failed, copying to clipboard');
            try {
              await navigator.clipboard.writeText(text + '\n' + embedUrl);
              alert('Copied to clipboard!');
            } catch {}
          }
        };
      } catch (e) {
        console.log('[BN] Not in MiniApp context — web mode:', e);
        setWebMode();
      }
    };

    // 2. Set web mode (browser / non-Base App)
    const setWebMode = () => {
      const passWebMode = () => {
        const g = (window as any).Game;
        if (g && g.setIsBaseApp) {
          g.setIsBaseApp(false);
          console.log('[BN] Web mode activated — wallet connect for payments');
          return true;
        }
        return false;
      };
      if (!passWebMode()) {
        const retry = setInterval(() => {
          if (passWebMode()) clearInterval(retry);
        }, 200);
        setTimeout(() => clearInterval(retry), 5000);
      }
    };

    initSDK();

    // 2. Init Game engine
    const interval = setInterval(() => {
      const g = (window as any).Game;
      if (g && g.canvas === null) {
        g.init();
        clearInterval(interval);
      } else if (g && g.canvas !== null) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Base Account SDK for payments */}
      <Script src="/base-account.min.js" strategy="beforeInteractive" />
      {/* Game Engine Script */}
      <Script src="/game-engine.js" strategy="afterInteractive" />

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
              LEADERBOARD<small>top 100 players</small>
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
              Buy All Blades<small id="bladesPrice">0 USDC</small>
            </button>
          </div>
          <div className="shop-section">
            <div className="shop-label">BACKGROUNDS</div>
            <div className="shop-items" id="bgItems"></div>
            <button className="btn btn-secondary buy-all-btn" id="buyAllBgsBtn" onClick={() => (window as any).Game?.buyAllBackgrounds()} style={{display:'none'}}>
              Buy All Backgrounds<small id="bgsPrice">0 USDC</small>
            </button>
          </div>
          <button className="wallet-btn" id="walletBtn" onClick={() => (window as any).Game?.connectWallet()}>Connect Wallet</button>
          <div className="wallet-address" id="walletAddress"></div>
          <button className="btn btn-primary" id="buyEverythingBtn" onClick={() => (window as any).Game?.buyEverything()} style={{marginTop:'20px',display:'none'}}>
            BUY EVERYTHING<small id="totalPrice">0 USDC</small>
          </button>
          <div className="buttons" style={{marginTop:'15px'}}>
            <button className="btn btn-secondary" onClick={() => { (window as any).Game?.playClickSound(); (window as any).Game?.hideShop(); }}>BACK</button>
          </div>
        </div>

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

        <div id="leaderboard" className="screen hidden">
          <div className="leaderboard-title">LEADERBOARD</div>
          <div className="leaderboard-subtitle">TOP 100 PLAYERS</div>
          <div className="leaderboard-tabs">
            <button className="leaderboard-tab active" id="tabClassic" onClick={() => (window as any).Game?.switchLeaderboardTab(0)}>CLASSIC</button>
            <button className="leaderboard-tab" id="tabArcade" onClick={() => (window as any).Game?.switchLeaderboardTab(1)}>ARCADE</button>
          </div>
          <div className="my-stats" id="myStats" style={{display:'none'}}>
            <div className="my-stats-label">YOUR BEST</div>
            <div className="my-stats-value" id="myBestScore">0</div>
            <div className="my-stats-rank" id="myRank"></div>
          </div>
          <div className="leaderboard-list" id="leaderboardList">
            <div className="leaderboard-loading">Loading...</div>
          </div>
          <div className="buttons" style={{marginTop:'15px'}}>
            <button className="btn btn-secondary" onClick={() => { (window as any).Game?.playClickSound(); (window as any).Game?.hideLeaderboard(); }}>BACK</button>
          </div>
        </div>

        <div id="submitScoreModal">
          <div className="submit-modal-content">
            <div className="submit-title">NEW SCORE!</div>
            <div className="submit-score" id="submitScoreValue">0</div>
            <div className="submit-best" id="submitBestText"></div>
            <div className="submit-status" id="submitStatus"></div>
            <div className="submit-buttons">
              <button className="submit-btn skip" onClick={() => (window as any).Game?.skipSubmitScore()}>Skip</button>
              <button className="submit-btn send" id="submitBtn" onClick={() => (window as any).Game?.submitScore()}>Submit</button>
              <button id="shareBtn" style={{display:'none'}} onClick={() => (window as any).Game?.shareScore()}>📢 Share</button>
            </div>
          </div>
        </div>

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
