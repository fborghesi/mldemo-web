import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ReactNode } from "react";
import { useAuthContext } from "./AuthContext";

const AdminBoundary = (props: {
  children: ReactNode;
}) => {
    const authContext = useAuthContext();
    const user = authContext?.user;
    

    if (!user?.is_admin) {
        return (<>
            <h1>Forbidden</h1>
            <p>You need to have Administrator priviliges to access this section.</p>
        </>);
    }
    
    return <>{props.children}</>;
};

export default AdminBoundary;
