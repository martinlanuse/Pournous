import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState,useRef } from "react";
import { toast } from "react-hot-toast";
// import SignatureCanvas from 'react-signature-canvas'
interface AccountInactivityModalProps {
  opened: boolean;
  onClose: () => void;
  signUp: () => void;
  loading: boolean;
}

const AccountInactivityModal = (props: AccountInactivityModalProps) => {
  const { opened, onClose, signUp, loading } = props;
  const router = useRouter();

  const signatureRef = useRef();

  // const clearSignature = () => {
  //   signatureRef.current.clear();
  // };

//   const saveSignature = () => {
//     const signatureData = signatureRef.current.toDataURL();
//     // Faites quelque chose avec les données, par exemple, les envoyer au serveur
//     alert("Signature enregistrée!");
//     // Vous pouvez réinitialiser la signature si nécessaire
//     clearSignature();
// };

  const signUpHandler = async () => {
    signUp();
    onClose();
  };

  return (
    <ModalContainer
      title={`Account Inactivity Notice`}
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3">
        <div>
          If you plan to change your country location after registration, please
          note that your account will be temporarily inactive for a few months
          during this transition. This measure ensures the security of your
          account. You will regain access once the transition is complete.
          <div>
      {/* Signature Canvas */}
      {/* <SignatureCanvas ref={signatureRef} canvasProps={{ width: 400, height: 200, style: { border: '1px solid #000' } }} /> */}

      {/* Boutons */}
      {/* <div>
        <button onClick={clearSignature}>Effacer Signature</button>
        <button onClick={saveSignature}>Enregistrer Signature</button>
      </div> */}
    </div>
        </div>
        <div className="flex gap-3">
          <Button
            loading={loading}
            label="I Understand, Continue"
            onClick={signUpHandler}
          />
        </div>
      </div>
    </ModalContainer>
  );
};

export default AccountInactivityModal;
