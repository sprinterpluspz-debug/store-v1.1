# Security Specification for Sprinter Plus

## Data Invariants
- A Product must have a name, SKU, and positive price.
- An Order must be linked to a valid user ID.
- Users cannot change their own roles (e.g., promote themselves to admin).
- Only Admins can modify the product catalog or vehicle database.
- Customers can only read their own orders.

## The Dirty Dozen Payloads

1. **Self-Promotion Attack**: User attempts to update their own profile to `role: 'admin'`.
2. **Price Manipulation**: Customer attempts to create an order with a price of 0.01 for an expensive item.
3. **Orphaned Order**: Customer attempts to create an order with a non-existent or invalid `userId`.
4. **Stock Poisoning**: Non-admin attempts to update a product's quantity to 1000000.
5. **Unauthorized Order Read**: User A tries to list or get User B's order.
6. **ID Injection**: Attackers using extremely long strings as product IDs to cause storage overflow (Resource Poisoning).
7. **Negative Price injection**: Admin (or compromised account) setting a product price to -100.
8. **Shadow Field injection**: Adding `isPromoted: true` to a user profile to bypass future checks.
9. **Timestamp Spoofing**: Client providing a `created` date from 1 year ago.
10. **SKU Duplication**: Bypassing SKU uniqueness (though logic-level, rules should check for valid SKU formats).
11. **Massive Array injection**: Order with 10,000 items to cause read/write costs (Denial of Wallet).
12. **Blanket Read attempt**: Querying `/orders` without a `userId` filter.

## Test Strategy
- Verify that every write operation is guarded by `isValid[Entity]`.
- Verify that admin-only paths reject non-admin writes.
- Verify that `affectedKeys().hasOnly()` is used for specific updates.
