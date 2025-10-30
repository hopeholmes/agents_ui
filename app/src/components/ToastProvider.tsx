import { createContext, useCallback, useContext, useMemo, useState } from 'react';


export interface Toast {
id: string;
title?: string;
message: string;
}


interface ToastContextValue {
toasts: Toast[];
push: (t: Omit<Toast, 'id'>) => void;
remove: (id: string) => void;
}


const ToastContext = createContext<ToastContextValue | null>(null);


export function ToastProvider({ children }: { children: React.ReactNode }) {
const [toasts, setToasts] = useState<Toast[]>([]);


const remove = useCallback((id: string) => {
setToasts((list) => list.filter((t) => t.id !== id));
}, []);


const push = useCallback((t: Omit<Toast, 'id'>) => {
const id = Math.random().toString(36).slice(2);
setToasts((list) => [...list, { id, ...t }]);
// auto-hide after 4s
setTimeout(() => remove(id), 4000);
}, [remove]);


const value = useMemo(() => ({ toasts, push, remove }), [toasts, push, remove]);


return (
<ToastContext.Provider value={value}>
{children}
{/* portal container */}
<div className="fixed bottom-4 right-4 space-y-2 z-50">
{toasts.map((t) => (
<div key={t.id} className="bg-black text-white/90 rounded-xl px-4 py-3 shadow-lg max-w-sm">
{t.title && <div className="font-semibold mb-1">{t.title}</div>}
<div className="text-sm">{t.message}</div>
</div>
))}
</div>
</ToastContext.Provider>
);
}


export function useToast() {
const ctx = useContext(ToastContext);
if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
return ctx;
}
