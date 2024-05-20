import {useAuth} from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import {useRouter} from "next/router";
import RequireAuth from "@/components/RequireAuth";

function Dashboard() {
    const { user } = useAuth();
    const router = useRouter();

    return (
        <div>
            <Navbar />
            <h1>Hello, {user?.name}</h1>
        </div>
    )
}

export default RequireAuth(Dashboard);