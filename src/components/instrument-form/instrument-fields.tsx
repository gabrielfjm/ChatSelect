"use client";

import type { Instrument } from "@/core/models/instrument";
import type {
  FieldErrors,
  InstrumentFormField,
} from "@/lib/catalog/instrument-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * Every field of a ficha, grouped like the instrument page. Shared by the
 * public request form and the admin editor so both always send the same
 * field names to parseInstrumentForm (src/lib/catalog/instrument-form.ts).
 */

type TextField = Exclude<
  keyof Instrument,
  "classification" | "isDualApplication"
>;

interface FieldDef {
  name: TextField;
  label: string;
  hint?: string;
  placeholder?: string;
  rows?: number;
  type?: "url";
  /** Offer the values already used in the catalog (keeps filters tidy). */
  suggest?: boolean;
  adminOnly?: boolean;
}

interface Section {
  title: string;
  description?: string;
  /** On the public form, collapsed by default to keep the request light. */
  optionalForPublic?: boolean;
  fields: FieldDef[];
}

const SECTIONS: Section[] = [
  {
    title: "Identificação",
    fields: [
      {
        name: "title",
        label: "Nome do instrumento",
        placeholder: "Ex.: System Usability Scale (SUS)",
      },
      {
        name: "sheetName",
        label: "Sigla / nome curto",
        hint: "Usado na busca e no endereço da ficha. Se vazio, usa o nome.",
        placeholder: "Ex.: SUS",
      },
      {
        name: "slug",
        label: "Endereço da ficha",
        hint: "Parte final da URL (/instrumentos/…). Deixe vazio para gerar a partir da sigla.",
        placeholder: "Ex.: sus",
        adminOnly: true,
      },
      {
        name: "authors",
        label: "Autores / referência",
        placeholder: "Ex.: Brooke, J. (1996)",
      },
      {
        name: "instrumentLink",
        label: "Link do artigo ou do instrumento",
        type: "url",
        placeholder: "https://",
      },
    ],
  },
  {
    title: "Descrição",
    fields: [
      {
        name: "description",
        label: "Breve descrição do que o instrumento avalia",
        rows: 4,
        placeholder:
          "Ex.: Escala de 10 itens para medir a usabilidade percebida de um sistema.",
      },
      {
        name: "instrumentType",
        label: "Tipo de instrumento",
        placeholder: "Ex.: Questionário",
        suggest: true,
      },
      {
        name: "instrumentDescription",
        label: "Descrição do instrumento",
        hint: "Estrutura, dimensões/escalas e itens.",
        rows: 5,
      },
      {
        name: "category",
        label: "Categoria",
        placeholder: "Ex.: Usabilidade",
        suggest: true,
      },
      {
        name: "qualityAttributes",
        label: "Atributos de qualidade",
        hint: "Separe vários valores por vírgula.",
        suggest: true,
      },
      {
        name: "attributes",
        label: "Atributos",
        hint: "Separe vários valores por vírgula.",
        suggest: true,
      },
      {
        name: "communicationModalities",
        label: "Modalidades de comunicação",
        hint: "Separe vários valores por vírgula.",
        placeholder: "Ex.: Texto",
        suggest: true,
      },
    ],
  },
  {
    title: "Aplicação",
    optionalForPublic: true,
    fields: [
      {
        name: "originalLanguage",
        label: "Idioma original",
        placeholder: "Ex.: Inglês",
        suggest: true,
      },
      {
        name: "translations",
        label: "Traduções",
        placeholder: "Ex.: Português, Espanhol",
      },
      { name: "originalSample", label: "Amostra do estudo original", rows: 3 },
      {
        name: "itemCount",
        label: "Número de itens",
        placeholder: "Ex.: 10 itens",
      },
      { name: "responseFormat", label: "Formato de resposta", rows: 3 },
      { name: "scoring", label: "Como pontuar", rows: 3 },
      { name: "reliability", label: "Confiabilidade", rows: 3 },
      { name: "referenceResult", label: "Resultado de referência", rows: 3 },
    ],
  },
  {
    title: "Avaliação crítica e fonte",
    optionalForPublic: true,
    fields: [
      {
        name: "advantages",
        label: "Vantagens",
        hint: "Uma por linha.",
        rows: 4,
      },
      {
        name: "limitations",
        label: "Limitações",
        hint: "Uma por linha.",
        rows: 4,
      },
      {
        name: "source",
        label: "Fonte",
        hint: "Referência completa do artigo de onde a ficha foi extraída.",
        rows: 3,
      },
    ],
  },
];

const REQUIRED: Record<"public" | "admin", ReadonlySet<TextField>> = {
  public: new Set(["title", "description"]),
  admin: new Set(["title"]),
};

export type InstrumentDefaults = Partial<Instrument>;

const errorClasses = "border-destructive focus-visible:ring-destructive";

function defaultText(
  defaults: InstrumentDefaults | undefined,
  name: TextField,
): string {
  const value = defaults?.[name];
  if (Array.isArray(value)) return value.join("\n");
  return value ?? "";
}

export function FieldShell({
  id,
  label,
  hint,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="text-muted-foreground font-normal">
            {" "}
            (obrigatório)
          </span>
        )}
      </Label>
      {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  );
}

function TextInputField({
  field,
  mode,
  defaults,
  error,
  suggestions,
}: {
  field: FieldDef;
  mode: "public" | "admin";
  defaults?: InstrumentDefaults;
  error?: string;
  suggestions?: string[];
}) {
  const required = REQUIRED[mode].has(field.name);
  const common = {
    id: field.name,
    name: field.name,
    placeholder: field.placeholder,
    defaultValue: defaultText(defaults, field.name),
    "aria-required": required || undefined,
    "aria-invalid": Boolean(error) || undefined,
    "aria-describedby": error ? `${field.name}-error` : undefined,
    className: cn(error && errorClasses),
  };
  const listId = suggestions?.length ? `${field.name}-options` : undefined;

  return (
    <FieldShell
      id={field.name}
      label={field.label}
      hint={field.hint}
      required={required}
      error={error}
    >
      {field.rows ? (
        <Textarea rows={field.rows} {...common} />
      ) : (
        <Input type={field.type ?? "text"} list={listId} {...common} />
      )}
      {listId && (
        <datalist id={listId}>
          {suggestions!.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      )}
    </FieldShell>
  );
}

function ClassificationField({
  defaults,
  error,
}: {
  defaults?: InstrumentDefaults;
  error?: string;
}) {
  const current = defaults?.classification ?? "adapted";
  const options = [
    {
      value: "adapted",
      label: "Validado (adaptado / original)",
      hint: "Deriva de uma fonte psicométrica citável (ex.: SUS, TAM).",
    },
    {
      value: "ad-hoc",
      label: "Ad hoc",
      hint: "Criado pelos autores do estudo, sem validação psicométrica formal.",
    },
  ] as const;

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm leading-none font-medium">
        Classificação
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="has-[:checked]:border-primary has-[:checked]:bg-accent flex cursor-pointer gap-3 rounded-md border p-3 text-sm"
          >
            <input
              type="radio"
              name="classification"
              value={option.value}
              defaultChecked={current === option.value}
              className="accent-primary mt-0.5"
            />
            <span>
              <span className="block font-medium">{option.label}</span>
              <span className="text-muted-foreground text-xs">
                {option.hint}
              </span>
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function InstrumentFields({
  mode,
  defaults,
  errors = {},
  suggestions = {},
}: {
  mode: "public" | "admin";
  defaults?: InstrumentDefaults;
  errors?: FieldErrors;
  suggestions?: Partial<Record<TextField, string[]>>;
}) {
  return (
    <div className="space-y-8">
      {SECTIONS.map((section, index) => {
        const fields = section.fields.filter(
          (field) => mode === "admin" || !field.adminOnly,
        );
        const body = (
          <div className="space-y-5">
            {fields.map((field) => (
              <TextInputField
                key={field.name}
                field={field}
                mode={mode}
                defaults={defaults}
                error={errors[field.name as InstrumentFormField]}
                suggestions={
                  field.suggest ? suggestions[field.name] : undefined
                }
              />
            ))}
            {index === 0 && (
              <ClassificationField
                defaults={defaults}
                error={errors.classification}
              />
            )}
          </div>
        );

        if (mode === "public" && section.optionalForPublic) {
          const hasError = fields.some(
            (field) => errors[field.name as InstrumentFormField],
          );
          return (
            <details
              key={section.title}
              open={hasError || undefined}
              className="group rounded-lg border p-4"
            >
              <summary className="cursor-pointer text-sm font-semibold">
                {section.title}{" "}
                <span className="text-muted-foreground font-normal">
                  (opcional — preencha o que souber)
                </span>
              </summary>
              <div className="pt-5">{body}</div>
            </details>
          );
        }

        return (
          <fieldset key={section.title} className="space-y-4">
            <legend className="mb-4 text-lg font-semibold">
              {section.title}
            </legend>
            {body}
          </fieldset>
        );
      })}
    </div>
  );
}
