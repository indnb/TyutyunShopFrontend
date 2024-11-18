import React, { useContext, useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

function PrivateRoute({ component: Component, adminOnly = false, ...rest }) {
    const { isAuthenticated, isAdmin, checkAuth } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            await checkAuth();
            setLoading(false);
        };
        verifyAuth();
    }, [checkAuth]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Route
            {...rest}
            render={(props) => {
                if (!isAuthenticated) {
                    return <Redirect to="/login" />;
                }

                if (adminOnly && !isAdmin) {
                    return <Redirect to="/user/profile" />;
                }

                return <Component {...props} />;
            }}
        />
    );
}

export default PrivateRoute;
