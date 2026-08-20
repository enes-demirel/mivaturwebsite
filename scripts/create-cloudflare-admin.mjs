import { pbkdf2Sync, randomBytes, randomUUID } from "node:crypto";
import { chmodSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import passwordConfig from "../src/lib/auth/password-config.json" with { type: "json" };

const terminal=createInterface({input:process.stdin,output:process.stdout});
let sqlFile;
try {
  const email=(await terminal.question("Admin e-posta: ")).trim().toLowerCase();
  const displayName=(await terminal.question("Görünen ad: ")).trim();
  const password=await terminal.question("Şifre: ");
  const remote=(await terminal.question("Remote D1 kullanılsın mı? [y/N]: ")).trim().toLowerCase()==="y";
  if (!/^\S+@\S+\.\S+$/.test(email)||password.length<12) throw new Error("Geçerli e-posta ve en az 12 karakterli şifre gerekli.");
  const salt=randomBytes(passwordConfig.saltLengthBytes), iterations=passwordConfig.iterations;
  const passwordHash=`${passwordConfig.algorithm}$${iterations}$${salt.toString("base64")}$${pbkdf2Sync(password,salt,iterations,passwordConfig.keyLengthBytes,"sha256").toString("base64")}`;
  const quote=(value)=>`'${value.replaceAll("'","''")}'`;
  const now=new Date().toISOString();
  sqlFile=join(tmpdir(),`mivatur-admin-${randomUUID()}.secret.sql`);
  writeFileSync(sqlFile,`INSERT INTO admin_users (id,email,display_name,password_hash,active,created_at,updated_at) VALUES (${quote(randomUUID())},${quote(email)},${displayName?quote(displayName):"NULL"},${quote(passwordHash)},1,${quote(now)},${quote(now)}) ON CONFLICT(email) DO UPDATE SET display_name=excluded.display_name,password_hash=excluded.password_hash,active=1,updated_at=excluded.updated_at;\n`,{mode:0o600});
  chmodSync(sqlFile,0o600);
  const result=spawnSync("npx",["wrangler","d1","execute","mivatur-db",remote?"--remote":"--local","--file",sqlFile],{stdio:"inherit"});
  if (result.status!==0) process.exitCode=result.status??1;
} finally {
  terminal.close();
  if (sqlFile) try { unlinkSync(sqlFile); } catch {}
}
