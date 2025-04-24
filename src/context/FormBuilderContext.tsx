import { createContext, useContext, useState, ReactNode } from "react";

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

export interface Field {
  id: string;
  type: FieldType;
  label: string;
}

interface FormBuilderContextType {
  fields: Field[];
  addField: (type: FieldType) => void;
  removeField: (id: string) => void;
  updateLabel: (id: string, label: string) => void;
}

const FormBuilderContext = createContext<FormBuilderContextType | undefined>(
  undefined
);

export const FormBuilderProvider = ({ children }: { children: ReactNode }) => {
  const [fields, setFields] = useState<Field[]>([
    { id: crypto.randomUUID(), type: "first_name", label: "First Name" },
    { id: crypto.randomUUID(), type: "last_name", label: "Last Name" },
  ]);

  const addField = (type: FieldType) => {
    const label =
      type === "first_name"
        ? "First Name"
        : type === "last_name"
        ? "Last Name"
        : type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ");

    setFields((prev) => [...prev, { id: crypto.randomUUID(), type, label }]);
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((field) => field.id !== id));
  };

  const updateLabel = (id: string, label: string) => {
    setFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, label } : field))
    );
  };

  return (
    <FormBuilderContext.Provider
      value={{ fields, addField, removeField, updateLabel }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
};

export const useFormFields = () => {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error("useFormFields must be used within a FormBuilderProvider");
  }
  return context;
};
