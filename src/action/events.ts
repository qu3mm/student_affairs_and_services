"use server"

import { createClient } from "@/utils/supabase/server";

export default async function fetchEvent() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    return { data, error }; 

        
}
