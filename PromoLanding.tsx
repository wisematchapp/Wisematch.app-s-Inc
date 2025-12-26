
import React, { useState, useEffect } from "react";
import { Loader, Github, Twitter, Linkedin } from "lucide-react";
import { HeroLeagueTable } from "./HeroLeagueTable";

export const PromoLanding = ({ onEnter }: { onEnter: () => void }) => {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="landing-page">
      {/* Floating Navigation */}
      <nav className={`floating-nav ${showNav ? "visible" : "hidden"}`}>
        <div className="nav-container">
          <div className="nav-items">
            <button className="nav-button">Statistics</button>
            <button className="nav-button">Analysis</button>
            <button className="nav-button">Fundamentals</button>
            <button className="nav-button">Features</button>
          </div>
          <div className="nav-auth">
            <button onClick={onEnter} className="nav-login-btn">
              Log in
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="glow-container">
          <div className="glow-effect"></div>
        </div>

        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <div className="badge-dot">
              <div className="badge-dot-ping"></div>
              <div className="badge-dot-core"></div>
            </div>
            <span className="badge-text">MEET WISEMATCH</span>
            <Loader className="badge-loader" />
          </div>

          {/* Title */}
          <h1 className="hero-title">
            Your sports betting copilot
          </h1>

          {/* Description */}
          <p className="hero-description">
            AI-powered platform transforming complex football data into clear,
            actionable insights for smarter decisions.
          </p>

          {/* League Table Wrapper */}
          <div className="league-table-wrapper">
            <HeroLeagueTable />
          </div>

          {/* Secondary Description */}
          <p className="hero-secondary-text">
            Wisematch AI combines official data with real-time analysis to
            provide merit-based rankings, xG analysis, and AI-powered insights
            across all major leagues.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-brand-name">Wisematch.AI</div>
              <p className="footer-brand-desc">
                The next generation of sports analytics. Built for professionals, accessible to everyone.
              </p>
              <div className="footer-social" style={{marginTop: '24px', display: 'flex', gap: '16px'}}>
                <a href="#" style={{color: '#64748b'}}><Github size={20} /></a>
                <a href="#" style={{color: '#64748b'}}><Twitter size={20} /></a>
                <a href="#" style={{color: '#64748b'}}><Linkedin size={20} /></a>
              </div>
            </div>

            <div className="footer-columns" style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px'}}>
              <div>
                <h4 className="footer-column-title">Product</h4>
                <ul className="footer-column-links" style={{listStyle: 'none', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  <li><a href="#" className="footer-link">Dashboard</a></li>
                  <li><a href="#" className="footer-link">AI Winston</a></li>
                  <li><a href="#" className="footer-link">Live Odds</a></li>
                </ul>
              </div>
              <div>
                <h4 className="footer-column-title">Resources</h4>
                <ul className="footer-column-links" style={{listStyle: 'none', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  <li><a href="#" className="footer-link">Documentation</a></li>
                  <li><a href="#" className="footer-link">API Reference</a></li>
                  <li><a href="#" className="footer-link">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="footer-column-title">Company</h4>
                <ul className="footer-column-links" style={{listStyle: 'none', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  <li><a href="#" className="footer-link">About</a></li>
                  <li><a href="#" className="footer-link">Privacy</a></li>
                  <li><a href="#" className="footer-link">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-copyright">
            <p>© 2024 Wisematch AI Analytics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
