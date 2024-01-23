"use client";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaUserAlt } from "react-icons/fa";
import { AiFillMail } from "react-icons/ai";
import { IoMdPerson } from "react-icons/io";
import Logo from "../Logo";
import { useRouter } from "next/navigation";
import Container from "./Container";
import ThemeToggle from "../ThemeToggle";
import useTheme from "../hooks/useTheme";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import validator from "validator";
import AccountInactivityModal from "./AccountInactivityModal";

interface RegisterProps {
  refUsername?: string | string[];
}

const Register = (props: RegisterProps) => {
  const { refUsername } = props;
  const router = useRouter();
  const { mode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [inputs, setInputs] = useState({
    fullName: "",
    email: "",
    password: "",
    username: "",
    refUsername: refUsername?.toString().toLowerCase() || "",
    isSecure: true,
  });

  const registerHandler = async () => {
    const data = {
      fullname: inputs.fullName,
      email: inputs.email,
      username: inputs.username,
      password: inputs.password,
      refUsername:
        inputs.refUsername.trim() === "" ? "NO REF" : inputs.refUsername,
    };

    const nameArr = data.fullname.trim().split(" ");
    if (nameArr.length < 2)
      return toast.error("Le prénom et le nom de famille sont nécessaires", {
        duration: 10000,
      });

    const checkNameLength = nameArr.map((item) => item.length < 2);
    if (checkNameLength.includes(true))
      return toast.error(
        "Votre prénom et votre nom de famille doivent comporter au moins deux caractères chacun.",
        { duration: 10000 }
      );

    const isEmail = validator.isEmail(data.email.trim());
    if (!isEmail) return toast.error("Ceci n&apos;est pas un email valide");

    const strongPassword = validator.isStrongPassword(data.password);
    if (!strongPassword)
      return toast.error(
        "Utilisez un mot de passe plus puissant. votre mot de passe doit comporter au moins 8 caractères, au moins un caractère majuscule, au moins un nombre et au moins un symbole(@ - . ; :)+(_)",
        { duration: 15000 }
      );

    if (data.username.trim().length < 4) {
      return toast.error("Votre nom d&apos;utilisateur doit avoir au moins 4 caractères");
    }

    if (data.username.trim().split(" ").length > 1)
      return toast.error(
        "Nom d&apos;utilisateur invalide : Nom d&apos;utilisateur doit être un mot",
        { duration: 10000 }
      );

    try {
      setLoading(true);
      const res = await axios.post("/api/auth/register", data);
      if (res.data.error) throw new Error(res.data.error);

      const res1 = await signIn("credentials", {
        email: inputs.email,
        password: inputs.password,
        redirect: false,
      });
      if (res1?.error) throw new Error(res1?.error);
      router.replace("/home");
      toast.success("login successful");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container>
        <div className="flex flex-col gap-2.5 w-full items-center">
          <Logo />
          <ThemeToggle />
          <div
            className={`font-bold text-2xl md:text-3xl 
        ${mode === "light" ? "text-slate-700" : "text-white"}`}
          >
           Créer un nouveau compte
          </div>
        </div>

        <div className="flex flex-col gap-2.5 w-full">
          <TextInput
            id="name"
            icon={IoMdPerson}
            placeholder="Nom entier"
            value={inputs.fullName}
            onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
          />

          <TextInput
            id="email"
            icon={AiFillMail}
            placeholder="Votre email"
            value={inputs.email}
            onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
          />

          <TextInput
            id="username"
            icon={FaUserAlt}
            placeholder="Votre identifiant"
            value={inputs.username}
            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
          />

          <TextInput
            id="password"
            icon={inputs.isSecure ? FaEye : FaEyeSlash}
            placeholder="Votre mot de passe"
            secureEntry={inputs.isSecure}
            iconAction={() =>
              setInputs({ ...inputs, isSecure: !inputs.isSecure })
            }
            value={inputs.password}
            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
          />

          <TextInput
            id="refUsername"
            icon={FaUserAlt}
            placeholder="Entrez le nom d’utilisateur de référence (facultatif)"
            value={inputs.refUsername}
            onChange={(e) =>
              setInputs({ ...inputs, refUsername: e.target.value })
            }
          />
        </div>

        <Button
          outline={false}
          small={false}
          label={"Inscription"}
          onClick={() => setModalOpen(true)}
          loading={loading}
        />

        <div className="flex flex-col gap-2.5 w-full items-center">
          <div
            className={`font-semibold 
        ${mode === "light" ? "text-gray-500" : "text-white"}`}
          >
            Vous avez déjà un compte ?
          </div>

          <Button
            outline
            label={"Connexion"}
            onClick={() => {
              router.push("/login");
            }}
          />
        </div>
      </Container>

      <AccountInactivityModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        signUp={registerHandler}
        loading={loading}
      />
    </>
  );
};
export default Register;
