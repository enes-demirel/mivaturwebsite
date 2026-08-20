import "server-only";

import { all, batch, dbBoolean, first, run } from "@/lib/db/query";

export type TourRow = { id:string; title:string; slug:string; type:"international"|"domestic"; region:string|null; short_description:string; long_description:string|null; duration_days:number; duration_nights:number; transportation_type:string|null; visa_status:string|null; cover_image_path:string|null; pdf_path:string|null; room_occupancy_label:string|null; single_room_supplement:number|null; single_room_supplement_currency:"EUR"|"USD"|"TRY"|null; featured_home:boolean; featured_order:number; status:"draft"|"published"|"archived"; seo_title:string|null; seo_description:string|null; created_at:string; updated_at:string };
export type DepartureRow = { id:string; tour_id:string; start_date:string; end_date:string; departure_city:string; arrival_point:string|null; price:number; currency:"EUR"|"USD"|"TRY"; previous_price:number|null; airline:string|null; transportation_note:string|null; status:"available"|"planned"|"sold-out"; created_at:string; updated_at:string };
type TourDbRow = Omit<TourRow,"featured_home"> & { featured_home:number };

function tour(row: TourDbRow): TourRow { return { ...row, featured_home: dbBoolean(row.featured_home) }; }

export async function listAdminTours() {
  const rows = await all<TourDbRow>("SELECT * FROM tours ORDER BY CASE status WHEN 'published' THEN 0 WHEN 'draft' THEN 1 ELSE 2 END, updated_at DESC");
  return Promise.all(rows.map(async (row) => ({ ...tour(row), tour_departures: await all<DepartureRow>("SELECT * FROM tour_departures WHERE tour_id = ? ORDER BY start_date", [row.id]) })));
}
export async function findTour(id:string) { const row=await first<TourDbRow>("SELECT * FROM tours WHERE id = ?",[id]); return row ? tour(row) : null; }
export async function listDepartures(id:string) { return all<DepartureRow>("SELECT * FROM tour_departures WHERE tour_id = ? ORDER BY start_date",[id]); }
export async function createTour(data: Omit<TourRow,"id"|"created_at"|"updated_at"|"cover_image_path"|"pdf_path">, departures: readonly Omit<DepartureRow,"id"|"tour_id"|"created_at"|"updated_at">[]) {
  const id=crypto.randomUUID(), now=new Date().toISOString();
  const columns=["id","title","slug","type","region","short_description","long_description","duration_days","duration_nights","transportation_type","visa_status","room_occupancy_label","single_room_supplement","single_room_supplement_currency","featured_home","featured_order","status","seo_title","seo_description","created_at","updated_at"];
  const values=[id,data.title,data.slug,data.type,data.region,data.short_description,data.long_description,data.duration_days,data.duration_nights,data.transportation_type,data.visa_status,data.room_occupancy_label,data.single_room_supplement,data.single_room_supplement_currency,data.featured_home?1:0,data.featured_order,data.status,data.seo_title,data.seo_description,now,now];
  await batch([{sql:`INSERT INTO tours (${columns.join(",")}) VALUES (${columns.map(()=>"?").join(",")})`,values},...departures.map((d)=>({sql:"INSERT INTO tour_departures (id,tour_id,start_date,end_date,departure_city,arrival_point,price,currency,previous_price,airline,transportation_note,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",values:[crypto.randomUUID(),id,d.start_date,d.end_date,d.departure_city,d.arrival_point,d.price,d.currency,d.previous_price,d.airline,d.transportation_note,d.status,now,now]}))]); return id;
}
export async function updateTour(id:string, data: Omit<TourRow,"id"|"created_at"|"updated_at"|"cover_image_path"|"pdf_path">, departures: readonly (Omit<DepartureRow,"tour_id"|"created_at"|"updated_at">)[]) {
  const now=new Date().toISOString();
  await batch([{sql:"UPDATE tours SET title=?,slug=?,type=?,region=?,short_description=?,long_description=?,duration_days=?,duration_nights=?,transportation_type=?,visa_status=?,room_occupancy_label=?,single_room_supplement=?,single_room_supplement_currency=?,featured_home=?,featured_order=?,status=?,seo_title=?,seo_description=?,updated_at=? WHERE id=?",values:[data.title,data.slug,data.type,data.region,data.short_description,data.long_description,data.duration_days,data.duration_nights,data.transportation_type,data.visa_status,data.room_occupancy_label,data.single_room_supplement,data.single_room_supplement_currency,data.featured_home?1:0,data.featured_order,data.status,data.seo_title,data.seo_description,now,id]},{sql:"DELETE FROM tour_departures WHERE tour_id=?",values:[id]},...departures.map((d)=>({sql:"INSERT INTO tour_departures (id,tour_id,start_date,end_date,departure_city,arrival_point,price,currency,previous_price,airline,transportation_note,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",values:[d.id||crypto.randomUUID(),id,d.start_date,d.end_date,d.departure_city,d.arrival_point,d.price,d.currency,d.previous_price,d.airline,d.transportation_note,d.status,now,now]}))]);
}
export async function setTourStatus(id:string,status:TourRow["status"]) { return run("UPDATE tours SET status=?,updated_at=? WHERE id=?",[status,new Date().toISOString(),id]); }
export async function deleteDraftTour(id:string) { return run("DELETE FROM tours WHERE id=? AND status='draft'",[id]); }
export async function departureCount(id:string) { const row=await first<{count:number}>("SELECT COUNT(*) count FROM tour_departures WHERE tour_id=?",[id]); return row?.count??0; }
export type InstallmentRow={id:string;tour_id:string;installment_number:number;due_date:string;created_at:string;updated_at:string};
export async function listInstallments(id:string){return all<InstallmentRow>("SELECT * FROM tour_installments WHERE tour_id=? ORDER BY installment_number",[id]);}
export async function replaceInstallments(id:string,dates:readonly string[]){const stamp=new Date().toISOString();await batch([{sql:"DELETE FROM tour_installments WHERE tour_id=?",values:[id]},...dates.map((dueDate,index)=>({sql:"INSERT INTO tour_installments (id,tour_id,installment_number,due_date,created_at,updated_at) VALUES (?,?,?,?,?,?)",values:[crypto.randomUUID(),id,index+1,dueDate,stamp,stamp]}))]);}
