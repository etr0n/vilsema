"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { contact, contactHref } from "@/lib/site-data";
import { buttonBase } from "@/components/site/button-styles";

type EnquiryContextValue = { open: (model?: string) => void };

const EnquiryContext = createContext<EnquiryContextValue>({ open: () => {} });

export function useEnquiry() {
  return useContext(EnquiryContext);
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRe = /^\+?[0-9\s()\-]{6,20}$/;

const fieldBase =
  "w-full bg-transparent border-b py-3 text-foreground placeholder:text-ink-3 focus:outline-none transition-colors";
const fieldIdle = "border-foreground/50 focus:border-foreground";
const fieldBad = "border-destructive/70 focus:border-destructive";

// Bold black label above the field, the same pattern as the contact details and footer.
const labelBase = "block mb-1 font-bold text-foreground";


type Errors = {
  name?: string | undefined;
  email?: string | undefined;
  phone?: string | undefined;
  message?: string | undefined;
};

export function EnquiryForm({
  model,
  inDialog = false,
}: {
  model?: string | undefined;
  inDialog?: boolean;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const field = `${fieldBase} font-normal ${inDialog ? "text-base" : "text-xl"}`;
  const ok = fieldIdle;
  const bad = fieldBad;
  const label = `${labelBase} ${inDialog ? "text-base" : "text-xl"}`;
  const errorText = `mt-2 text-destructive ${inDialog ? "text-sm" : "text-base"}`;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nameVal = (nameRef.current?.value ?? "").trim();
    const emailVal = (emailRef.current?.value ?? "").trim();
    const phoneVal = (phoneRef.current?.value ?? "").trim();
    const messageVal = (messageRef.current?.value ?? "").trim();

    const next: Errors = {};
    if (!nameVal) next.name = "Įveskite savo vardą.";

    if (!emailVal) next.email = "Įveskite el. pašto adresą.";
    else if (!emailRe.test(emailVal))
      next.email = "Patikrinkite el. pašto adresą - atrodo neteisingas.";

    if (!phoneVal) next.phone = "Įveskite telefono numerį.";
    else if (!phoneRe.test(phoneVal)) next.phone = "Patikrinkite numerį - atrodo neteisingas.";

    if (!messageVal) next.message = "Parašykite, kokių durų ieškote.";

    setErrors(next);
    if (next.name) {
      nameRef.current?.focus();
      return;
    }
    if (next.email) {
      emailRef.current?.focus();
      return;
    }
    if (next.phone) {
      phoneRef.current?.focus();
      return;
    }
    if (next.message) {
      messageRef.current?.focus();
      return;
    }
    setNotice(true);
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className={`grid sm:grid-cols-2 sm:gap-x-6 ${inDialog ? "gap-6 sm:gap-x-5" : "gap-10"}`}
    >
      <label className="grid sm:col-span-2">
        <span className={label}>
          Vardas{" "}
          <span aria-hidden className="text-menu">
            *
          </span>
        </span>
        <input
          ref={nameRef}
          name="name"
          autoComplete="name"
          placeholder="Jūsų vardas"
          aria-required="true"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "enquiry-name-error" : undefined}
          onInput={() => setErrors((e) => (e.name ? { ...e, name: undefined } : e))}
          className={`${field} ${errors.name ? bad : ok}`}
        />
        {errors.name && (
          <span id="enquiry-name-error" role="alert" className={errorText}>
            {errors.name}
          </span>
        )}
      </label>

      <label className="grid">
        <span className={label}>
          El. paštas{" "}
          <span aria-hidden className="text-menu">
            *
          </span>
        </span>
        <input
          ref={emailRef}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Jūsų el. paštas"
          aria-required="true"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "enquiry-email-error" : undefined}
          onInput={() => setErrors((e) => (e.email ? { ...e, email: undefined } : e))}
          className={`${field} ${errors.email ? bad : ok}`}
        />
        {errors.email && (
          <span id="enquiry-email-error" role="alert" className={errorText}>
            {errors.email}
          </span>
        )}
      </label>

      <label className="grid">
        <span className={label}>
          Telefonas{" "}
          <span aria-hidden className="text-menu">
            *
          </span>
        </span>
        <input
          ref={phoneRef}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Jūsų telefono numeris"
          aria-required="true"
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? "enquiry-phone-error" : undefined}
          onInput={() => setErrors((e) => (e.phone ? { ...e, phone: undefined } : e))}
          className={`${field} ${errors.phone ? bad : ok}`}
        />
        {errors.phone && (
          <span id="enquiry-phone-error" role="alert" className={errorText}>
            {errors.phone}
          </span>
        )}
      </label>

      <label className="grid sm:col-span-2">
        <span className={label}>
          Žinutė{" "}
          <span aria-hidden className="text-menu">
            *
          </span>
        </span>
        <textarea
          ref={messageRef}
          name="message"
          rows={4}
          placeholder="Trumpai papasakokite, kokių durų ieškote"
          aria-required="true"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "enquiry-message-error" : undefined}
          onInput={() => setErrors((e) => (e.message ? { ...e, message: undefined } : e))}
          defaultValue={model ? `Domina modelis „${model}“.` : ""}
          className={`${field} resize-none ${errors.message ? bad : ok}`}
        />
        {errors.message && (
          <span
            id="enquiry-message-error"
            role="alert"
            className={errorText}
          >
            {errors.message}
          </span>
        )}
      </label>

      {notice && (
        <div
          role="status"
          className={`bg-muted px-6 py-5 leading-relaxed text-ink-2 sm:col-span-2 ${inDialog ? "text-base" : "text-xl"}`}
        >
          Šiuo metu forma žinutės dar nepasiunčia. Kol kas skambinkite{" "}
          <a href={contactHref.phone} className="underline underline-offset-2">
            {contact.phone}
          </a>{" "}
          arba rašykite{" "}
          <a href={contactHref.email} className="underline underline-offset-2">
            {contact.email}
          </a>
          .
        </div>
      )}

      <div className="flex pt-2 sm:col-span-2 sm:justify-end">
        <button type="submit" className={`${buttonBase} text-sm tracking-[0.14em]`}>
          Siųsti užklausą
        </button>
      </div>
    </form>
  );
}

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; model?: string | undefined }>({
    open: false,
  });

  const open = useCallback((model?: string) => setState({ open: true, model }), []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <EnquiryContext.Provider value={value}>
      {children}
      <Dialog open={state.open} onOpenChange={(o) => setState((s) => ({ ...s, open: o }))}>
        <DialogContent className="max-h-[90vh] gap-8 overflow-y-auto p-6 sm:max-w-240 sm:p-12">
          <DialogHeader className="space-y-0 pr-10 text-left sm:text-left">
            <DialogTitle className="text-3xl font-normal leading-tight tracking-tight sm:text-4xl">
              Gauti pasiūlymą
            </DialogTitle>
            <DialogDescription className="mt-3 text-base leading-6 text-ink-2 text-pretty">
              Parašykite, kokių durų ieškote - susisieksime ir pakonsultuosime.
            </DialogDescription>
          </DialogHeader>
          <EnquiryForm inDialog key={state.model ?? "default"} model={state.model} />
        </DialogContent>
      </Dialog>
    </EnquiryContext.Provider>
  );
}
