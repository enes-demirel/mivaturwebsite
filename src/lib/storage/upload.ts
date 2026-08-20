export async function uploadAdminMedia(file:File,tourId:string,kind:"image"|"pdf") {
  const body=new FormData(); body.set("file",file); body.set("tourId",tourId); body.set("kind",kind);
  const response=await fetch("/api/admin/media/upload",{method:"POST",body});
  if (!response.ok) return null;
  const value:unknown=await response.json();
  return value && typeof value==="object" && "path" in value && typeof value.path==="string" ? value.path : null;
}
