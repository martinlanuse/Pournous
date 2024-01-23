import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import useCompany from "@/components/hooks/useCompany";
import ModalContainer from "@/components/modals/ModalContainer";
import formatNumber from "@/constants/formatNumber";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface WithdrawModalProps {
  opened: boolean;
  onClose: () => void;
  user: userSchemaType;
}

const WithdrawModal = (props: WithdrawModalProps) => {
  const { opened, onClose, user } = props;
  const [loading, setLoading] = useState(false);
  const [amountInput, setAmountInput] = useState("");
  const router = useRouter();

  const { company } = useCompany();
  const currency = company?.currency.symbol;

  const withdrawalHandler = async () => {
    try {
      if (amountInput === "" || Number(amountInput) === 0)
        throw new Error("Invalid Input value: Input cannot be 0 or empty");

      setLoading(true);
      const { data } = await axios.post("/api/invest/withdrawal", {
        amount: Number(amountInput),
      });
      if (data.error) throw new Error(data.error);

      const { _id: transactionId }: TransactionProps = data;
      router.push(`/transaction-info/${transactionId}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer title="Retrait" opened={opened} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div>
          Le montant pouvant être retiré est {currency}
          {formatNumber(user.investWithdrawableBalance)} <br /> 
        </div>

        <TextInput
          value={amountInput}
          onChange={(e) => {
            if (isNaN(Number(e.target.value))) return;
            setAmountInput(e.target.value);
          }}
          placeholder="Entrez le montant à retirer"
        />
        <Button
          loading={loading}
          label="Retrait"
          onClick={withdrawalHandler}
        />
      </div>
    </ModalContainer>
  );
};

export default WithdrawModal;
