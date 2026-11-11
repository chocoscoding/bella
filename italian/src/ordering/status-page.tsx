"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, TimerOff, Undo2, ArrowLeft, Printer, Loader2, RotateCw, Phone } from "lucide-react";
import { api, money, type Order } from "./api";
import { BRAND, brandCopy } from "./brand";

const POLL_MS = 3000;
/** How long a returning guest sees "Confirming your payment" before we say it isn't there yet. */
const CONFIRM_GRACE_MS = 15_000;

const telHref = `tel:+1${brandCopy.phone.replace(/\D/g, "")}`;
const dateTime = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(iso));

/**
 * Order result page. With ?pay=1 it forwards straight to Clover Hosted Checkout,
 * so the guest returns here (redirect URL in production, Back button in local
 * dev) and sees the invoice or what went wrong.
 */
export function StatusPage() {
  const params = useSearchParams();
  const ref = params.get("ref") || "";
  const forward = params.get("pay") === "1";
  const declined = params.get("result") === "failed";
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [since] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const left = useRef(false);

  // Coming back from Clover via the Back button may restore this page from the
  // back/forward cache, mid-redirect. Reload so we fetch the outcome.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => e.persisted && location.reload();
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  useEffect(() => {
    if (!ref) return setError("We couldn’t find an order reference in this link.");
    let timer: ReturnType<typeof setTimeout>;
    let live = true;
    const load = () =>
      api
        .order(ref)
        .then((o) => {
          if (!live) return;
          setOrder(o);
          setNow(Date.now());
          setError("");
          if (forward && o.status === "awaiting_payment" && o.checkoutUrl && !left.current) {
            left.current = true;
            history.replaceState(null, "", `/order/status?ref=${o.ref}`);
            return location.assign(o.checkoutUrl);
          }
          if (o.status === "awaiting_payment") timer = setTimeout(load, POLL_MS);
        })
        .catch((e) => {
          if (!live) return;
          setError(e.message);
          timer = setTimeout(load, POLL_MS * 2);
        });
    load();
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [ref, forward]);

  useEffect(() => {
    if (order?.status !== "paid") return;
    try {
      localStorage.removeItem(`bella-bag-${BRAND}`);
    } catch {}
  }, [order?.status]);

  if (forward || !order) {
    return (
      <Shell>
        <div className="ord-state ord-state-card" role={error && !order ? "alert" : "status"}>
          {error && !order ? (
            <>
              <p>{error}</p>
              <a className="ord-btn" href="/order">
                Back to ordering
              </a>
            </>
          ) : (
            <>
              <Loader2 className="ord-spin" size={32} aria-hidden="true" />
              <p>{forward ? "Taking you to secure checkout…" : "Confirming your payment…"}</p>
            </>
          )}
        </div>
      </Shell>
    );
  }

  if (order.status === "paid" || order.status === "refunded") return <Invoice order={order} />;

  if (order.status === "awaiting_payment") {
    if (!declined && now - since < CONFIRM_GRACE_MS)
      return (
        <Shell>
          <div className="ord-state ord-state-card" role="status">
            <Loader2 className="ord-spin" size={32} aria-hidden="true" />
            <p>Confirming your payment…</p>
          </div>
        </Shell>
      );
    return (
      <Outcome
        tone="error"
        icon={declined ? <XCircle size={44} /> : <Undo2 size={44} />}
        title={declined ? "Your payment didn’t go through" : "Payment not completed"}
        lead={
          declined
            ? "Your card wasn’t charged. Check the card details or try a different card."
            : "We haven’t received a payment for this order, so nothing has been charged. If you just paid, this page will update in a moment."
        }
        order={order}
        primary={order.checkoutUrl ? { href: order.checkoutUrl, label: declined ? "Try again" : "Return to secure checkout", icon: <RotateCw size={16} /> } : undefined}
      />
    );
  }

  if (order.status === "failed")
    return (
      <Outcome
        tone="error"
        icon={<XCircle size={44} />}
        title="Your payment didn’t go through"
        lead="Your card wasn’t charged and the order wasn’t sent to the kitchen. Your cart is saved, so you can try again with another card."
        order={order}
      />
    );

  return (
    <Outcome
      tone="error"
      icon={<TimerOff size={44} />}
      title="Checkout timed out"
      lead="The secure checkout closes after 15 minutes. Nothing was charged, and your cart is saved."
      order={order}
    />
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="ord ord-status">{children}</div>;
}

function Outcome({
  tone,
  icon,
  title,
  lead,
  order,
  primary,
}: {
  tone: "error";
  icon: React.ReactNode;
  title: string;
  lead: string;
  order: Order;
  primary?: { href: string; label: string; icon: React.ReactNode };
}) {
  return (
    <Shell>
      <div className={`ord-receipt is-${tone}`} role="alert">
        <div className="ord-receipt-icon" aria-hidden="true">
          {icon}
        </div>
        <p className="ord-eyebrow">Order {order.ref}</p>
        <h1>{title}</h1>
        <p className="ord-receipt-lead">{lead}</p>
        <div className="ord-actions">
          {primary && (
            <a className="ord-btn ord-btn-primary" href={primary.href}>
              {primary.icon} {primary.label}
            </a>
          )}
          <a className={`ord-btn ${primary ? "" : "ord-btn-primary"}`} href="/order">
            <ArrowLeft size={16} aria-hidden="true" /> Back to your cart
          </a>
        </div>
        <p className="ord-muted ord-help">
          Need a hand? Call us at{" "}
          <a className="ord-link" href={telHref}>
            {brandCopy.phone}
          </a>
          .
        </p>
      </div>
    </Shell>
  );
}

function Invoice({ order }: { order: Order }) {
  const refunded = order.status === "refunded";
  const card = order.payment?.last4 ? `${order.payment.cardType || "Card"} ···· ${order.payment.last4}` : "Card";
  return (
    <Shell>
      <article className="ord-receipt ord-invoice is-paid" aria-labelledby="invoice-title">
        <div className="ord-receipt-icon" aria-hidden="true">
          <CheckCircle2 size={44} />
        </div>
        <p className="ord-eyebrow">{refunded ? "Refunded" : "Payment received"}</p>
        <h1 id="invoice-title">{refunded ? "This order was refunded" : `${brandCopy.thanks}, ${order.firstName}!`}</h1>
        {!refunded && (
          <p className="ord-receipt-lead">
            Your order is in. We’ll have it ready for pickup <strong>{order.pickup.asap ? "in about 20 minutes" : order.pickup.label}</strong>.
          </p>
        )}

        <dl className="ord-invoice-meta">
          <div>
            <dt>Order</dt>
            <dd>{order.ref}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{dateTime(order.payment?.paidAt || order.createdAt)}</dd>
          </div>
          <div>
            <dt>Pickup</dt>
            <dd>{order.pickup.label}</dd>
          </div>
          <div>
            <dt>Paid with</dt>
            <dd>{card}</dd>
          </div>
        </dl>

        <ul className="ord-lines ord-receipt-lines">
          {order.lines.map((l, i) => (
            <li key={i}>
              <div>
                <p className="ord-line-name">
                  {l.quantity} × {l.name}
                </p>
                {l.modifiers.length > 0 && <p className="ord-line-meta">{l.modifiers.map((m) => m.name).join(", ")}</p>}
                {l.note && <p className="ord-line-meta">“{l.note}”</p>}
              </div>
              <p className="ord-line-price">{money(l.lineTotal)}</p>
            </li>
          ))}
        </ul>
        <div className="ord-totals">
          <p>
            <span>Subtotal</span>
            <span>{money(order.totals.subtotal)}</span>
          </p>
          <p>
            <span>Tax</span>
            <span>{money(order.totals.tax)}</span>
          </p>
          <p className="ord-total">
            <span>{refunded ? "Refunded" : "Paid"}</span>
            <span>{money(order.totals.total)}</span>
          </p>
        </div>

        <div className="ord-invoice-from">
          <strong>{brandCopy.name}</strong>
          <span>{brandCopy.address}</span>
          <a href={telHref}>{brandCopy.phone}</a>
        </div>

        <div className="ord-actions ord-no-print">
          <button className="ord-btn" onClick={() => window.print()}>
            <Printer size={16} aria-hidden="true" /> Print receipt
          </button>
          <a className="ord-btn ord-btn-primary" href={brandCopy.homeHref}>
            {brandCopy.homeLabel}
          </a>
        </div>
        <p className="ord-muted ord-note ord-no-print">
          <Phone size={13} aria-hidden="true" /> Running late or need a change? Call {brandCopy.phone}.
        </p>
      </article>
    </Shell>
  );
}
