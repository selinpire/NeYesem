/** Tek tip API çıktısı: metin, kullanıcı adı, tarih, silme yetkisi için userId */
function toPublicComment(c) {
  const o = c && typeof c.toObject === "function" ? c.toObject() : { ...c };
  return {
    _id: o._id,
    text: o.text,
    createdAt: o.createdAt,
    userName: (o.userName || o.user || "").trim() || "Kullanıcı",
    userId: o.userId ?? null,
  };
}

function toPublicComments(arr) {
  if (!arr || !arr.length) return [];
  return arr.map(toPublicComment);
}

module.exports = { toPublicComment, toPublicComments };
