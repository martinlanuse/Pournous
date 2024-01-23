"use client";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import ModalContainer from "@/components/modals/ModalContainer";
import { Select } from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface TopUpModalProps {
  opened: boolean;
  onClose: () => void;
}

const LoanModal = (props: TopUpModalProps) => {
  const { mode } = useTheme();
  const [amountInput, setAmountInput] = useState("");
  const router = useRouter();

  const { opened, onClose } = props;
  const [loading, setLoading] = useState(false);

  const { company } = useCompany();

  const [reasonValue, setReasonValue] = useState<string | null>(null);
  const loanReasons = [
    { value: "dépenses personnelles", label: "dépenses personnelles" },
    { value: "consolidation de dette", label: "consolidation de dette" },
    { value: "situations d’urgence", label: "situations d’urgence" },
    { value: "Prêts aux études/étudiants", label: "Prêts aux études/étudiants" },
  ];

  const [durationValue, setDurationValue] = useState<string | null>(null);
  const loanDurations = [
    { value: "1 mois", label: "1 mois - 2% Intérêt" },
    { value: "2 mois", label: "2 mois - 5% Intérêt" },
    { value: "3 mois", label: "3 mois - 9% Intérêt" },
    { value: "6 mois", label: "6 mois - 14% Intérêt" },
    { value: "1 an", label: "1 an - 25% Intérêt" },
  ];

  const inputInvalid =
    amountInput.trim() === "" ||
    Number(amountInput) <= 0 ||
    !durationValue ||
    !reasonValue;

  const requestLoanHanlder = async () => {
    try {
      if (inputInvalid)
        throw new Error(
          "Assurez-vous que vous avez rempli tous les champs de saisie nécessaires"
        );

      if (Number(amountInput) < Number(company?.loan.minimum))
        throw new Error(
          `Le montant minimum à demander est de ${company?.loan.minimum}`
        );
      if (Number(amountInput) > Number(company?.loan.maximum))
        throw new Error(
          `le montant maximal de la demande est ${company?.loan.maximum}`
        );

      setLoading(true);
      const { data } = await axios.post("/api/loan/request", {
        amount: Number(amountInput),
        loanDuration: durationValue,
        loanReason: reasonValue,
      });
      if (data.error) throw new Error(data.error);
      const transactionId = (data as { _id: string })._id;
      router.push(`/transaction-info/${transactionId}`);
    } catch (error: any) {
      toast.error(error.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer title="Obtenir un prêt" opened={opened} onClose={onClose}>
      <div className="h-fit min-h-[450px] flex flex-col justify-between">
        <div className="flex flex-col gap-5">
          <TextInput
            value={amountInput}
            onChange={(e) => {
              if (isNaN(Number(e.target.value))) return;
              setAmountInput(e.target.value);
            }}
            placeholder="Combien souhaitez-vous emprunter?"
          />

          <Select
            disabled={false}
            placeholder="Sélectionner"
            label="Motif pour solliciter un prêt"
            value={reasonValue}
            onChange={setReasonValue}
            data={loanReasons}
            classNames={{
              input: "border-rose-300 focus:border-rose-500 h-[55px]",
              label: `${
                mode == "light" ? "text-slate-700" : "text-white"
              } text-base font-medium`,
            }}
          />

          <Select
            disabled={false}
            placeholder="Sélectionner"
            label="Combien de temps cela vous prendra-t-il pour rembourser?"
            value={durationValue}
            onChange={setDurationValue}
            data={loanDurations}
            classNames={{
              input: "border-rose-300 focus:border-rose-500 h-[55px]",
              label: `${
                mode == "light" ? "text-slate-700" : "text-white"
              } text-base font-medium`,
            }}
          />
        </div>

        <Button
          loading={loading}
          onClick={requestLoanHanlder}
          label="Effectuer la demande"
        />
      </div>
    </ModalContainer>
  );
};

export default LoanModal;
