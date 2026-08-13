import { cookies } from "next/headers";
import {
  OPERATOR_LANGUAGE_COOKIE,
  copy,
  resolveOperatorLanguage,
  type OperatorLanguage
} from "./i18n.js";

export async function getOperatorLanguage(): Promise<OperatorLanguage> {
  const store = await cookies();
  return resolveOperatorLanguage(store.get(OPERATOR_LANGUAGE_COOKIE)?.value);
}

export async function getOperatorCopy() {
  return copy[await getOperatorLanguage()];
}
