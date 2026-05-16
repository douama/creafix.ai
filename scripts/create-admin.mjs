#!/usr/bin/env node
/**
 * Crée un utilisateur admin dans Supabase :
 *   1. Crée le user via Supabase Auth Admin API (email auto-confirmé)
 *   2. Insert / upgrade son profil dans monetiq.user_profiles avec role='ADMIN'
 *
 * Usage :
 *   node scripts/create-admin.mjs <email> [full_name]
 *
 * Le mot de passe est demandé en stdin (caché).
 *
 * Requires (dans .env.local) :
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { createInterface } from "node:readline";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

// Charge .env.local manuellement (sans dépendance dotenv)
async function loadEnv() {
  try {
    const file = await readFile(path.resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of file.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch (e) {
    console.warn("⚠️  .env.local introuvable — utilise les vars d'environnement existantes.");
  }
}

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const stdout = process.stdout;
    // Hack pour masquer la saisie
    const onData = (char) => {
      char = char + "";
      switch (char) {
        case "\n":
        case "\r":
        case "":
          process.stdin.removeListener("data", onData);
          break;
        default:
          stdout.clearLine?.(0);
          stdout.cursorTo?.(0);
          stdout.write(question + "•".repeat(rl.line.length));
          break;
      }
    };
    process.stdin.on("data", onData);
    rl.question(question, (answer) => {
      rl.close();
      stdout.write("\n");
      resolve(answer);
    });
  });
}

function ask(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  await loadEnv();

  const [, , emailArg, fullNameArg] = process.argv;
  let email = emailArg;

  if (!email) {
    email = (await ask("Email admin : ")).trim();
  }
  if (!email || !email.includes("@")) {
    console.error("❌ Email invalide.");
    process.exit(1);
  }

  const password = await askHidden("Mot de passe (min. 8 caractères) : ");
  if (!password || password.length < 8) {
    console.error("❌ Mot de passe trop court (min. 8 caractères).");
    process.exit(1);
  }

  const fullName = fullNameArg || email.split("@")[0];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("❌ NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant.");
    process.exit(1);
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`\n🔐 Création de l'utilisateur admin "${email}"…`);

  // 1. Vérifie si un user existe déjà
  const { data: existing } = await admin.auth.admin.listUsers();
  const existingUser = existing?.users?.find((u) => u.email === email);

  let userId;
  if (existingUser) {
    console.log(`ℹ️  User existe déjà (id=${existingUser.id}) — mise à jour password + role.`);
    const { error: updErr } = await admin.auth.admin.updateUserById(existingUser.id, {
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, is_admin: true },
    });
    if (updErr) {
      console.error("❌ Échec update user :", updErr.message);
      process.exit(1);
    }
    userId = existingUser.id;
  } else {
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, is_admin: true },
    });
    if (createErr) {
      console.error("❌ Échec création user :", createErr.message);
      process.exit(1);
    }
    userId = created.user?.id;
    console.log(`✅ Auth user créé (id=${userId})`);
  }

  if (!userId) {
    console.error("❌ Aucun userId retourné par Supabase.");
    process.exit(1);
  }

  // 2. Upsert dans monetiq.user_profiles avec role='ADMIN'
  // On utilise execute_sql via le client postgres car le schema monetiq n'est pas exposé par défaut via PostgREST
  console.log("📝 Insertion / upgrade du profil admin dans monetiq.user_profiles…");

  const { error: rpcErr } = await admin.rpc("set_admin_role", {
    p_user_id: userId,
    p_email: email,
    p_full_name: fullName,
  });

  if (rpcErr && rpcErr.code !== "PGRST202" && rpcErr.code !== "42883") {
    // 42883 = function does not exist — on tombe en fallback SQL direct
    console.error("⚠️  RPC set_admin_role :", rpcErr.message);
  }

  // Fallback : exécuter du SQL brut via une requête (besoin de pg ou PostgREST)
  // Comme PostgREST n'expose pas le schéma `monetiq`, on doit créer une RPC dans la DB.
  // Si la RPC n'existe pas encore, on guide l'utilisateur :
  if (rpcErr) {
    console.log("\n⚠️  La fonction RPC set_admin_role n'existe pas encore.");
    console.log("    Va dans Supabase Studio → SQL Editor et exécute ce SQL :\n");
    console.log("    -- =========================================");
    console.log(`    INSERT INTO monetiq.user_profiles (id, email, full_name, role)`);
    console.log(`    VALUES ('${userId}', '${email}', '${fullName}', 'ADMIN')`);
    console.log(`    ON CONFLICT (id) DO UPDATE SET role = 'ADMIN', email = EXCLUDED.email,`);
    console.log(`        full_name = EXCLUDED.full_name, updated_at = now();`);
    console.log("    -- =========================================\n");
    console.log("    Ou applique la migration 0003 (voir supabase/migrations/0003_admin_rpc.sql)");
  } else {
    console.log("✅ Profil admin enregistré dans monetiq.user_profiles");
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ ADMIN CRÉÉ AVEC SUCCÈS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Email     : ${email}`);
  console.log(`User ID   : ${userId}`);
  console.log(`Rôle      : ADMIN`);
  console.log("\n👉 Connecte-toi via /login puis accède à /admin");
}

main().catch((err) => {
  console.error("❌ Erreur fatale :", err);
  process.exit(1);
});
