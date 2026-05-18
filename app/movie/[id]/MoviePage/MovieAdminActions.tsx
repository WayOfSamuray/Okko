import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "../MoviePage.module.css";

const AdminActions = ({ movieId }: { movieId: string }) => {
  const router = useRouter();

  const handleDelete = async () => {
    const ok = confirm("Удалить фильм?");
    if (!ok) return;

    const res = await fetch(`/api/movies/${movieId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      alert("Ошибка удаления");
      return;
    }

    router.push("/");
  };

  return (
    <div className={styles.adminActions}>
      <button
        className={styles.editBtn}
        onClick={() => router.push(`/admin/edit/${movieId}`)}
      >
        <Pencil size={18} />
      </button>

      <button className={styles.deleteBtn} onClick={handleDelete}>
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default AdminActions;
