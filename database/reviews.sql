-- Create the reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    review_id SERIAL PRIMARY KEY,
    review_text TEXT NOT NULL,
    review_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    inv_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    
    CONSTRAINT fk_inventory
        FOREIGN KEY(inv_id)
        REFERENCES public.inventory(inv_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_account
        FOREIGN KEY(account_id)
        REFERENCES public.account(account_id)
        ON DELETE CASCADE
);

