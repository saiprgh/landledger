import React, { useState } from "react";
import { AptosClient, Types } from "aptos";

const NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
const client = new AptosClient(NODE_URL);
const MODULE_ADDRESS = "0xb98e70c73b0976df7fa27b0a5d1230ed448c0706b57147a51566dc7a5097f30b";

const inputStyle: React.CSSProperties = {
  padding: "8px",
  margin: "6px 0",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "100%",
  fontSize: "1rem",
  boxSizing: "border-box",
};
const buttonStyle: React.CSSProperties = {
  padding: "10px 20px",
  margin: "8px 0",
  borderRadius: "6px",
  border: "none",
  background: "linear-gradient(90deg,#4ade80,#22d3ee)",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1rem",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(34,211,238,0.15)",
  transition: "background 0.2s",
};
const cardStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  margin: "12px 0",
  padding: "16px",
  background: "#f9fafb",
  boxShadow: "0 2px 8px rgba(34,211,238,0.08)",
};
const labelStyle: React.CSSProperties = {
  fontWeight: "bold",
  marginBottom: "4px",
  display: "block",
  color: "#0ea5e9",
};


export default function Invest() {
  const [investForm, setInvestForm] = useState({ farmIndex: "", tokenAmount: "" });

  const invest = async () => {
    try {
      const tx: Types.EntryFunctionPayload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::farmland_simple::invest_in_farm`,
        type_arguments: [],
        arguments: [Number(investForm.farmIndex), Number(investForm.tokenAmount)],
      };
      const sent = await window.petra!.signAndSubmitTransaction(tx);
      await client.waitForTransaction(sent.hash);
      alert("Investment successful!");
    } catch (err) {
      console.error("Invest error", err);
      alert("Invest failed (check console)");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 32, background: "#f9fafb", borderRadius: "18px", boxShadow: "0 4px 24px rgba(34,211,238,0.10)" }}>
      <h2 style={{ color: "#0ea5e9", marginBottom: 32, fontWeight: 800, fontSize: "1.6rem", textAlign: "center" }}>Invest in Farm</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div>
          <label style={{ ...labelStyle, fontSize: "1.08rem" }}>Farm Index</label>
          <input style={{ ...inputStyle, fontSize: "1.08rem", padding: "12px" }} placeholder="Farm Index" value={investForm.farmIndex} onChange={(e) => setInvestForm({ ...investForm, farmIndex: e.target.value })} />
        </div>
        <div>
          <label style={{ ...labelStyle, fontSize: "1.08rem" }}>Token Amount</label>
          <input style={{ ...inputStyle, fontSize: "1.08rem", padding: "12px" }} placeholder="Token Amount" value={investForm.tokenAmount} onChange={(e) => setInvestForm({ ...investForm, tokenAmount: e.target.value })} />
        </div>
        <button
          style={{
            ...buttonStyle,
            fontSize: "1.1rem",
            padding: "14px 0",
            borderRadius: "10px",
            background: "linear-gradient(90deg,#22d3ee,#4ade80)",
            boxShadow: "0 2px 8px rgba(34,211,238,0.15)",
            marginTop: "12px",
            transition: "background 0.2s, transform 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "linear-gradient(90deg,#4ade80,#22d3ee)")}
          onMouseLeave={e => (e.currentTarget.style.background = "linear-gradient(90deg,#22d3ee,#4ade80)")}
          onClick={invest}
        >
          Invest
        </button>
      </div>
    </div>
  );
}
