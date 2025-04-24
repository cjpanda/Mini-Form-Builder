import { EllipsisVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type FieldType =
  | "first_name"
  | "last_name"
  | "text"
  | "email"
  | "number"
  | "textarea"
  | "password"
  | "date"
  | "checkbox"
  | "radio"
  | "select"
  | "button";

export interface FormFieldProps {
  id: string;
  type: FieldType;
  label: string;
  onDelete: (id: string) => void;
  error?: boolean;
  showLabel?: boolean;
}

export const FormField = ({
  id,
  type,
  label,
  onDelete,
  error = false,
  showLabel = true,
}: FormFieldProps) => {
  const errorStyle = error
    ? "border-red-500 focus-visible:ring-red-500"
    : "border-gray-300";

  const renderInput = () => {
    if (type === "textarea") {
      return <Textarea placeholder={label} className={`${errorStyle}`} />;
    }

    if (type === "checkbox" || type === "radio") {
      return (
        <div className="flex items-center gap-2">
          <input type={type} id={id} />
          <label htmlFor={id}>{label}</label>
        </div>
      );
    }

    if (type === "select") {
      return (
        <select className={`px-2 py-1 rounded w-full border ${errorStyle}`}>
          <option>{label}</option>
          <option>Option 1</option>
          <option>Option 2</option>
        </select>
      );
    }

    if (type === "button") {
      return (
        <Button
          type="submit"
          className="bg-sky-500 hover:bg-sky-700 text-white"
        >
          {label}
        </Button>
      );
    }

    return (
      <Input
        type={type === "first_name" || type === "last_name" ? "text" : type}
        placeholder={label}
        className={`border-2 ${errorStyle}`}
      />
    );
  };

  const shouldShowLabel = !["checkbox", "radio", "button"].includes(type);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 space-y-1">
        {showLabel && shouldShowLabel && (
          <label className="text-lg font-medium">{label}</label>
        )}
        {renderInput()}
      </div>
      {type && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="mt-6 border-2">
              <EllipsisVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onDelete(id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
