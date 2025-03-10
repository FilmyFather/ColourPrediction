import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

function App() {
  const [results, setResults] = useState([]);
  const [latestResult, setLatestResult] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/results").then((res) => setResults(res.data));

    socket.on("newResult", (newResult) => {
      setLatestResult(newResult);
      setResults((prevResults) => [newResult, ...prevResults.slice(0, 9)]);
    });

    return () => socket.off("newResult");
  }, []);

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>Yuvraj Color Hack</h1>
      <h2>Latest Result: {latestResult || "Waiting..."}</h2>
      <h3>Past Results:</h3>
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result.result}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
