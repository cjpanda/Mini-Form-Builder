import { useState } from "react";

import { z } from "zod";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const fieldLabels: Record<FieldType, string> = {
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
};

interface Field {
  id: string;
  type: FieldType;
  label: string;
}

const SortableItem = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

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
  const [showPreview, setShowPreview] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      setFields((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const addField = (type: FieldType) => {
    const label = fieldLabels[type];
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
          className={`w-full lg:w-[60%] space-y-6 p-10 rounded-xl shadow-md ${bgColor} font-${font}`}
        >
          <input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="text-xl font-semibold underline outline-none bg-transparent w-full"
            placeholder="Untitled Form"
          />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field) => (
                <SortableItem key={field.id} id={field.id}>
                  <FormField
                    {...field}
                    onDelete={removeField}
                    showLabel={showLabels}
                    error={false}
                  />
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>

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
                    {(Object.keys(fieldLabels) as FieldType[]).map((type) => (
                      <CommandItem
                        key={type}
                        value={type}
                        onSelect={() => addField(type)}
                      >
                        {fieldLabels[type]}
                      </CommandItem>
                    ))}
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
                "bg-gray-200",
                "bg-blue-200",
                "bg-yellow-200",
                "bg-green-200",
                "bg-pink-200",
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

          {/* Font Selector */}
          <div>
            <label className="text-sm font-medium mb-2 block">Font Style</label>
            <Select value={font} onValueChange={setFont}>
              <SelectTrigger>
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sans">Sans</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="mono">Monospace</SelectItem>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="poppins">Poppins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Label Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Show Labels</span>
            <Switch checked={showLabels} onCheckedChange={setShowLabels} />
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className={`${bgColor} font-${font} p-8`}>
          <DialogHeader>
            <DialogTitle className="text-2xl mb-4">{formTitle}</DialogTitle>
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
