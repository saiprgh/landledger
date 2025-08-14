import React, { useEffect, useState } from "react";
import { AptosClient } from "aptos";

const NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
const client = new AptosClient(NODE_URL);
const MODULE_ADDRESS = "0xb98e70c73b0976df7fa27b0a5d1230ed448c0706b57147a51566dc7a5097f30b";

interface FarmView {
  id: number;
  owner: string;
  name: string;
  location: string;
  total_tokens: number;
  tokens_sold: number;
  price_per_token: number;
}

const cardStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  margin: "12px 0",
  padding: "16px",
  background: "#f9fafb",
  boxShadow: "0 2px 8px rgba(34,211,238,0.08)",
};


export default function FarmList() {
  const [farms, setFarms] = useState<FarmView[]>([]);
  const [address, setAddress] = useState("");

  useEffect(() => {
    (async () => {
      if (window.petra?.isConnected) {
        const ok = await window.petra.isConnected();
        if (ok) {
          const acc = await window.petra.account();
          setAddress(acc.address);
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (address) loadFarms();
  }, [address]);

  const loadFarms = async () => {
    try {
      const res: any = await client.view({
        function: `${MODULE_ADDRESS}::farmland_simple::get_farms`,
        type_arguments: [],
        arguments: [address],
      });
      const list: FarmView[] = (res[0] || []).map((f: any) => ({
        id: Number(f.id),
        owner: f.owner,
        name: f.name,
        location: f.location,
        total_tokens: Number(f.total_tokens),
        tokens_sold: Number(f.tokens_sold),
        price_per_token: Number(f.price_per_token),
      }));
      setFarms(list);
    } catch (err) {
      console.error("Fetch farms error", err);
      alert("Error fetching farms (check console)");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 32, background: "#f9fafb", borderRadius: "18px", boxShadow: "0 4px 24px rgba(34,211,238,0.10)" }}>
      <h2 style={{ color: "#0ea5e9", marginBottom: 32, fontWeight: 800, fontSize: "1.6rem", textAlign: "center" }}>Farm List</h2>
      <button
        style={{
          marginBottom: 18,
          padding: "12px 0",
          borderRadius: "10px",
          background: "linear-gradient(90deg,#22d3ee,#4ade80)",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1.08rem",
          boxShadow: "0 2px 8px rgba(34,211,238,0.15)",
          border: "none",
          transition: "background 0.2s, transform 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "linear-gradient(90deg,#4ade80,#22d3ee)")}
        onMouseLeave={e => (e.currentTarget.style.background = "linear-gradient(90deg,#22d3ee,#4ade80)")}
        onClick={loadFarms}
      >
        Refresh
      </button>
      {farms.length === 0 ? (
        <div style={{ color: "#64748b", textAlign: "center", margin: "24px 0", fontSize: "1.08rem" }}>No farms found.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {farms.map((f) => (
            <div key={f.id} style={{ ...cardStyle, borderRadius: "14px", boxShadow: "0 2px 12px rgba(34,211,238,0.08)", padding: "20px" }}>
              <div style={{ fontSize: "1.18rem", fontWeight: 700, color: "#0ea5e9", marginBottom: "8px" }}>{f.name}</div>
              <div style={{ color: "#334155", marginBottom: 6, fontSize: "1.08rem" }}>Location: <b>{f.location}</b></div>
              <div style={{ color: "#059669", fontWeight: 600 }}>{f.tokens_sold}/{f.total_tokens} tokens sold</div>
              <div style={{ color: "#f59e42", fontWeight: 600 }}>Price: {f.price_per_token / 100_000_000} APT</div>
                <div style={{ fontSize: "0.98rem", color: "#64748b", marginTop: "6px" }}>
                  <div style={{ fontWeight: 600, marginBottom: "2px" }}>Owner:</div>
                  <span style={{ display: "block", wordBreak: "break-all", overflowWrap: "break-word", maxWidth: "600px", whiteSpace: "pre-wrap" }}>{f.owner}</span>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
