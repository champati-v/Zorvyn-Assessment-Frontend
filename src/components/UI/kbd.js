import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
function Kbd({ className, ...props }) {
    return (_jsx("kbd", { "data-slot": "kbd", className: cn("inline-flex min-h-5 min-w-5 items-center justify-center rounded-md border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground shadow-sm", className), ...props }));
}
export { Kbd };
