import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './App.module.css';

function App() {
  const [address, setAddress] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [blockchain, setBlockchain] = useState([]);

  // Fetch blockchain data when the component mounts
  useEffect(() => {
    getBlockchain();
  }, []);

  // Fetch blockchain data
  const getBlockchain = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getBlockchain');
      setBlockchain(response.data.chain);
    } catch (error) {
      console.error("Error fetching blockchain:", error);
    }
  };

  // Fetch balance of the given address
  const getBalance = async () => {
    if (!address) {
      alert("Please enter an address.");
      return;
    }
    try {
      const response = await axios.get('http://localhost:5000/getBalance/${address}');
      setBalance(response.data.balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // Mine a new block
  const mineBlock = async () => {
    if (!address) {
      alert("Please enter an address to receive mining rewards.");
      return;
    }
    try {
      await axios.post('http://localhost:5000/mineBlock', { miningRewardAddress: address });
      alert("Block mined successfully!");
      getBlockchain();  // Refresh blockchain after mining
    } catch (error) {
      console.error("Error mining block:", error);
      alert("Error mining block. Please try again.");
    }
  };

  // Add a new transaction
  const addTransaction = async () => {
    if (!address || !recipient || !amount) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const transaction = {
        fromAddress: address,
        toAddress: recipient,
        amount: amount,
      };
      await axios.post('http://localhost:5000/addTransaction', transaction);
      alert("Transaction added successfully!");
      getBlockchain();  // Refresh blockchain after adding transaction
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Error adding transaction. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Blockchain React Frontend</h1>

      <div className={styles.section}>
        <h2>Balance</h2>
        <input
          type="text"
          placeholder="Enter address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button onClick={getBalance}>Get Balance</button>
        <div className={styles.balance}>
          <h3>Balance: {balance}</h3>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Mine Block</h2>
        <button onClick={mineBlock}>Mine Block</button>
      </div>

      <div className={styles.section}>
        <h2>Add Transaction</h2>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button onClick={addTransaction}>Add Transaction</button>
      </div>

      <div className={styles.blockchain}>
        <h2>Blockchain</h2>
        <pre>{JSON.stringify(blockchain, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;