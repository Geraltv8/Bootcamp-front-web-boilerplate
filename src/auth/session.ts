import type { SessionPayload, UserRole } from '../types/Api.type';

const SESSION_EVENT = 'session-changed';

const isUserRole = (value: unknown): value is UserRole => (
    value === 'PACIENTE'
    || value === 'RECEPCIONISTA'
    || value === 'ADMIN'
    || value === 'MEDICO'
);

const parsePayload = (token: string): SessionPayload | null => {
    try {
        const encodedPayload = token.split('.')[1];
        if (!encodedPayload) return null;

        const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
        const payloadValue: unknown = JSON.parse(atob(base64));
        if (typeof payloadValue !== 'object' || payloadValue === null) return null;

        const payload = payloadValue as Record<string, unknown>;
        if (
            typeof payload.id !== 'string'
            || typeof payload.user !== 'string'
            || !isUserRole(payload.rol)
            || typeof payload.activo !== 'boolean'
        ) return null;

        return {
            id: payload.id,
            user: payload.user,
            rol: payload.rol,
            activo: payload.activo,
            ...(typeof payload.exp === 'number' ? { exp: payload.exp } : {}),
        };
    } catch {
        return null;
    }
};

export const getSession = (): SessionPayload | null => {
    const token = localStorage.getItem('token');
    return token ? parsePayload(token) : null;
};

export const saveSession = (token: string): void => {
    localStorage.setItem('token', token);
    window.dispatchEvent(new Event(SESSION_EVENT));
};

export const clearSession = (): void => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event(SESSION_EVENT));
};

export const subscribeSession = (callback: () => void): (() => void) => {
    window.addEventListener(SESSION_EVENT, callback);
    window.addEventListener('storage', callback);
    return () => {
        window.removeEventListener(SESSION_EVENT, callback);
        window.removeEventListener('storage', callback);
    };
};
