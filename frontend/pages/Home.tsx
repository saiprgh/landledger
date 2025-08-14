import React, { useEffect, useState } from "react";

const buttonStyle: React.CSSProperties = {
  padding: "12px 32px",
  margin: "12px 0",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(90deg,#22d3ee,#4ade80)",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1.1rem",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(34,211,238,0.15)",
  transition: "background 0.2s, transform 0.2s",
};

export default function Home() {
  const [address, setAddress] = useState("");
  const [connected, setConnected] = useState(false);

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

  return (
    <div style={{ maxWidth: 500, margin: "60px auto", padding: 32, background: "#f9fafb", borderRadius: "18px", boxShadow: "0 4px 24px rgba(34,211,238,0.10)", textAlign: "center" }}>
      <h2 style={{ color: "#0ea5e9", marginBottom: 32, fontWeight: 800, fontSize: "1.6rem" }}>Welcome to LandLedger</h2>
      {!connected ? (
        <button style={buttonStyle} onClick={connectPetra}>Connect Petra Wallet</button>
      ) : (
        <>
          <div style={{ marginBottom: 18, color: "#059669", fontWeight: 600, fontSize: "1.08rem", wordBreak: "break-all", maxWidth: "100%", overflowWrap: "break-word" }}>
            Connected: <span style={{ display: "inline-block", maxWidth: "320px", wordBreak: "break-all", overflowWrap: "break-word", verticalAlign: "bottom" }}>{address}</span>
          </div>
          <button style={{ ...buttonStyle, background: "#f87171", color: "#fff" }} onClick={disconnectPetra}>Disconnect</button>
        </>
      )}
    </div>
  );
}
