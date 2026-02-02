import React, { createContext, useContext, useEffect, useState } from "react";
import { TenantService } from "@/utils/tenant.service";

const TenantContext = createContext<any>(null);

export const TenantProvider = ({ children}: {children: React.ReactNode}) => {
    const [rentals, setRentals] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);

    const refreshAll = async () => {
        setRentals(await TenantService.getMyRentals());
        setNotifications(await TenantService.getNotifications());
        setPayments(await TenantService.getPayments());
    }

    useEffect(() => {
        refreshAll();
    }, []);


    return (
        <TenantContext.Provider value = {{ rentals, notifications, payments, refreshAll}} >
            {children}
        </TenantContext.Provider>
    )
}


export const useTenant = () => useContext(TenantContext);