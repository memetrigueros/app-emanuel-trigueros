import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import api from "@/api/axiosInstance";
import { Loader } from "lucide-react";

/**
 * Component that allows registration and access using user credentials.
 * @param {Object} props - Component Properties
 * @param {boolean} props.dialogOpen - Controls dialog visibility
 * @param {string} props.navigateTo - Route to visit after login
 */
export function RegisterDialog({
    dialogOpen,
    setDialogOpen,
    navigateTo
}: {
    dialogOpen: boolean;
    setDialogOpen: (value: boolean) => void;
    navigateTo: string
}) {
    const [email, setEmail] = useState("");
    const [emailExists, setEmailExists] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Registration form
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        address: "",
        birthDate: "",
        password: "",
    });

    
    // Function that validates if the user exists
    const handleContinue = async () => {
        if (!email) {
            setError("El correo electrónico es obligatorio.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post("/users/exists", { email });
            if (data?.email) {
                setEmailExists(true);
            } else {
                setEmailExists(false);
            }
        } catch (err: any) {
            setEmailExists(false);
        } finally {
            setLoading(false);
        }
    };

    // Registration and login
    const handleRegisterOrLogin = async () => {
        if (emailExists) {
            if (!formData.password) return setError("La contraseña es obligatoria.");
            setLoading(true);
            try {
                const { data } = await api.post("/users/login", {
                    email,
                    password: formData.password,
                });
                localStorage.setItem("token", data.token);
                setDialogOpen(false);
                window.location.href = navigateTo;
            } catch (error) {
                setError("Credenciales incorrectas.");
            } finally {
                setLoading(false);
            }
        } else {
            if (
                !formData.firstName ||
                !formData.lastName ||
                !formData.address ||
                !formData.birthDate ||
                !formData.password
            ) {
                return setError("Todos los campos son obligatorios.");
            }
            setLoading(true);
            try {
                const { data } = await api.post("/users/register", {
                    ...formData,
                    email,
                });
                localStorage.setItem("token", data.token);
                setDialogOpen(false);
                window.location.href = navigateTo;
            } catch (error) {
                setError("Error al registrar. Inténtalo de nuevo.");
            } finally {
                setLoading(false);
            }
        }
    };

    // set form fields from input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // initial setup
    useEffect(() => {
        setEmailExists(null);
        setEmail("");
        setFormData(
            {
                firstName: "",
                lastName: "",
                address: "",
                birthDate: "",
                password: "",
            }
        );
    }, [dialogOpen]);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="overflow-y-auto p-4 sm:rounded-lg">
                <DialogHeader>
                    <DialogTitle>
                        {emailExists === null
                            ? "Ingresa tu correo electrónico"
                            : emailExists
                                ? "Introduce tu contraseña"
                                : "Completa tu registro"}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* email */}
                    <Input
                        placeholder="email@example.com"
                        value={email}
                        disabled={emailExists !== null}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {/* login */}
                    {emailExists && (
                        <Input
                            placeholder="Contraseña"
                            name="password"
                            type="password"
                            onChange={handleChange}
                        />
                    )}

                    {/* register */}
                    {!emailExists && emailExists !== null && (
                        <>
                            <Input
                                placeholder="Nombre"
                                name="firstName"
                                onChange={handleChange}
                            />
                            <Input
                                placeholder="Apellido"
                                name="lastName"
                                onChange={handleChange}
                            />
                            <Input
                                placeholder="Dirección"
                                name="address"
                                onChange={handleChange}
                            />
                            <Input
                                placeholder="Fecha de nacimiento (YYYY-MM-DD)"
                                name="birthDate"
                                type="date"
                                onChange={handleChange}
                            />
                            <Input
                                placeholder="Contraseña"
                                name="password"
                                type="password"
                                onChange={handleChange}
                            />
                        </>
                    )}

                    {error && <p className="text-red-600 text-sm">{error}</p>}
                </div>

                <DialogFooter>
                    <Button
                        className="w-full mt-4 bg-green-600 text-white hover:bg-green-700"
                        onClick={
                            emailExists === null ? handleContinue : handleRegisterOrLogin
                        }
                    >
                        {loading ? (
                            <Loader className="animate-spin w-5 h-5" />
                        ) : emailExists === null ? (
                            "Continuar"
                        ) : emailExists ? (
                            "Iniciar sesión"
                        ) : (
                            "Registrarse"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
