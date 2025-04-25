import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FormField, FieldType } from "@/components/FormField";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const translations: Record<string, Record<FieldType, string>> = {
  en: {
    first_name: "First Name",
    last_name: "Last Name",
    text: "Text Input",
    email: "Email",
    number: "Number",
    textarea: "Textarea",
    password: "Password",
    date: "Date Picker",
    checkbox: "Checkbox",
    radio: "Radio Button",
    select: "Dropdown",
    button: "Submit",
  },
  de: {
    first_name: "Vorname",
    last_name: "Nachname",
    text: "Textfeld",
    email: "E-Mail",
    number: "Nummer",
    textarea: "Textbereich",
    password: "Passwort",
    date: "Datumsauswahl",
    checkbox: "Kontrollkästchen",
    radio: "Optionsfeld",
    select: "Dropdown",
    button: "Absenden",
  },
  fr: {
    first_name: "Prénom",
    last_name: "Nom de famille",
    text: "Champ de texte",
    email: "E-mail",
    number: "Nombre",
    textarea: "Zone de texte",
    password: "Mot de passe",
    date: "Sélecteur de date",
    checkbox: "Case à cocher",
    radio: "Bouton radio",
    select: "Liste déroulante",
    button: "Soumettre",
  },
  es: {
    first_name: "Nombre",
    last_name: "Apellido",
    text: "Campo de texto",
    email: "Correo electrónico",
    number: "Número",
    textarea: "Área de texto",
    password: "Contraseña",
    date: "Selector de fecha",
    checkbox: "Casilla de verificación",
    radio: "Botón de opción",
    select: "Desplegable",
    button: "Enviar",
  },
};

interface Field {
  id: string;
  type: FieldType;
  label: string;
}

const MyForms = () => {
  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [fields, setFields] = useState<Field[]>([
    { id: crypto.randomUUID(), type: "first_name", label: "First Name" },
    { id: crypto.randomUUID(), type: "last_name", label: "Last Name" },
  ]);
  const [showCommand, setShowCommand] = useState(false);
  const [bgColor, setBgColor] = useState("bg-white");
  const [font, setFont] = useState("sans");
  const [showLabels, setShowLabels] = useState(true);
  const [language, setLanguage] = useState("en");
  const [showPreview, setShowPreview] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const addField = (type: FieldType) => {
    const label = translations[language]?.[type] || type;
    setFields((prev) => [...prev, { id: crypto.randomUUID(), type, label }]);
    setShowCommand(false);
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((field) => field.id !== id));
  };

  const hasSubmitButton = fields.some((f) => f.type === "button");

  const getFormSchema = () => {
    const shape: Record<string, z.ZodTypeAny> = {};
    fields.forEach((field) => {
      if (["button", "select", "checkbox", "radio"].includes(field.type))
        return;
      const key = field.label.toLowerCase().replace(/\s+/g, "_");
      shape[key] =
        field.type === "email"
          ? z.string().email({ message: "Invalid email address" })
          : z.string().min(1, `${field.label} is required`);
    });
    return z.object(shape);
  };

  const handlePublish = () => {
    if (!hasSubmitButton) {
      alert("❌ You must include a submit button to publish the form.");
      return;
    }
    setFormErrors([]);
    setShowPreview(true);
  };

  const handleFormSubmit = () => {
    const schema = getFormSchema();
    const formData: Record<string, string> = {};
    const inputs = document.querySelectorAll(
      ".preview input, .preview textarea, .preview select"
    );

    inputs.forEach((input) => {
      const key = input
        .getAttribute("placeholder")
        ?.toLowerCase()
        .replace(/\s+/g, "_");
      if (key) formData[key] = (input as HTMLInputElement).value;
    });

    try {
      schema.parse(formData);
      alert("✅ Form submitted successfully!");
      setFormErrors([]);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const issues = err.errors.map((e) => e.message);
        setFormErrors(issues);
      }
    }
  };

  return (
    <div className={`p-10 min-h-screen transition ${font}`}>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-5">Create New Form</h1>
        <Button
          className="bg-sky-500 hover:bg-sky-700 px-10 text-white"
          onClick={handlePublish}
        >
          Publish Form
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Builder */}
        <div
          className={`w-full lg:w-[60%] space-y-6 p-10 rounded-xl shadow-md ${bgColor} ${
            font === "inter"
              ? "font-inter"
              : font === "poppins"
              ? "font-poppins"
              : font === "open"
              ? "font-open"
              : font === "serif"
              ? "font-serif"
              : font === "mono"
              ? "font-mono"
              : "font-sans"
          }`}
        >
          <input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="text-xl font-semibold underline outline-none bg-transparent w-full"
            placeholder="Untitled Form"
          />

          {fields.map((field) => (
            <FormField
              key={field.id}
              {...field}
              onDelete={removeField}
              showLabel={showLabels}
              error={false}
            />
          ))}

          <Button
            onClick={() => setShowCommand((prev) => !prev)}
            variant="outline"
            className="border-1 border-dashed border-sky-400 text-sky-400 bg-transparent hover:bg-transparent hover:text-sky-500 cursor-pointer"
          >
            + Add New Field
          </Button>
          {showCommand && (
            <div className="mt-2 w-full max-w-sm bg-white border rounded-md shadow-sm">
              <Command>
                <CommandInput placeholder="Search input type..." />
                <CommandList>
                  <CommandEmpty>No input type found.</CommandEmpty>
                  <CommandGroup heading="Field Types">
                    {(Object.keys(translations.en) as FieldType[]).map(
                      (type) => (
                        <CommandItem
                          key={type}
                          value={type}
                          onSelect={() => addField(type)}
                        >
                          {translations[language]?.[type] || type}
                        </CommandItem>
                      )
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          )}
        </div>

        {/* Form Style */}
        <div className="lg:w-80 xl:w-96 flex-shrink-0 bg-white p-4 shadow-md rounded-md space-y-6">
          <h2 className="text-xl font-semibold mb-4">Form Style</h2>

          {/* Background Color Picker */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Background Color
            </label>
            <div className="flex gap-2">
              {[
                "bg-white",
                "bg-gray-50",
                "bg-blue-50",
                "bg-yellow-50",
                "bg-green-50",
                "bg-pink-50",
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => setBgColor(color)}
                  className={`${color} w-6 h-6 rounded-full border-2 ${
                    bgColor === color ? "border-black" : "border-transparent"
                  }`}
                  aria-label={color}
                ></button>
              ))}
            </div>
          </div>

          {/* Font Style */}
          <div>
            <label className="text-sm font-medium mb-2 block">Font Style</label>
            <Select value={font} onValueChange={setFont}>
              <SelectTrigger>
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sans">Sans</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="mono">Monospace</SelectItem>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="poppins">Poppins</SelectItem>
                <SelectItem value="open">Open Sans</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Show Labels */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Show Labels</span>
            <Switch checked={showLabels} onCheckedChange={setShowLabels} />
          </div>

          {/* Language Picker */}
          <div>
            <label className="text-sm font-medium mb-2 block">Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className={`${bgColor} font-${font} p-8`}>
          <DialogHeader>
            <DialogTitle className="text-2xl mb-2">{formTitle}</DialogTitle>
            <DialogDescription>
              Please fill out the form below and click Submit.
            </DialogDescription>
          </DialogHeader>

          {formErrors.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
              {formErrors.map((msg, i) => (
                <p key={i}>• {msg}</p>
              ))}
            </div>
          )}

          <form
            className="space-y-6 preview"
            onSubmit={(e) => {
              e.preventDefault();
              handleFormSubmit();
            }}
          >
            {fields.map((field) => (
              <FormField
                key={field.id}
                {...field}
                onDelete={removeField}
                showLabel={showLabels}
                error={formErrors.some((err) =>
                  err.toLowerCase().includes(field.label.toLowerCase())
                )}
              />
            ))}

            <DialogFooter className="flex justify-between items-center pt-4">
              <DialogClose asChild>
                <Button variant="ghost" type="button">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyForms;
