module landledger::farmland_simple {
    use std::string::{Self, String};
    use std::signer;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    /// Stored farm struct
    struct Farm has store {
        id: u64,
        owner: address,
        name: String,
        location: String,
        total_tokens: u64,
        tokens_sold: u64,
        price_per_token: u64 // in Octas
    }

    /// Registry resource under an account
    struct FarmRegistry has key {
        farms: vector<Farm>,
        next_id: u64
    }

    /// One-time registry initializer
    public entry fun init(account: &signer) {
        move_to(account, FarmRegistry {
            farms: vector::empty<Farm>(),
            next_id: 0
        });
    }

    /// Create a new farm listing
    public entry fun create_farm(
        farmer: &signer,
        name: String,
        location: String,
        total_tokens: u64,
        price_per_token: u64
    ) acquires FarmRegistry {
        let addr = signer::address_of(farmer);
        let registry = borrow_global_mut<FarmRegistry>(addr);

        let new_farm = Farm {
            id: registry.next_id,
            owner: addr,
            name,
            location,
            total_tokens,
            tokens_sold: 0,
            price_per_token
        };

        vector::push_back(&mut registry.farms, new_farm);
        registry.next_id = registry.next_id + 1;
    }

    /// Buy tokens from a farm
    public entry fun invest_in_farm(
        investor: &signer,
        farm_index: u64,
        token_amount: u64
    ) acquires FarmRegistry {
        let addr = signer::address_of(investor);
        let registry = borrow_global_mut<FarmRegistry>(addr);
        let farm = vector::borrow_mut(&mut registry.farms, farm_index);

        assert!(farm.tokens_sold + token_amount <= farm.total_tokens, 1);

        let total_cost = token_amount * farm.price_per_token;

        let payment = coin::withdraw<AptosCoin>(investor, total_cost);
        coin::deposit(farm.owner, payment);

        farm.tokens_sold = farm.tokens_sold + token_amount;
    }

    /* ========= VIEW TYPES & FUNCTIONS ========= */

    /// Copyable struct for frontend display
    struct FarmView has copy, drop {
        id: u64,
        owner: address,
        name: String,
        location: String,
        total_tokens: u64,
        tokens_sold: u64,
        price_per_token: u64
    }

    /// Check if an address has a registry
    #[view]
    public fun has_registry(owner: address): bool {
        exists<FarmRegistry>(owner)
    }

    /// Return a copyable list of farms
    #[view]
    public fun get_farms(owner: address): vector<FarmView> acquires FarmRegistry {
        if (!exists<FarmRegistry>(owner)) {
            return vector::empty<FarmView>();
        };
        let reg = borrow_global<FarmRegistry>(owner);
        let len = vector::length(&reg.farms);
        let out = vector::empty<FarmView>();
        let i = 0;
        while (i < len) {
            let f_ref = vector::borrow(&reg.farms, i);
            let view = FarmView {
                id: f_ref.id,
                owner: f_ref.owner,
                name: f_ref.name,
                location: f_ref.location,
                total_tokens: f_ref.total_tokens,
                tokens_sold: f_ref.tokens_sold,
                price_per_token: f_ref.price_per_token,
            };
            vector::push_back(&mut out, view);
            i = i + 1;
        };
        out
    }
}
