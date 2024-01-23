'use client';
import React, { useState } from "react";
import { FaPaperPlane, FaWallet } from "react-icons/fa";
import paymentCardDetails, { countryData } from "@/constants/paymentCard";
import PaymentCard from "@/components/authenticated/send-money/PaymentCard";
import SendMoneyPaywanderModal from "@/components/authenticated/send-money/SendMoneyPaywanderModal";
import SendMoneyModal from "@/components/authenticated/send-money/SendMoneyModal";
import { AiFillBank } from "react-icons/ai";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";

// ...

const Send = () => {
  const { mode } = useTheme();
  const [displayPayment, setDisplayPayments] = useState(paymentCardDetails);
  const [sendToPaywanderAccountModal, setSendToPaywanderAccountModal] =
    useState(false);

  const [sendToOthersModal, setSendToOthersModal] = useState(false);
  const [sendToOthersTitle, setSendToOthersTitle] = useState("");
  const [sendToOthersLogo, setSendToOthersLogo] = useState("");

  const { company } = useCompany();

  return (
    <div
      className="flex justify-center flex-col items-center gap-10"
    >
      <div
        className={`text-xl sm:text-2xl font-bold
      ${mode === "light" ? "text-slate-700" : "text-white"}`}
      >
        Envoyer de l&apos;argent
      </div>

      <div
        className={`w-full flex flex-col items-center gap-5`}
      >
        <PaymentCard
          onClick={() => setSendToPaywanderAccountModal(true)}
          label={`Envoyer vers un autre compte ${company?.name}`}
          icon={FaPaperPlane}
        />

        <div
          className={`text-lg sm:text-xl font-bold text-center
      ${mode === "light" ? "text-slate-700" : "text-white"}`}
        >
          Méthodes de retrait
        </div>

        <PaymentCard
          onClick={() => setSendToOthersModal(true)}
          icon={FaWallet}
          label="Retirer sur un portefeuille Crypto"
        />

        <PaymentCard
          disabled
          onClick={() => {}}
          icon={AiFillBank}
          label="Retirer sur votre banque "
        />
      </div>

      <SendMoneyPaywanderModal
        opened={sendToPaywanderAccountModal}
        onClose={() => setSendToPaywanderAccountModal(false)}
      />

      <SendMoneyModal
        icon={FaWallet}
        title={sendToOthersTitle}
        opened={sendToOthersModal}
        onClose={() => setSendToOthersModal(false)}
      />
    </div>
  );
};

export default Send;

