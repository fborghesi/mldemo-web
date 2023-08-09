import Link from "next/link";
import AuthBoundary from "../src/auth/AuthBoundary";
import { AuthContext } from "../src/auth/AuthContext";
import AppNavBar from "../src/components/AppNavBar";

const Dashboard = () => {
    return (
        <AuthBoundary>
            <AppNavBar />
            <h1>Welcome!</h1>
        </AuthBoundary>
    );
};

export default Dashboard;
