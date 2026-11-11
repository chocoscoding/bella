"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Check, ShoppingBag, X, Clock, MapPin, Phone, ArrowLeft, Lock, Search, LayoutGrid } from "lucide-react";
import { api, money, ApiError, type Menu, type MenuItem, type MenuSection, type StoreInfo, type Quote } from "./api";
import { BagProvider, useBag } from "./cart";
import { brandCopy } from "./brand";

export function OrderPage({ cancelledRef }: { cancelledRef?: string }) {
  return (
    <BagProvider>
      <OrderApp cancelledRef={cancelledRef} />
    </BagProvider>
  );
}

function OrderApp({ cancelledRef }: { cancelledRef?: string }) {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [info, setInfo] = useState<StoreInfo | null>(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [bagOpen, setBagOpen] = useState(false);
  const [active, setActive] = useState("");
  const [query, setQuery] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const bag = useBag();

  useEffect(() => {
    Promise.all([api.menu(), api.info()])
      .then(([m, i]) => {
        setMenu(m);
        setInfo(i);
        setActive(m.sections[0]?.id || "");
      })
      .catch((e) => setError(e.message));
  }, []);

  const items = useMemo(() => new Map(menu?.items.map((i) => [i.id, i])), [menu]);

  const sections = useMemo<MenuSection[]>(() => (menu?.sections || []).map((s) => ({ ...s, name: s.name.trim() })), [menu]);
  const current = sections.find((s) => s.id === active) || sections[0];
  const q = query.trim().toLowerCase();

  // While searching, results come from every section, grouped by section.
  const results = useMemo<MenuSection[]>(() => {
    if (!q) return [];
    const matches = (id: string) => {
      const item = items.get(id);
      return !!item && (item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));
    };
    return sections.map((s) => ({ ...s, itemIds: s.itemIds.filter(matches) })).filter((s) => s.itemIds.length);
  }, [sections, items, q]);

  const panel = useRef<HTMLElement>(null);

  // While the cart sheet is open on small screens, the page behind it doesn't scroll.
  useEffect(() => {
    if (!bagOpen || !matchMedia("(max-width: 960px)").matches) return;
    const root = document.documentElement;
    const previous = [root.style.overflow, document.body.style.overflow];
    root.style.overflow = document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setBagOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      [root.style.overflow, document.body.style.overflow] = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [bagOpen]);
  /** Dishes with options open the dialog; plain dishes go straight into the bag. */
  function choose(item: MenuItem) {
    if (item.modifierGroups.length) setSelected(item);
    else bag.add(item, [], 1, "");
  }
  function select(id: string) {
    setActive(id);
    setQuery("");
    setPickerOpen(false);
  }
  // A new tab starts at its top: if the grid's top is above the screen (deep in a long tab), put it back in view.
  useEffect(() => {
    const top = panel.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) window.scrollBy({ top: top - 120, behavior: "instant" });
  }, [active]);

  const { ready, syncWith } = bag;
  useEffect(() => {
    if (menu && ready) syncWith(menu.items);
  }, [menu, ready, syncWith]);

  return (
    <div className="ord">
      <header className="ord-hero">
        <h1>{brandCopy.title}</h1>
        <p className="ord-eyebrow">{brandCopy.eyebrow}</p>
        {info && (
          <ul className="ord-facts">
            <li>
              <Clock size={16} aria-hidden="true" />
              {!info.orderingEnabled
                ? "Online ordering opens soon · call us to order"
                : info.openNow
                  ? `Open now · ready in about ${info.asapMinutes} min`
                  : "Closed now · schedule a pickup"}
            </li>
            <li>
              <MapPin size={16} aria-hidden="true" />
              {info.address}
            </li>
            <li>
              <Phone size={16} aria-hidden="true" />
              <a href={`tel:${info.phone.replace(/\D/g, "")}`}>{info.phone}</a>
            </li>
          </ul>
        )}
        {info?.sandbox && <p className="ord-sandbox">Test mode — payments use the Clover sandbox and no card is charged.</p>}
      </header>

      {cancelledRef && <p className="ord-banner" role="status">Checkout was cancelled. Your cart is still here whenever you’re ready.</p>}

      {error && !menu ? (
        <div className="ord-state" role="alert">
          <p>{error}</p>
          <button className="ord-btn" onClick={() => location.reload()}>Try again</button>
        </div>
      ) : !menu ? (
        <div className="ord-state" aria-busy="true">Warming up the kitchen…</div>
      ) : (
        <>
          <div className="ord-toolbar">
            <div className="ord-toolbar-row">
              <SearchBox value={query} onChange={setQuery} />
            </div>
            <div className="ord-chip-row">
              <button className="ord-picker-btn" onClick={() => setPickerOpen(true)} aria-haspopup="dialog" aria-label="All sections">
                <LayoutGrid size={16} aria-hidden="true" /> All
              </button>
              <SectionTabs sections={sections} active={q ? "" : current?.id} onPick={select} />
            </div>
          </div>
          <div className="ord-layout">
            <nav className="ord-sidebar" aria-label="Menu sections">
              <SearchBox value={query} onChange={setQuery} />
              <SectionTabs sections={sections} active={q ? "" : current?.id} onPick={select} vertical />
            </nav>
            <main className="ord-menu" id="main" ref={panel}>
              {q ? (
                results.length ? (
                  results.map((s) => (
                    <section key={s.id} className="ord-section" aria-label={`${s.name} results`}>
                      <div className="ord-panel-head">
                        <h2>{s.name}</h2>
                        <span>{s.itemIds.length} found</span>
                      </div>
                      <ItemGrid ids={s.itemIds} items={items} onSelect={choose} />
                    </section>
                  ))
                ) : (
                  <div className="ord-empty-search" role="status">
                    <p>No dishes match “{query.trim()}”.</p>
                    <button className="ord-btn" onClick={() => setQuery("")}>
                      Clear search
                    </button>
                  </div>
                )
              ) : (
                current && (
                  <section id="ord-panel" role="tabpanel" aria-label={current.name} className="ord-section">
                    {/* Keyed so the heading replays its rise on every tab change. */}
                    <div className="ord-panel-head" key={`head-${current.id}`}>
                      <h2 className="ord-rise">
                        <span>{current.name}</span>
                      </h2>
                      <span>{current.itemIds.length} items</span>
                    </div>
                    <ItemGrid key={`grid-${current.id}`} ids={current.itemIds} items={items} onSelect={choose} />
                  </section>
                )
              )}
            </main>
            {bagOpen && <div className="ord-scrim" onClick={() => setBagOpen(false)} aria-hidden="true" />}
            <aside className={`ord-bag ${bagOpen ? "is-open" : ""}`} aria-label="Your cart">
              <BagPanel info={info} onClose={() => setBagOpen(false)} />
            </aside>
          </div>
          {bag.count > 0 && !bagOpen && (
            <button className="ord-bagbar" onClick={() => setBagOpen(true)}>
              <BagIcon count={bag.count} /> View cart · {bag.count} · {money(bag.subtotal)}
            </button>
          )}
          <ItemDialog item={selected} onClose={() => setSelected(null)} />
          <SectionPicker open={pickerOpen} onClose={() => setPickerOpen(false)}>
            <div className="ord-sheet-grid">
              {sections.map((s) => (
                <button key={s.id} aria-current={s.id === current?.id && !q ? "true" : undefined} onClick={() => select(s.id)}>
                  <span>{s.name}</span>
                  <span className="ord-count">{s.itemIds.length}</span>
                </button>
              ))}
            </div>
          </SectionPicker>
        </>
      )}
    </div>
  );
}

function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="ord-search">
      <Search size={18} aria-hidden="true" />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search the menu" aria-label="Search the menu" />
      {value && (
        <button type="button" onClick={() => onChange("")} aria-label="Clear search">
          <X size={16} />
        </button>
      )}
    </label>
  );
}

/** Menu sections as tabs: a vertical list in the sidebar, a swipeable chip row on small screens. */
function SectionTabs({
  sections,
  active,
  onPick,
  vertical = false,
}: {
  sections: MenuSection[];
  active?: string;
  onPick: (id: string) => void;
  vertical?: boolean;
}) {
  const list = useRef<HTMLDivElement>(null);

  // Keep the selected chip fully visible inside the horizontal row (the row scrolls, the page doesn't).
  useEffect(() => {
    const row = list.current;
    const tab = row?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (vertical || !row || !tab) return;
    const r = row.getBoundingClientRect();
    const t = tab.getBoundingClientRect();
    const pad = 12;
    if (t.left < r.left + pad) row.scrollLeft -= r.left + pad - t.left;
    else if (t.right > r.right - pad) row.scrollLeft += t.right - (r.right - pad);
  }, [active, vertical]);

  function onKeyDown(e: React.KeyboardEvent) {
    const [prev, next] = vertical ? ["ArrowUp", "ArrowDown"] : ["ArrowLeft", "ArrowRight"];
    const n = sections.length;
    const i = Math.max(0, sections.findIndex((s) => s.id === active));
    const to = e.key === next ? (i + 1) % n : e.key === prev ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    onPick(sections[to]!.id);
    list.current?.querySelectorAll<HTMLElement>('[role="tab"]')[to]?.focus();
  }

  return (
    <div
      ref={list}
      role="tablist"
      aria-label="Menu sections"
      aria-orientation={vertical ? "vertical" : "horizontal"}
      className={`ord-tabs ${vertical ? "is-vertical" : ""}`}
      onKeyDown={onKeyDown}
    >
      {sections.map((s) => (
        <button
          key={s.id}
          role="tab"
          aria-selected={s.id === active}
          aria-controls="ord-panel"
          tabIndex={s.id === active || (!active && s === sections[0]) ? 0 : -1}
          onClick={() => onPick(s.id)}
        >
          <span>{s.name}</span>
          <span className="ord-count">{s.itemIds.length}</span>
        </button>
      ))}
    </div>
  );
}

/** Bag icon that plays the brand's little "added" motion when the count goes up. */
function BagIcon({ count, size = 18, badge = false }: { count: number; size?: number; badge?: boolean }) {
  const last = useRef(count);
  const [bump, setBump] = useState(0);
  useEffect(() => {
    if (count > last.current) setBump((n) => n + 1);
    last.current = count;
  }, [count]);
  return (
    <span key={bump} className={`ord-bag-icon ${bump ? "is-bump" : ""}`} aria-hidden="true">
      <ShoppingBag size={size} />
      {badge && count > 0 && <span className="ord-badge">{count > 99 ? "99+" : count}</span>}
    </span>
  );
}

function ItemGrid({ ids, items, onSelect }: { ids: string[]; items: Map<string, MenuItem>; onSelect: (item: MenuItem) => void }) {
  return (
    <div className="ord-grid">
      {ids.map((id, i) => {
        const item = items.get(id);
        return item && <ItemCard key={id} item={item} index={i} onSelect={() => onSelect(item)} />;
      })}
    </div>
  );
}

/** Bottom sheet listing every section (small screens). */
function SectionPicker({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open && !ref.current?.open) ref.current?.showModal();
    if (!open && ref.current?.open) ref.current.close();
  }, [open]);
  return (
    <dialog ref={ref} className="ord-dialog ord-sheet" aria-labelledby="ord-sheet-title" onClose={onClose} onClick={(e) => e.target === ref.current && onClose()}>
      <div className="ord-sheet-inner">
        <div className="ord-bag-head">
          <h2 id="ord-sheet-title">Menu sections</h2>
          <button className="ord-bag-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

function ItemCard({ item, index, onSelect }: { item: MenuItem; index: number; onSelect: () => void }) {
  const quickAdd = !item.modifierGroups.length;
  const [added, setAdded] = useState(false);
  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1200);
    return () => clearTimeout(t);
  }, [added]);
  return (
    <button
      className={`ord-card ${added ? "is-added" : ""}`}
      onClick={() => {
        onSelect();
        if (quickAdd) setAdded(true);
      }}
      aria-label={quickAdd ? `Add ${item.name}, ${money(item.price)}, to cart` : undefined}
      disabled={!item.available}
      style={{ "--i": Math.min(index, 12) } as React.CSSProperties /* stagger for the entrance */}
    >
      <span className="ord-card-text">
        <span className="ord-card-head">
          <span className="ord-card-name">{item.name}</span>
          {item.image && <img src={item.image} alt="" loading="lazy" className="ord-card-thumb" />}
        </span>
        {item.description && <span className="ord-card-desc">{item.description}</span>}
        <span className="ord-card-foot">
          <span className="ord-card-price">{item.available ? money(item.price) : "Sold out"}</span>
          <span className="ord-card-add" aria-hidden="true">
            {added ? <Check size={18} /> : <Plus size={18} />}
          </span>
        </span>
      </span>
    </button>
  );
}

function ItemDialog({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const bag = useBag();
  const [picked, setPicked] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (!item) return;
    setPicked(item.modifierGroups.filter((g) => g.min === 1 && g.max === 1).map((g) => g.options[0]?.id).filter(Boolean));
    setQuantity(1);
    setTried(false);
    ref.current?.showModal();
  }, [item]);

  if (!item) return <dialog ref={ref} className="ord-dialog" />;

  const unit = item.price + item.modifierGroups.flatMap((g) => g.options).filter((o) => picked.includes(o.id)).reduce((s, o) => s + o.price, 0);
  const missing = item.modifierGroups.filter((g) => g.options.filter((o) => picked.includes(o.id)).length < g.min);

  function toggle(groupId: string, optionId: string) {
    const group = item!.modifierGroups.find((g) => g.id === groupId)!;
    const inGroup = new Set(group.options.map((o) => o.id));
    setPicked((current) => {
      if (group.max === 1) return [...current.filter((id) => !inGroup.has(id)), optionId];
      if (current.includes(optionId)) return current.filter((id) => id !== optionId);
      if (group.max && current.filter((id) => inGroup.has(id)).length >= group.max) return current;
      return [...current, optionId];
    });
  }

  function close() {
    ref.current?.close();
    onClose();
  }

  return (
    <dialog ref={ref} className="ord-dialog" aria-labelledby="ord-dialog-title" onClose={onClose} onClick={(e) => e.target === ref.current && close()}>
      <form
        method="dialog"
        onSubmit={(e) => {
          e.preventDefault();
          setTried(true);
          if (missing.length) return;
          bag.add(item, picked, quantity, "");
          close();
        }}
      >
        <button type="button" className="ord-dialog-close" onClick={close} aria-label="Close">
          <X size={20} />
        </button>
        {item.image && <img src={item.image} alt="" className="ord-dialog-img" />}
        <div className="ord-dialog-body">
          <h2 id="ord-dialog-title">{item.name}</h2>
          <p className="ord-dialog-price">{money(item.price)}</p>
          {item.description && <p className="ord-dialog-desc">{item.description}</p>}
          {item.modifierGroups.map((g) => {
            const single = g.max === 1;
            const count = g.options.filter((o) => picked.includes(o.id)).length;
            const needs = tried && count < g.min;
            return (
              <fieldset key={g.id} className={`ord-group ${needs ? "is-missing" : ""}`}>
                <legend>
                  {g.name}
                  <small>{g.min ? (single ? "Required" : `Choose at least ${g.min}`) : g.max ? `Optional · up to ${g.max}` : "Optional"}</small>
                </legend>
                {g.options.map((o) => (
                  <label key={o.id} className="ord-option">
                    <input
                      type={single ? "radio" : "checkbox"}
                      name={g.id}
                      checked={picked.includes(o.id)}
                      onChange={() => toggle(g.id, o.id)}
                      disabled={!single && !picked.includes(o.id) && !!g.max && count >= g.max}
                    />
                    <span>{o.name}</span>
                    {o.price > 0 && <span className="ord-option-price">+{money(o.price)}</span>}
                  </label>
                ))}
                {needs && <p className="ord-field-error">Please choose {g.name.toLowerCase()}.</p>}
              </fieldset>
            );
          })}
        </div>
        <div className="ord-dialog-foot">
          <Stepper value={quantity} onChange={setQuantity} label={item.name} min={1} />
          <button className="ord-btn ord-btn-primary" type="submit">
            Add {quantity} to cart · {money(unit * quantity)}
          </button>
        </div>
      </form>
    </dialog>
  );
}

function Stepper({ value, onChange, label, min = 0 }: { value: number; onChange: (n: number) => void; label: string; min?: number }) {
  return (
    <div className="ord-stepper">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label={`Fewer ${label}`}>
        <Minus size={16} />
      </button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(25, value + 1))} aria-label={`More ${label}`} disabled={value >= 25}>
        <Plus size={16} />
      </button>
    </div>
  );
}

const fields = [
  ["firstName", "First name", "given-name", "text"],
  ["lastName", "Last name", "family-name", "text"],
  ["email", "Email", "email", "email"],
  ["phone", "Mobile phone", "tel", "tel"],
] as const;

function BagPanel({ info, onClose }: { info: StoreInfo | null; onClose: () => void }) {
  const bag = useBag();
  const router = useRouter();
  const [step, setStep] = useState<"bag" | "details">("bag");
  const [customer, setCustomer] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [when, setWhen] = useState<"asap" | "later">("asap");
  const [slot, setSlot] = useState("");
  const [note, setNote] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("bella-guest") || "null");
      if (saved) setCustomer((c) => ({ ...c, ...saved }));
    } catch {}
  }, []);

  useEffect(() => {
    if (info && !info.openNow) setWhen("later");
    if (info && !slot) setSlot(info.slots[0]?.at || "");
  }, [info, slot]);

  // Server-priced totals (with tax) while the guest fills in details.
  useEffect(() => {
    if (step !== "details" || !bag.lines.length) return;
    let live = true;
    setQuote(null);
    api
      .quote(bag.lines)
      .then((q) => live && setQuote(q))
      .catch((e) => live && setError(e.message));
    return () => {
      live = false;
    };
  }, [step, bag.lines]);

  useEffect(() => {
    if (!bag.lines.length) setStep("bag");
  }, [bag.lines.length]);

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const order = await api.placeOrder({
        items: bag.lines.map(({ itemId, quantity, modifierIds, note }) => ({ itemId, quantity, modifierIds, note })),
        customer,
        pickup: when === "asap" ? { asap: true } : { at: slot },
        note,
      });
      try {
        localStorage.setItem("bella-guest", JSON.stringify(customer));
      } catch {}
      // The status page sends the guest on to Clover, so Back from Clover lands there.
      router.push(`/order/status?ref=${order.ref}&pay=1`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  const head = (
    <div className="ord-bag-head">
      {step === "details" ? (
        <button className="ord-link" onClick={() => setStep("bag")}>
          <ArrowLeft size={16} aria-hidden="true" /> Cart
        </button>
      ) : (
        <h2 className="ord-bag-title">
          Cart <BagIcon count={bag.count} size={22} badge />
          <span className="ord-sr">{bag.count} {bag.count === 1 ? "item" : "items"}</span>
        </h2>
      )}
      <button className="ord-bag-close" onClick={onClose} aria-label="Close cart">
        <X size={20} />
      </button>
    </div>
  );

  if (!bag.lines.length)
    return (
      <div className="ord-bag-inner">
        {head}
        <p className="ord-empty">{brandCopy.emptyBag}</p>
      </div>
    );

  if (step === "bag")
    return (
      <div className="ord-bag-inner">
        {head}
        <ul className="ord-lines">
          {bag.lines.map((l) => (
            <li key={l.key}>
              <div>
                <p className="ord-line-name">{l.name}</p>
                {l.options.length > 0 && <p className="ord-line-meta">{l.options.join(", ")}</p>}
                {l.note && <p className="ord-line-meta">“{l.note}”</p>}
                <Stepper value={l.quantity} onChange={(n) => bag.setQuantity(l.key, n)} label={l.name} />
              </div>
              <p className="ord-line-price">{money(l.unitPrice * l.quantity)}</p>
            </li>
          ))}
        </ul>
        <label className="ord-field">
          <span>Special instructions</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={300}
            rows={2}
            placeholder="Allergies, no onions, sauce on the side…"
          />
        </label>
        <div className="ord-totals">
          <p>
            <span>Subtotal</span>
            <span>{money(bag.subtotal)}</span>
          </p>
          <p className="ord-muted">Tax is added at checkout.</p>
        </div>
        {info && !info.orderingEnabled ? (
          <>
            <p className="ord-notice" role="status">
              Online ordering opens soon. Until then, call us with your order and we’ll have it ready.
            </p>
            <a className="ord-btn ord-btn-primary ord-wide" href={`tel:+1${info.phone.replace(/\D/g, "")}`}>
              <Phone size={16} aria-hidden="true" /> Call {info.phone}
            </a>
          </>
        ) : (
          <button className="ord-btn ord-btn-primary ord-wide" onClick={() => setStep("details")}>
            Continue to pickup details
          </button>
        )}
      </div>
    );

  return (
    <form className="ord-bag-inner" onSubmit={placeOrder}>
      {head}
      <h2 className="ord-step-title">Pickup details</h2>
      <div className="ord-form-grid">
        {fields.map(([key, label, autoComplete, type]) => (
          <label className="ord-field" key={key}>
            <span>{label}</span>
            <input
              required
              type={type}
              autoComplete={autoComplete}
              value={customer[key]}
              onChange={(e) => setCustomer({ ...customer, [key]: e.target.value })}
              maxLength={key === "email" ? 120 : 40}
            />
          </label>
        ))}
      </div>
      <fieldset className="ord-group">
        <legend>Pickup time</legend>
        <label className="ord-option">
          <input type="radio" name="when" checked={when === "asap"} onChange={() => setWhen("asap")} disabled={!info?.openNow} />
          <span>{info?.openNow ? `As soon as possible (about ${info.asapMinutes} min)` : "ASAP — we’re closed right now"}</span>
        </label>
        <label className="ord-option">
          <input type="radio" name="when" checked={when === "later"} onChange={() => setWhen("later")} />
          <span>Schedule for later</span>
        </label>
        {when === "later" && (
          <select className="ord-select" value={slot} onChange={(e) => setSlot(e.target.value)} aria-label="Pickup time" required>
            {info?.slots.map((s) => (
              <option key={s.at} value={s.at}>
                {s.label}
              </option>
            ))}
          </select>
        )}
      </fieldset>
      <div className="ord-totals">
        <p>
          <span>Subtotal</span>
          <span>{quote ? money(quote.subtotal) : money(bag.subtotal)}</span>
        </p>
        <p>
          <span>Tax</span>
          <span>{quote ? money(quote.tax) : "…"}</span>
        </p>
        <p className="ord-total">
          <span>Total</span>
          <span>{quote ? money(quote.total) : "…"}</span>
        </p>
      </div>
      {error && (
        <p className="ord-error" role="alert">
          {error}
        </p>
      )}
      <button className="ord-btn ord-btn-primary ord-wide" type="submit" disabled={busy || !quote}>
        <Lock size={16} aria-hidden="true" /> {busy ? "Opening secure checkout…" : `Pay ${quote ? money(quote.total) : ""} securely`}
      </button>
      <p className="ord-muted ord-center">You’ll pay on Clover’s secure checkout page.</p>
    </form>
  );
}
