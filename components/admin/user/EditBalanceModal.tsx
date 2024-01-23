import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import { isNumber } from "@/constants/isNumber";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface EditBalanceModalProps {
  opened: boolean;
  onClose: () => void;
  user: userSchemaType;
}

const EditBalanceModal = (props: EditBalanceModalProps) => {
  const { opened, onClose, user } = props;
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    accountBalance: "",
    investWithdrawableBalance: "",
    loanBalance: "",
  });

  useEffect(() => {
    setInput({
      accountBalance: user.accountBalance.toString() || "",
      investWithdrawableBalance:
        user.investWithdrawableBalance.toString() || "",
      loanBalance: user.loanBalance.toString() || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handler = async () => {
    try {
      if (
        input.accountBalance.trim() === "" ||
        input.investWithdrawableBalance.trim() === "" ||
        input.loanBalance.trim() === ""
      )
        throw new Error("Field cannot be empty");

      setLoading(true);

      const { data } = await axios.post("/api/admin/users/edit-balance", {
        accountBalance: Number(input.accountBalance),
        investWithdrawableBalance: Number(input.investWithdrawableBalance),
        loanBalance: Number(input.loanBalance),
        userId: user._id,
      });
      if (data.error) throw new Error(data.error);

      toast.success("Balance Updated");
      location.reload();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer title="" opened={opened} onClose={onClose}>
      <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
          <label htmlFor="account-balance">Solde de compte</label>
          <TextInput
            id="account-balance"
            value={input.accountBalance}
            onChange={(e) => {
              if (!isNumber(+e.target.value)) return;
              setInput({ ...input, accountBalance: e.target.value });
            }}
            placeholder="Solde de compte"
          />

          <label htmlFor="invest-balance">
          Solde d&apos;investissement retirable
          </label>
          <TextInput
            id="invest-balance"
            value={input.investWithdrawableBalance}
            onChange={(e) => {
              if (!isNumber(+e.target.value)) return;
              setInput({ ...input, investWithdrawableBalance: e.target.value });
            }}
            placeholder="Investir le solde"
          />

          <label htmlFor="loan-balance">Solde du prêt</label>
          <TextInput
            id="loan-balance"
            value={input.loanBalance}
            onChange={(e) => {
              if (!isNumber(+e.target.value)) return;
              setInput({ ...input, loanBalance: e.target.value });
            }}
            placeholder="Solde du prêt"
          />
        </div>
        
        <Button loading={loading} label="Recharger" onClick={handler} />
      </div>
    </ModalContainer>
  );
};

export default EditBalanceModal;
