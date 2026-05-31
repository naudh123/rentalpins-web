/** Resolve staging vs production from env (build-time). */

export type DeployEnv = "staging" | "production";

export function resolveDeployEnv(): DeployEnv {
  const explicit = process.env.NEXT_PUBLIC_DEPLOY_ENV?.trim().toLowerCase();
  if (explicit === "production") return "production";
  if (explicit === "staging") return "staging";

  const bp = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || "";
  if (bp === "/staging") return "staging";

  return "production";
}

export function resolveShowStagingBanner(deployEnv: DeployEnv): boolean {
  return deployEnv === "staging";
}
