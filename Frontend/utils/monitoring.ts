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

// Page-level logging functions
export const logPageLoad = (pageName: string, message: string, data?: any, duration?: number) => {
    const timestamp = new Date().toISOString();
    const emoji = '📄';
    const prefix = `[${timestamp}] ${emoji} [${pageName}] [PAGE_LOAD]`;
    
    if (duration !== undefined) {
        console.log(`${prefix} ${message} (${duration}ms)`, data || '');
    } else {
        console.log(`${prefix} ${message}`, data || '');
    }
};

export const logPageAction = (pageName: string, action: string, data?: any, duration?: number) => {
    const timestamp = new Date().toISOString();
    const emoji = '⚡';
    const prefix = `[${timestamp}] ${emoji} [${pageName}] [PAGE_ACTION]`;
    
    if (duration !== undefined) {
        console.log(`${prefix} ${action} (${duration}ms)`, data || '');
    } else {
        console.log(`${prefix} ${action}`, data || '');
    }
};

export const logPageError = (pageName: string, message: string, error: any, duration?: number) => {
    const timestamp = new Date().toISOString();
    const emoji = '❌';
    const prefix = `[${timestamp}] ${emoji} [${pageName}] [PAGE_ERROR]`;
    
    console.error(`${prefix} ${message}`, { error: error.message || error, duration });
};
