import React, { useEffect, useState } from "react";
import { AptosClient, Types } from "aptos";

const NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
const client = new AptosClient(NODE_URL);

const MODULE_ADDRESS = "0xb98e70c73b0976df7fa27b0a5d1230ed448c0706b57147a51566dc7a5097f30b";

declare global {
  interface Window {
    petra?: {
      connect: () => Promise<{ address: string }>;
      disconnect: () => Promise<void>;
      account: () => Promise<{ address: string }>;
      isConnected: () => Promise<boolean>;
      signAndSubmitTransaction: (tx: Types.TransactionPayload) => Promise<{ hash: string }>;
    };
  }
}


import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import CreateFarm from "./pages/CreateFarm";
import FarmList from "./pages/FarmList";
import Invest from "./pages/Invest";

import Home from "./pages/Home";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/create-farm", label: "Create Farm" },
  { to: "/farm-list", label: "Farm List" },
  { to: "/invest", label: "Invest" },
];

function Navbar() {
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 600px)").matches;

  return (
    <nav
      style={{
        display: isMobile ? "block" : "flex",
        justifyContent: "center",
        gap: isMobile ? "0" : "24px",
        marginBottom: "32px",
        background: "#f0fdfa",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(34,211,238,0.08)",
        padding: "12px 0",
        position: "relative",
      }}
    >
      {isMobile ? (
        <div style={{ textAlign: "center" }}>
          <button
            style={{
              background: "#0ea5e9",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1.08rem",
              border: "none",
              borderRadius: "8px",
              padding: "10px 24px",
              cursor: "pointer",
              marginBottom: "8px",
            }}
            onClick={() => setShowDropdown((v) => !v)}
          >
            Menu ▾
          </button>
          {showDropdown && (
            <div style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#f0fdfa",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(34,211,238,0.10)",
              zIndex: 10,
              minWidth: "180px",
              padding: "8px 0",
            }}>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    display: "block",
                    color: location.pathname === link.to ? "#22d3ee" : "#0ea5e9",
                    fontWeight: "bold",
                    textDecoration: "none",
                    fontSize: "1.08rem",
                    padding: "10px 24px",
                    borderRadius: "8px",
                    background: location.pathname === link.to ? "#e0f2fe" : "transparent",
                    boxShadow: location.pathname === link.to ? "0 2px 8px rgba(34,211,238,0.10)" : "none",
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowDropdown(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              color: location.pathname === link.to ? "#22d3ee" : "#0ea5e9",
              fontWeight: "bold",
              textDecoration: "none",
              fontSize: "1.08rem",
              padding: "8px 18px",
              borderRadius: "8px",
              background: location.pathname === link.to ? "#e0f2fe" : "transparent",
              boxShadow: location.pathname === link.to ? "0 2px 8px rgba(34,211,238,0.10)" : "none",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#bae6fd")}
            onMouseLeave={e => (e.currentTarget.style.background = location.pathname === link.to ? "#e0f2fe" : "transparent")}
          >
            {link.label}
          </Link>
        ))
      )}
    </nav>
  );
}


function Header() {
  return (
    <header
      style={{
        width: "100%",
        background: "linear-gradient(90deg,#22d3ee,#4ade80)",
        padding: "24px 0 18px 0",
        boxShadow: "0 2px 12px rgba(34,211,238,0.10)",
        marginBottom: "0px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#fff",
          fontWeight: 900,
          letterSpacing: 1,
          fontSize: "2.6rem",
          textShadow: "0 2px 8px #bae6fd",
          margin: 0,
        }}
      >
        🌱 LandLedger Farms
      </h1>
    </header>
  );
}


export default function App() {
  const [address, setAddress] = useState("");
  const [connected, setConnected] = useState(false);

  // Connection logic
  useEffect(() => {
    (async () => {
      if (window.petra?.isConnected) {
        const ok = await window.petra.isConnected();
        if (ok) {
          const acc = await window.petra.account();
          setAddress(acc.address);
          setConnected(true);
        }
      }
    })();
  }, []);

  const connectPetra = async () => {
    try {
      if (!window.petra) return alert("Petra wallet not found");
      const res = await window.petra.connect();
      setAddress(res.address);
      setConnected(true);
    } catch (err) {
      console.error("Connect error", err);
      alert("Failed to connect wallet");
    }
  };

  const disconnectPetra = async () => {
    try {
      await window.petra?.disconnect();
    } catch {}
    setConnected(false);
    setAddress("");
  };

  return (
    <Router>
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          padding: 0,
          margin: 0,
          background: "linear-gradient(120deg,#f0fdfa 0%,#e0f2fe 100%)",
          fontFamily: "Inter, Arial, sans-serif",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <style>{`
          @media (max-width: 900px) {
            .responsive-content {
              padding: 8px !important;
            }
          }
          @media (max-width: 600px) {
            .responsive-content {
              padding: 0 !important;
            }
            .responsive-content > div {
              border-radius: 0 !important;
              box-shadow: none !important;
            }
          }
        `}</style>
        <Header />
        <Navbar />
        <div style={{ minHeight: "350px", width: "100%" }}>
          <Routes>
            <Route path="/" element={<Home connected={connected} address={address} connectPetra={connectPetra} disconnectPetra={disconnectPetra} />} />
            <Route path="/create-farm" element={connected ? <CreateFarm address={address} /> : <ErrorMsg />} />
            <Route path="/farm-list" element={connected ? <FarmList address={address} /> : <ErrorMsg />} />
            <Route path="/invest" element={connected ? <Invest address={address} /> : <ErrorMsg />} />
            <Route path="*" element={<Home connected={connected} address={address} connectPetra={connectPetra} disconnectPetra={disconnectPetra} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function ErrorMsg() {
  return (
    <div style={{ textAlign: "center", color: "#ef4444", fontWeight: 700, fontSize: "1.3rem", marginTop: "80px" }}>
      Please connect your wallet to access this page.
    </div>
  );
}