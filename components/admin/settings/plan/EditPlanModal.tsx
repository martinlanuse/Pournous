import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import { isNumber } from "@/constants/isNumber";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

interface EditPlanModalProps {
  opened: boolean;
  onClose: () => void;
  getPlan: () => void;
  planId: string;

  planName: string;
  minAmount: number;
  maxAmount: number;
  ROIDaily: number;
  totalROI: number;
  duration: number;
}

const EditPlanModal = (props: EditPlanModalProps) => {
  const {
    opened,
    onClose,
    getPlan,
    planId,
    planName,
    minAmount,
    maxAmount,
    ROIDaily,
    totalROI,
    duration,
  } = props;
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    planName,
    duration: duration.toString(),
    minAmount: minAmount.toString(),
    maxAmount: maxAmount.toString(),
    ROIDaily: ROIDaily.toString(),
    totalROI: totalROI.toString(),
  });

  const dailyRoi = useMemo(() => {
    return isNumber(Number(data.totalROI) / Number(data.duration))
      ? (Number(data.totalROI) / Number(data.duration)).toFixed(1)
      : "";
  }, [data.duration, data.totalROI]);

  useEffect(() => {
    setData({
      ...data,
      ROIDaily: dailyRoi,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dailyRoi]);

  const addPlanHandler = async () => {
    try {
      if (+data.minAmount > +data.maxAmount)
        throw new Error("Minimum Amount cannot be greater than Maximum Amount");
      setLoading(true);
      const res = await axios.patch(`/api/plan/${planId}`, data);
      if (res.data.error) throw new Error(res.data.error);
      onClose();
      getPlan();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer
      size="lg"
      title="Edit Package"
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <div>Package Name:</div>
          <TextInput
            value={data.planName}
            onChange={(e) => setData({ ...data, planName: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div>Duration (days):</div>
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
            <div>Total ROI (%):</div>
            <TextInput
              value={data.totalROI}
              onChange={(e) => {
                isNumber(+e.target.value) &&
                  setData({ ...data, totalROI: e.target.value });
              }}
            />
          </div>

          {/* <div className="flex flex-col w-full gap-1.5">
            <div>Daily ROI (%):</div>
            <TextInput value={data.ROIDaily} disabled onChange={() => {}} />
          </div> */}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col w-full gap-1.5">
            <div>Minimum Deposit ($):</div>
            <TextInput
              value={data.minAmount}
              onChange={(e) => {
                isNumber(+e.target.value) &&
                  setData({ ...data, minAmount: e.target.value });
              }}
            />
          </div>

          <div className="flex flex-col w-full gap-1.5">
            <div>Maximum Deposit ($):</div>
            <TextInput
              value={data.maxAmount}
              onChange={(e) => {
                isNumber(+e.target.value) &&
                  setData({ ...data, maxAmount: e.target.value });
              }}
            />
          </div>
        </div>
        <Button loading={loading} label="Update" onClick={addPlanHandler} />
      </div>
    </ModalContainer>
  );
};

export default EditPlanModal;
