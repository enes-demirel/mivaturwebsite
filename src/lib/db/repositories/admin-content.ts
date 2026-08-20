import "server-only";
import { all, dbBoolean, first, run } from "@/lib/db/query";
import type { BlogPostInput, DestinationInput } from "@/lib/validation/admin-content";

export type BlogAdminRow = BlogPostInput & { id:string;cover_image_path:string|null;created_at:string;updated_at:string };
type BlogDbRow=Omit<BlogAdminRow,"excerpt"|"content">&{excerpt:string|null;content:string|null};
export type DestinationAdminRow = DestinationInput & { id:string;created_at:string;updated_at:string };
type DestinationDbRow=Omit<DestinationAdminRow,"map_featured"|"mobile_visible">&{map_featured:number;mobile_visible:number};

const mapBlog=(row:BlogDbRow):BlogAdminRow=>({...row,excerpt:row.excerpt??"",content:row.content??""});
export const listAdminBlogs=async()=>(await all<BlogDbRow>("SELECT * FROM blog_posts ORDER BY updated_at DESC")).map(mapBlog);
export const findAdminBlog=async(id:string)=>{const row=await first<BlogDbRow>("SELECT * FROM blog_posts WHERE id=?",[id]);return row?mapBlog(row):null;};
export async function saveBlog(id:string|null,input:BlogPostInput){const stamp=new Date().toISOString();if(id){await run("UPDATE blog_posts SET title=?,slug=?,excerpt=?,content=?,status=?,published_at=?,seo_title=?,seo_description=?,updated_at=? WHERE id=?",[input.title,input.slug,input.excerpt,input.content,input.status,input.status==="published"?(input.published_at??stamp):input.published_at,input.seo_title,input.seo_description,stamp,id]);return id;}const next=crypto.randomUUID();await run("INSERT INTO blog_posts (id,title,slug,excerpt,content,status,published_at,seo_title,seo_description,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)",[next,input.title,input.slug,input.excerpt,input.content,input.status,input.status==="published"?(input.published_at??stamp):input.published_at,input.seo_title,input.seo_description,stamp,stamp]);return next;}
export const deleteBlog=(id:string)=>run("DELETE FROM blog_posts WHERE id=? AND status='draft'",[id]);

export const listAdminDestinations=async()=>(await all<DestinationDbRow>("SELECT * FROM destinations ORDER BY map_order,name")).map(row=>({...row,map_featured:dbBoolean(row.map_featured),mobile_visible:dbBoolean(row.mobile_visible)}));
export const findAdminDestination=async(id:string)=>{const row=await first<DestinationDbRow>("SELECT * FROM destinations WHERE id=?",[id]);return row?{...row,map_featured:dbBoolean(row.map_featured),mobile_visible:dbBoolean(row.mobile_visible)}:null;};
export async function saveDestination(id:string|null,input:DestinationInput){const stamp=new Date().toISOString(),v=[input.name,input.slug,input.country_code,input.type,input.short_description,input.content,input.map_longitude,input.map_latitude,input.map_order,input.map_featured?1:0,input.mobile_visible?1:0,input.status,input.seo_title,input.seo_description,stamp];if(id){await run("UPDATE destinations SET name=?,slug=?,country_code=?,type=?,short_description=?,content=?,map_longitude=?,map_latitude=?,map_order=?,map_featured=?,mobile_visible=?,status=?,seo_title=?,seo_description=?,updated_at=? WHERE id=?",[...v,id]);return id;}const next=crypto.randomUUID();await run("INSERT INTO destinations (id,name,slug,country_code,type,short_description,content,map_longitude,map_latitude,map_order,map_featured,mobile_visible,status,seo_title,seo_description,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[next,...v.slice(0,-1),stamp,stamp]);return next;}
export const deleteDestination=(id:string)=>run("DELETE FROM destinations WHERE id=? AND status='draft'",[id]);
