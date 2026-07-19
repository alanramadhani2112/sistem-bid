# Midtrans deferred integration

Status: deferred. Core MVP intentionally uses internal manual wallet top-up only.

Reference docs:
- https://docs.midtrans.com/reference/quick-start-1

Current core behavior:
- Wallet top-up is manual/internal through `POST /wallet/topup`.
- Bidding only checks `wallet.balance >= bid amount`.
- Bidding does not hold, deduct, settle, refund, or call payment gateway.
- Winner determination does not create payment or settlement records.

Later implementation boundary:
1. Add Midtrans package/config/env only when payment gateway task starts.
2. Replace manual top-up with `TopUpRequest` lifecycle and Snap token creation.
3. Add webhook controller with signature verification and idempotent status updates.
4. Convert successful payment notification into immutable `wallet_transactions` top-up row.
5. Keep wallet ledger as source of truth; never trust client-side payment result.

Required future checks:
- Webhook signature validation.
- Idempotency by order/reference ID.
- Replay-safe status transitions.
- Test sandbox payment success/failure/expiry.
- No bid settlement until product explicitly defines auction payment flow.
