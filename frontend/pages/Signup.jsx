import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../src/utils/auth";

function Signup() {
    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL;
    const [form, setForm] = useState({ username: "", email: "", password: "", password2: "", });
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");

        try {
            const response = await fetch(`${BASE_URL}/api/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = response.json();
            if (response.ok) {
                saveToken(data);
                setMsg("Account created Redirecting to login...");
                setTimeout(() => { navigate("/login"); }, 1200);
            } else {
                setMsg(data.detail || data.password || JSON.stringify(data));
            }
        } catch (error) {
            console.error(error)
            setMsg('Signup failed.');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white p-6 rounded shadow">
                <h2 className="text=2xl font-bold mb-4"> Signup </h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        name="username"
                        onChange={handleChange}
                        value={form.username}
                        placeholder="Username"
                        required
                        className="w-full p-2 border rounded"
                    />
                    <input
                        name="email"
                        type="email"
                        onChange={handleChange}
                        value={form.email}
                        placeholder="Email"
                        required
                        className="w-full p-2 border rounded"
                    />
                    <input
                        name="password"
                        type="password"
                        onChange={handleChange}
                        value={form.password}
                        placeholder="Password"
                        required
                        className="w-full p-2 border rounded"
                    />
                    <input
                        name="password2"
                        type="password"
                        onChange={handleChange}
                        value={form.password2}
                        placeholder="Password2"
                        required
                        className="w-full p-2 border rounded"
                    />
                    <button className="w-full bg-blue-600 text-white py-2 rounded">
                        Signup
                    </button>
                    {msg && <p className="mt-3 text-sm"> {msg} </p>}
                    <div className="mt-4 text-sm">
                        Already registered {" "}
                        <a href="/login" className="text-blue-600 hover:underline">
                            Login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;