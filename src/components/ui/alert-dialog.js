"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog as AlertDialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";
function AlertDialog({ ...props }) {
    return _jsx(AlertDialogPrimitive.Root, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogTrigger({ ...props }) {
    return (_jsx(AlertDialogPrimitive.Trigger, { "data-slot": "alert-dialog-trigger", ...props }));
}
function AlertDialogClose({ ...props }) {
    return _jsx(AlertDialogPrimitive.Close, { "data-slot": "alert-dialog-close", ...props });
}
function AlertDialogPortal({ ...props }) {
    return _jsx(AlertDialogPrimitive.Portal, { "data-slot": "alert-dialog-portal", ...props });
}
function AlertDialogOverlay({ className, ...props }) {
    return (_jsx(AlertDialogPrimitive.Backdrop, { "data-slot": "alert-dialog-overlay", className: cn("fixed inset-0 z-50 bg-black/70 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0", className), ...props }));
}
function AlertDialogContent({ className, children, ...props }) {
    return (_jsxs(AlertDialogPortal, { children: [_jsx(AlertDialogOverlay, {}), _jsx(AlertDialogPrimitive.Popup, { "data-slot": "alert-dialog-content", className: cn("fixed left-1/2 top-1/2 z-50 w-[min(92vw,30rem)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border/70 bg-background p-6 shadow-2xl outline-none", className), ...props, children: children })] }));
}
function AlertDialogHeader({ className, ...props }) {
    return (_jsx("div", { "data-slot": "alert-dialog-header", className: cn("space-y-2", className), ...props }));
}
function AlertDialogFooter({ className, ...props }) {
    return (_jsx("div", { "data-slot": "alert-dialog-footer", className: cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className), ...props }));
}
function AlertDialogTitle({ className, ...props }) {
    return (_jsx(AlertDialogPrimitive.Title, { "data-slot": "alert-dialog-title", className: cn("text-base font-semibold tracking-tight text-foreground", className), ...props }));
}
function AlertDialogDescription({ className, ...props }) {
    return (_jsx(AlertDialogPrimitive.Description, { "data-slot": "alert-dialog-description", className: cn("text-sm leading-relaxed text-muted-foreground", className), ...props }));
}
export { AlertDialog, AlertDialogTrigger, AlertDialogClose, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, };
