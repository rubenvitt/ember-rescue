import {useEffect, useState} from "react";
import Database from '@tauri-apps/plugin-sql';

export function useDatabase() {
    const [database, setDatabase] = useState<Database>()

    useEffect(() => {
        Database.load("sqlite:main.db").then(db => {
            setDatabase(db);
        });
    }, []);

    return {
        database,
    };
}