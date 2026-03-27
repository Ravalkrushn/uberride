import React, { useState, useEffect } from "react";
import { userService } from "../../services/user.service";
import { formatCurrency } from "../../utils/formatCurrency";
import { Button } from "../../components/common/Button";
import { InputField } from "../../components/common/InputField";
import { Loader } from "../../components/common/Loader";
import toast from "react-hot-toast";

export const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [addAmount, setAddAmount] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await userService.getWallet();
      setWallet(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleAddMoney = async () => {
    if (!addAmount || parseInt(addAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      await userService.addMoneyToWallet(parseInt(addAmount));
      setAddAmount("");
      toast.success("Money added to wallet");
      fetchWallet();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add money");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-6">My Wallet</h1>

      <div className="bg-black text-white p-6 rounded-lg mb-6 text-center">
        <p className="text-gray-300 mb-2">Available Balance</p>
        <p className="text-4xl font-bold">
          {formatCurrency(wallet?.balance || 0)}
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <InputField
          label="Add Money"
          type="number"
          value={addAmount}
          onChange={(e) => setAddAmount(e.target.value)}
          placeholder="Enter amount"
        />
        <Button onClick={handleAddMoney} loading={loading} className="w-full">
          Add to Wallet
        </Button>
      </div>

      {wallet?.transactions && wallet.transactions.length > 0 && (
        <div>
          <h2 className="font-bold mb-3">Recent Transactions</h2>
          {wallet.transactions.map((t) => (
            <div key={t._id} className="flex justify-between py-2 border-b">
              <span>{t.description}</span>
              <span
                className={
                  t.type === "credit" ? "text-green-600" : "text-red-600"
                }
              >
                {t.type === "credit" ? "+" : "-"}
                {formatCurrency(t.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
