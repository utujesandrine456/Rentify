export const logDashboard = (dashboard: 'TENANT' | 'LANDLORD', action: string, data?: any, duration?: number) => {
    const timestamp = new Date().toISOString();
    const emoji = '📊';
    const prefix = `[${timestamp}] ${emoji} [${dashboard}] [DASHBOARD]`;
    
    if (duration !== undefined) {
        console.log(`${prefix} ${action} (${duration}ms)`, data || '');
    } else {
        console.log(`${prefix} ${action}`, data || '');
    }
};

export const logDashboardSuccess = (dashboard: 'TENANT' | 'LANDLORD', action: string, data?: any, duration?: number) => {
    const timestamp = new Date().toISOString();
    const emoji = '✅';
    const prefix = `[${timestamp}] ${emoji} [${dashboard}] [DASHBOARD]`;
    
    if (duration !== undefined) {
        console.log(`${prefix} ${action} (${duration}ms)`, data || '');
    } else {
        console.log(`${prefix} ${action}`, data || '');
    }
};

export const logDashboardError = (dashboard: 'TENANT' | 'LANDLORD', action: string, error: any, duration?: number) => {
    const timestamp = new Date().toISOString();
    const emoji = '❌';
    const prefix = `[${timestamp}] ${emoji} [${dashboard}] [DASHBOARD]`;
    
    console.error(`${prefix} ${action}`, { error: error.message || error, duration });
};
