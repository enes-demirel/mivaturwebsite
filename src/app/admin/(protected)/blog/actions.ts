"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { deleteBlog, findAdminBlog, saveBlog } from "@/lib/db/repositories/admin-content";
import { run } from "@/lib/db/query";
import { mediaExists, removeMedia } from "@/lib/storage/r2";
import { isValidBlogStoragePath } from "@/lib/storage/path";
import { createTurkishSlug } from "@/lib/turkish-slug";
import { blogPostSchema } from "@/lib/validation/admin-content";

const uuid=z.uuid();
const text=(data:FormData,key:string)=>{const value=data.get(key);return typeof value==="string"?value:"";};
export async function saveBlogAction(id:string|null,data:FormData){await requireAdmin();if(id&&!uuid.safeParse(id).success)redirect("/admin/blog?error=1");const parsed=blogPostSchema.safeParse({title:text(data,"title"),slug:createTurkishSlug(text(data,"slug")||text(data,"title")),excerpt:text(data,"excerpt"),content:text(data,"content"),status:text(data,"status"),published_at:text(data,"published_at"),seo_title:text(data,"seo_title"),seo_description:text(data,"seo_description")});if(!parsed.success)redirect(`${id?`/admin/blog/${id}`:"/admin/blog/yeni"}?error=validation`);let next:string;try{next=await saveBlog(id,parsed.data);}catch{redirect(`${id?`/admin/blog/${id}`:"/admin/blog/yeni"}?error=slug`);}revalidatePath("/blog");revalidatePath("/admin/blog");redirect(`/admin/blog/${next}?saved=1`);}
export async function deleteBlogAction(data:FormData){await requireAdmin();const id=text(data,"id");if(!uuid.safeParse(id).success)redirect("/admin/blog");const post=await findAdminBlog(id);if(!post||post.status!=="draft")redirect(`/admin/blog/${id}?error=delete`);if(post.cover_image_path)await removeMedia(post.cover_image_path);await deleteBlog(id);revalidatePath("/blog");redirect("/admin/blog");}
export async function registerBlogCoverAction(id:string,path:string){await requireAdmin();if(!isValidBlogStoragePath(path,id)||!await mediaExists(path))return{success:false,message:"Geçersiz görsel yolu."};const post=await findAdminBlog(id);if(!post){await removeMedia(path);return{success:false,message:"Yazı bulunamadı."};}try{await run("UPDATE blog_posts SET cover_image_path=?,updated_at=? WHERE id=?",[path,new Date().toISOString(),id]);if(post.cover_image_path&&post.cover_image_path!==path)await removeMedia(post.cover_image_path);}catch{await run("UPDATE blog_posts SET cover_image_path=?,updated_at=? WHERE id=?",[post.cover_image_path,new Date().toISOString(),id]);await removeMedia(path);return{success:false,message:"Kapak görseli güncellenemedi."};}revalidatePath(`/admin/blog/${id}`);revalidatePath("/blog");return{success:true,message:"Kapak görseli güncellendi."};}
export async function deleteBlogCoverAction(id:string){await requireAdmin();const post=await findAdminBlog(id);if(!post?.cover_image_path||!isValidBlogStoragePath(post.cover_image_path,id))return{success:false,message:"Kapak görseli bulunamadı."};try{await removeMedia(post.cover_image_path);await run("UPDATE blog_posts SET cover_image_path=NULL,updated_at=? WHERE id=?",[new Date().toISOString(),id]);}catch{return{success:false,message:"Kapak görseli silinemedi."};}revalidatePath(`/admin/blog/${id}`);revalidatePath("/blog");return{success:true,message:"Kapak görseli silindi."};}
