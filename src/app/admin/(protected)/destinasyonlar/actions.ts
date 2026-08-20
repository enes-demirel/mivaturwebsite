"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { deleteDestination, saveDestination } from "@/lib/db/repositories/admin-content";
import { first } from "@/lib/db/query";
import { createTurkishSlug } from "@/lib/turkish-slug";
import { destinationSchema } from "@/lib/validation/admin-content";
const uuid=z.uuid();const text=(data:FormData,key:string)=>{const value=data.get(key);return typeof value==="string"?value:"";};
export async function saveDestinationAction(id:string|null,data:FormData){await requireAdmin();if(id&&!uuid.safeParse(id).success)redirect("/admin/destinasyonlar?error=1");const parsed=destinationSchema.safeParse({name:text(data,"name"),slug:createTurkishSlug(text(data,"slug")||text(data,"name")),country_code:text(data,"country_code").toUpperCase(),type:text(data,"type"),short_description:text(data,"short_description"),content:text(data,"content"),map_longitude:text(data,"map_longitude"),map_latitude:text(data,"map_latitude"),map_order:text(data,"map_order")||"0",map_featured:data.get("map_featured")==="on",mobile_visible:data.get("mobile_visible")==="on",status:text(data,"status"),seo_title:text(data,"seo_title"),seo_description:text(data,"seo_description")});if(!parsed.success)redirect(`${id?`/admin/destinasyonlar/${id}`:"/admin/destinasyonlar/yeni"}?error=validation`);let next:string;try{next=await saveDestination(id,parsed.data);}catch{redirect(`${id?`/admin/destinasyonlar/${id}`:"/admin/destinasyonlar/yeni"}?error=slug`);}revalidatePath("/admin/destinasyonlar");revalidatePath("/sitemap.xml");redirect(`/admin/destinasyonlar/${next}?saved=1`);}
export async function deleteDestinationAction(data:FormData){await requireAdmin();const id=text(data,"id");if(!uuid.safeParse(id).success)redirect("/admin/destinasyonlar");const linked=(await first<{count:number}>("SELECT COUNT(*) count FROM tour_destinations WHERE destination_id=?",[id]))?.count??0;if(linked>0)redirect(`/admin/destinasyonlar/${id}?error=linked`);try{await deleteDestination(id);}catch{redirect(`/admin/destinasyonlar/${id}?error=delete`);}revalidatePath("/admin/destinasyonlar");redirect("/admin/destinasyonlar");}
