"use server";

import { revalidatePath } from "next/cache";
import { updateUser } from "../utils/db";

export async function saveAvatar(url: string) {
  await updateUser({ avatar: url });
  revalidatePath("/");
}