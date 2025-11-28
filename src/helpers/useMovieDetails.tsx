import { useState } from "react";

const API_KEY = "BrphHnqW47OlnLBamWYkEBDyLk5jDvIfJxuo0MnM";

export type MovieDetails = {
    id: number;
    title: string;
    plot_overview?: string;
    runtime_minutes?: number;
    year?: number;
    genre_names?: string[];
    user_rating?: number;
    poster?: string;
    trailer?: string;
};

type Status = 'idle' | 'loading' | 'success' | 'error';

export const useMovieDetails = () => {
    const [details, setDetails] = useState<MovieDetails | null>(null);
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState<string | null>(null);

    const fetchDetails = async (id: number) => {
        if (!id) return;
        setStatus('loading');
        setError('error');

        try {
            const url = `https://api.watchmode.com/v1/title/${id}/details/?apiKey=${API_KEY}`;
            const res = await fetch(url);
            if(!res.ok) {
                throw new Error(`HTTP error: ${res.status}`);
            }
            const data: MovieDetails = await res.json();
            setDetails(data);
            setStatus('success');
        } catch (e) {
            setError('Не удалось загрузить данные');
            setStatus('error')
        }
    };
    return {details, status, error, fetchDetails};
};