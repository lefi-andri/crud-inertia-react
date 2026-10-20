import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function ToastNotifications() {
    const { flash } = usePage().props;
    const lastMessage = useRef(null);

    useEffect(() => {
        const message = flash?.success || flash?.error;
        if (!message || message === lastMessage.current) return;

        lastMessage.current = message;
        flash.success ? toast.success(message) : toast.error(message);
    }, [flash]);

    return <Toaster position="top-right" toastOptions={{ duration: 3500 }} />;
}
