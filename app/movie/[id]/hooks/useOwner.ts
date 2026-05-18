import { useEffect, useState } from "react";

export const useOwner = (movie: any) => {
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOwner = async () => {
      if (!movie) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          setIsOwner(false);
          return;
        }

        const user = await res.json();

        setIsOwner(user.id === movie.userId);
      } catch (err) {
        console.error("Owner check error:", err);
        setIsOwner(false);
      } finally {
        setLoading(false);
      }
    };

    checkOwner();
  }, [movie?.userId]);

  return { isOwner, loading };
};
