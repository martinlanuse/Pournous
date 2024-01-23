import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import { isNumber } from "@/constants/isNumber";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

interface AddNewInvestmentModalProps {
  opened: boolean;
  onClose: () => void;
  getInvestments: () => void;
}

const AddNewInvestmentModal = (props: AddNewInvestmentModalProps) => {
  const { opened, onClose, getInvestments } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    planName: "",
    duration: "",
    ROIDaily: "",
    totalROI: "",
    amountInvested: "",
    username: "",
  });

  const dailyRoi = useMemo(() => {
    return isNumber(Number(data.totalROI) / Number(data.duration))
      ? (Number(data.totalROI) / Number(data.duration)).toFixed(1)
      : "";
  }, [data.duration, data.totalROI]);

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      ROIDaily: dailyRoi,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dailyRoi]);

  const addPlanHandler = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/admin/investment", data);
      if (res.data.error) throw new Error(res.data.error);
      onClose();
      getInvestments();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer
      size="lg"
      title="Créer un nouvel investissement"
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <div>Nom de l&apos;investissement:</div>
          <TextInput
            value={data.planName}
            onChange={(e) => setData({ ...data, planName: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div>Durée (jours):</div>
          <TextInput
            value={data.duration}
            onChange={(e) => {
              isNumber(+e.target.value) &&
                setData({ ...data, duration: e.target.value });
            }}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col w-full gap-1.5">
            <div> ROI (%):</div>
            <TextInput
              value={data.totalROI}
              onChange={(e) => {
                isNumber(+e.target.value) &&
                  setData({ ...data, totalROI: e.target.value });
              }}
            />
          </div>

          <div className="flex flex-col w-full gap-1.5">
            <div>Jour ROI (%):</div>
            <TextInput value={data.ROIDaily} disabled onChange={() => {}} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col w-full gap-1.5">
            <div>Nom d&apos;utilisateur du compte:</div>
            <TextInput
              value={data.username}
              onChange={(e) => {
                setData({ ...data, username: e.target.value });
              }}
            />
          </div>

          <div className="flex flex-col w-full gap-1.5">
            <div>Montant à investir:</div>
            <TextInput
              value={data.amountInvested}
              onChange={(e) => {
                isNumber(+e.target.value) &&
                  setData({ ...data, amountInvested: e.target.value });
              }}
            />
          </div>
        </div>
        <Button loading={loading} label="Ajouter" onClick={addPlanHandler} />
      </div>
    </ModalContainer>
  );
};

export default AddNewInvestmentModal;
