"use client";

import Button from "@/components/Button";
import ChangeUserRoleModal from "@/components/admin/user/ChangeUserRoleModal";
import ChangeUserStatusModal from "@/components/admin/user/ChangeUserStatusModal";
import DeleteUserModal from "@/components/admin/user/DeleteUserModal";
import EditBalanceModal from "@/components/admin/user/EditBalanceModal";
import EditDetailsModal from "@/components/admin/user/EditDetailsModal";
import ResetPasswordModal from "@/components/admin/user/ResetPasswordModal";
import SendEmailModal from "@/components/admin/user/SendEmailModal";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import formatNumber from "@/constants/formatNumber";
import { Avatar, Loader } from "@mantine/core";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { IoMdPerson } from "react-icons/io";

const Page = () => {
  const { mode } = useTheme();
  const userId = useParams().userId;
  const [user, setUser] = useState<userSchemaType>();
  const router = useRouter();

  const { company } = useCompany();
  const primaryLightColor = company?.color.primaryLight;
  const currency = company?.currency.symbol;

  const [modals, setModals] = useState({
    editDetails: false,
    editBalance: false,
    deleteUser: false,
    sendEmail: false,
    resetPassword: false,
    userRole: false,
    userStatus: false,
  });

  const getUser = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/users/${userId}`);
      if (data.error) throw new Error(data.error);
      setUser(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) getUser();
  }, [getUser, userId]);

  if (!user)
    return (
      <div className="w-full flex justify-center">
        <Loader color={primaryLightColor} />
      </div>
    );

  return (
    <>
      <div className={`flex justify-center pb-7`}>
        <div
          className={`w-[600px] max-w-full p-5 
        rounded-md shadow-md transition 
        flex flex-col items-center gap-7
         ${
           mode === "light"
             ? "shadow-gray-200 hover:shadow-gray-300"
             : " shadow-[#292929] hover:shadow-[#585858]"
         } `}
        >
          <div>
            {user.avatar && (
              <Avatar
                src={user.avatar.url}
                alt="its me"
                size="xl"
                radius="md"
              />
            )}

            {!user.avatar && (
              <Avatar color="red" alt="its me" size="xl" radius="xl">
                <IoMdPerson color={primaryLightColor} />
              </Avatar>
            )}
          </div>

          <div className="w-full flex items-center gap-3">
            <Button
              onClick={() => setModals({ ...modals, sendEmail: true })}
              label={"envoyer un email"}
            />
            <Button
              onClick={() => router.push(`/admin/users/${userId}/transactions`)}
              label={"transactions utilisateur"}
            />
          </div>

          <div className="flex flex-col w-full">
            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>nom complet:</div>
              <div>{user.fullname}</div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>identifiant:</div>
              <div>{user.username}</div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Email:</div>
              <div>{user.email}</div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Role:</div>
              <div>{user.role}</div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Manager:</div>
              <div>{user.manager.toUpperCase()}</div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Status:</div>
              <div>{user.status}</div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Solde du compte:</div>
              <div>
                {currency}
                {formatNumber(user.accountBalance)}
              </div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Solde de placement disponible:</div>
              <div>
                {currency}
                {formatNumber(user.investWithdrawableBalance)}
              </div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Solde du prêt:</div>
              <div>
                {currency}
                {formatNumber(user.loanBalance)}
              </div>
            </div>

            {user.phoneNumber && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>numéro de téléphone:</div>
                <div>{user.phoneNumber}</div>
              </div>
            )}

            {user.dateOfBirth && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>date de naissance:</div>
                <div>{user.dateOfBirth}</div>
              </div>
            )}

            {user.country && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>pays:</div>
                <div>{user.country}</div>
              </div>
            )}

            {user.city && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>ville:</div>
                <div>{user.city}</div>
              </div>
            )}

            {user.address && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>adresse:</div>
                <div>{user.address}</div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row w-full gap-3">
            <Button
              onClick={() => setModals({ ...modals, editDetails: true })}
              outline
              label={"modifier les détails"}
            />
            <Button
              onClick={() => setModals({ ...modals, editBalance: true })}
              label={"Modifier le solde"}
            />
          </div>

          <div className="flex flex-col sm:flex-row w-full gap-3">
            <Button
              onClick={() => setModals({ ...modals, deleteUser: true })}
              label={"Supprimer l'utilisateur"}
            />

            <Button
              outline
              onClick={() => setModals({ ...modals, resetPassword: true })}
              label={"réinitialiser le mot de passe"}
            />
          </div>

          <div className="flex flex-col sm:flex-row w-full gap-3">
            <Button
              outline
              onClick={() => setModals({ ...modals, userStatus: true })}
              label={"Bloquer/activer l’utilisateur"}
            />

            <Button
              onClick={() => setModals({ ...modals, userRole: true })}
              label={"Modifier le rôle de l’utilisateur"}
            />
          </div>
        </div>
      </div>

      <EditDetailsModal
        user={user}
        opened={modals.editDetails}
        onClose={() => setModals({ ...modals, editDetails: false })}
      />
      <EditBalanceModal
        user={user}
        opened={modals.editBalance}
        onClose={() => setModals({ ...modals, editBalance: false })}
      />
      <DeleteUserModal
        user={user}
        opened={modals.deleteUser}
        onClose={() => setModals({ ...modals, deleteUser: false })}
      />

      <ResetPasswordModal
        user={user}
        opened={modals.resetPassword}
        onClose={() => setModals({ ...modals, resetPassword: false })}
      />

      <SendEmailModal
        user={user}
        opened={modals.sendEmail}
        onClose={() => setModals({ ...modals, sendEmail: false })}
      />

      <ChangeUserRoleModal
        user={user}
        opened={modals.userRole}
        onClose={() => setModals({ ...modals, userRole: false })}
      />

      <ChangeUserStatusModal
        user={user}
        opened={modals.userStatus}
        onClose={() => setModals({ ...modals, userStatus: false })}
      />
    </>
  );
};

export default Page;
